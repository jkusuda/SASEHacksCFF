# routes/cards.py
from fastapi import APIRouter, Depends
from auth import get_current_user, User
from db import supabase

cards_router = APIRouter()

@cards_router.get("/")
def list_cards(current_user: User = Depends(get_current_user)):
    # Example logic using the user object
    # response = supabase.table("virtual_cards").select("*").eq("user_id", current_user.id).execute()
    return []

@cards_router.post("/")
def create_card(current_user: User = Depends(get_current_user)):
    return {}

@cards_router.delete("/{card_id}")
def cancel_card(card_id: str, current_user: User = Depends(get_current_user)):
    return {"cancelled": True}