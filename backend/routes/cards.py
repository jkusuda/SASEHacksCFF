from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import stripe
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import stripe
from typing import Optional
from auth import get_current_user, User
from db import supabase
import os


stripe.api_key = os.getenv("STRIPE_API_KEY")

class CardholderCreate(BaseModel):
    name: str
    email: str
    billing: dict


def create_cardholder(cardholder: CardholderCreate, user: User = Depends(get_current_user)):
    cardholder = stripe.issuing.Cardholder.create(
        name=cardholder.name,
        email=cardholder.email,
        type="individual",
        billing=cardholder.billing,
    )
    return cardholder


class CreateCard(BaseModel):
    cardholder_id: Optional[str] = None
    monthly_limit: Optional[int] = None # In cents
    subscription: Optional[str] = None

class CreateCardRequest(BaseModel):
    cardholder: Optional[CardholderCreate] = None
    monthly_limit: Optional[int] = None
    subscription: Optional[str] = None


def create_card(card: CreateCard):
    if card.monthly_limit:
        card = stripe.issuing.Card.create(
            cardholder=card.cardholder_id,
            currency="usd",
            type="virtual",
            spending_controls= {
            "spending_limits": [
                {
                    "amount": card.monthly_limit,  # amount in cents ($100)
                    "interval": "monthly"
                } ]
            },
            metadata={
                "subscription": card.subscription
            }
        )
    else:
        card = stripe.issuing.Card.create(
            cardholder=card.cardholder_id,
            currency="usd",
            type="virtual",
            metadata={
                "subscription": card.subscription
            }
        )
    return card


def get_cardholder(user_id: str):
    try:
        request = (
            supabase.table("profiles")
            .select("stripe_id")
            .eq("id", user_id)
            .execute()
        )
        print(request.data[0]["stripe_id"])
        cardholder = stripe.issuing.Cardholder.retrieve(request.data[0]["stripe_id"])
        return cardholder
    except stripe.error.InvalidRequestError:
        return None


def get_cardholder_cards(user_id: str):
    try:
        request = (
            supabase.table("profiles")
            .select("stripe_id")
            .eq("id", user_id)
            .execute()
        )
        cards = stripe.issuing.Card.list(cardholder=request.data[0]["stripe_id"])
        return cards
    except stripe.error.InvalidRequestError:
        return None


def get_card(user_id: str, card_id: str):
    try:
        request = (
            supabase.table("profiles")
            .select("stripe_id")
            .eq("id", user_id)
            .execute()
        )
        card = stripe.issuing.Card.retrieve(card_id, expand=["number", "cvc"])
        cardholder_id = card.cardholder if isinstance(card.cardholder, str) else card.cardholder.id
        if cardholder_id != request.data[0]["stripe_id"]:
            return None
        return card
    except stripe.error.InvalidRequestError:
        return None


def get_or_create_cardholder(user: User = Depends(get_current_user), name: Optional[str] = None, email: Optional[str] = None, billing: Optional[dict] = None):
    ch = get_cardholder(user.id)
    if ch:
        return ch


    if name == "":
        name = "John Smith"
    if email == "":
        email = "johnsmith@example.com"
    if billing == {}:
        billing = {
            "address": {
                "line1": "123 Street",
                "city": "Dallas",
                "state": "TX",
                "postal_code": "75001",
                "country": "US"
            }
        }


    cardholder_data = CardholderCreate(name = name, email = email, billing = billing)
    ch = create_cardholder(cardholder_data, user)

    chid = ch.id

    response = (
        supabase.table("profiles")
        .update({"stripe_id": chid})
        .eq("id", user.id)
        .execute()
    )

    return ch


cards_router = APIRouter()


@cards_router.get("/")
async def list_cards(current_user: User = Depends(get_current_user)):
    cardholder = get_cardholder(current_user.id)
    if not cardholder:
        return []

    return stripe.issuing.Card.list(cardholder=cardholder.id)


@cards_router.post("/create/")
async def create_card_route(body: CreateCardRequest, current_user: User = Depends(get_current_user)):
    if body.cardholder:
        cardholder = get_or_create_cardholder(current_user, body.cardholder.name, body.cardholder.email, body.cardholder.billing)
    else:
        cardholder = get_or_create_cardholder(current_user)
   
    internal_card = CreateCard(
        cardholder_id=cardholder.id,
        monthly_limit=body.monthly_limit,
        subscription=body.subscription
    )
    new_card = create_card(internal_card)

    return new_card


@cards_router.delete("/{card_id}")
async def cancel_card(card_id: str, current_user: User = Depends(get_current_user)):
    try:
        card = stripe.issuing.Card.retrieve(card_id)
        request = (
            supabase.table("profiles")
            .select("stripe_id")
            .eq("id", current_user.id)
            .execute()
        )
        cardholder_id = card.cardholder if isinstance(card.cardholder, str) else card.cardholder.id
        if cardholder_id != request.data[0]["stripe_id"]:
             raise HTTPException(status_code=403, detail="Not authorized to cancel this card.")
             
        stripe.issuing.Card.modify(
            card_id,
            status="canceled"
        )
        return {"cancelled": True}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@cards_router.get("/{card_id}")
async def get_card_endpoint(card_id: str, current_user: User = Depends(get_current_user)):
    card = get_card(current_user.id, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found or not authorized.")
    return card
