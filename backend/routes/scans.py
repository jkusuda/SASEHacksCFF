# routes/scans.py
from fastapi import APIRouter, Depends, HTTPException
from auth import get_current_user, User
from db import supabase

scans_router = APIRouter()

@scans_router.get("/")
def list_scans(current_user: User = Depends(get_current_user)):
    """Return recent scans for the current user."""
    try:
        rows = (
            supabase.table("scans")
            .select("id, source_name, translation")
            .eq("user_id", current_user.id)
            .order("id", desc=True)
            .limit(50)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    data = rows.data or []
    out = []
    for r in data:
        if not r.get("source_name"):
            continue
        trans = (r.get("translation") or "").strip()
        out.append({
            "id": r["id"],
            "source_name": r.get("source_name"),
            "description": trans[:200] + ("..." if len(trans) > 200 else "") if trans else r.get("source_name") or "Untitled",
        })
    return out

@scans_router.get("/{scan_id}")
def get_scan(scan_id: str, current_user: User = Depends(get_current_user)):
    """Return one scan as report + translation + tos for restoring a past conversation."""
    try:
        rows = (
            supabase.table("scans")
            .select("*")
            .eq("id", scan_id)
            .eq("user_id", current_user.id)
            .limit(1)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    if not rows.data:
        raise HTTPException(status_code=404, detail="Scan not found")
    r = rows.data[0]
    if r.get("data_privacy_score") is None:
        raise HTTPException(status_code=404, detail="Scan has no report yet")
    report = {
        "company_name": r.get("source_name") or "Unknown",
        "data_privacy": {"score": r["data_privacy_score"], "justification": r.get("data_privacy_just") or ""},
        "integrity": {"score": r["integrity_score"], "justification": r.get("integrity_just") or ""},
        "consumer_fairness": {"score": r["consumer_fairness_score"], "justification": r.get("consumer_fairness_just") or ""},
    }
    return {
        "report": report,
        "translation": r.get("translation") or "",
        "tos": r.get("tos") or "",
    }

@scans_router.post("/")
def create_scan(current_user: User = Depends(get_current_user)):
    return {}