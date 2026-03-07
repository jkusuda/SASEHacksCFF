# routes/scans.py
from fastapi import APIRouter, Depends
from auth import get_current_user, User
from db import supabase

scans_router = APIRouter()

@scans_router.get("/")
def list_scans(current_user: User = Depends(get_current_user)):
    return []

@scans_router.get("/{scan_id}")
def get_scan(scan_id: str, current_user: User = Depends(get_current_user)):
    return {}

@scans_router.post("/")
def create_scan(current_user: User = Depends(get_current_user)):
    return {}