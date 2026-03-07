from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import stripe
from typing import Optional
from auth import get_current_user, User
from db import supabase
import os


stripe.api_key = os.getenv("STRIPE_API_KEY")


user_stripe_id = {
    "user_id": "user_stripe_id",
    "0": "",
    "1": ""
}


class CardholderCreate(BaseModel):
    name: str
    email: str
    billing: dict


def create_cardholder(cardholder: CardholderCreate, user: User):
    cardholder = stripe.issuing.Cardholder.create(
        name=cardholder.name,
        email=cardholder.email,
        type="individual",
        billing=cardholder.billing,
    )
    return cardholder


class CreateCard(BaseModel):
    cardholder_id: str
    monthly_limit: Optional[int] = None # In cents


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
            }
        )
    else:
        card = stripe.issuing.Card.create(
            cardholder=card.cardholder_id,
            currency="usd",
            type="virtual",
        )
    return card


def get_cardholder(user_id: str):
    try:
        cardholder = stripe.issuing.Cardholder.retrieve(user_stripe_id[user_id])
        return cardholder
    except stripe.error.InvalidRequestError:
        return None


def get_cardholder_cards(user_id: str):
    try:
        cards = stripe.issuing.Card.list(cardholder=user_stripe_id[user_id])
        return cards
    except stripe.error.InvalidRequestError:
        return None


def get_card(user_id: str, card_id: str):
    try:
        card = stripe.issuing.Card.retrieve(card_id)
        if card.cardholder != user_stripe_id[user_id]:
            return None
        return card
    except stripe.error.InvalidRequestError:
        return None


def get_or_create_cardholder(user: User, name: Optional[str] = None, email: Optional[str] = None, billing: Optional[dict] = None):
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
    user_stripe_id[user.id] = ch.id


    return ch


cards_router = APIRouter()


@cards_router.get("/list")
async def list_cards(current_user: User):
    cardholder = get_cardholder(current_user.id)
    if not cardholder:
        return []


    return stripe.issuing.Card.list(cardholder=cardholder.id)


@cards_router.post("/create/")
async def create_card_route(card: CreateCard, current_user: User, cardholder: Optional[CardholderCreate] = None):
    if cardholder:
        cardholder = get_or_create_cardholder(current_user, cardholder.name, cardholder.email, cardholder.billing)
    else:
        cardholder = get_or_create_cardholder(current_user)
   
    card.cardholder_id = cardholder.id
    new_card = create_card(card)
    return new_card


@cards_router.delete("/{card_id}")
async def cancel_card(card_id: str, current_user: User):
    try:
        card = stripe.issuing.Card.retrieve(card_id)
        if card.cardholder != user_stripe_id[current_user.id]:
             raise HTTPException(status_code=403, detail="Not authorized to cancel this card.")
             
        stripe.issuing.Card.modify(
            card_id,
            status="canceled"
        )
        return {"cancelled": True}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))