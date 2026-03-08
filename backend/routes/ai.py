# routes/ai.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db import supabase
from auth import get_current_user, User
from LLMs.tosreport import analyze_tos
from LLMs.tostranslate import translate_tos
from LLMs.toschat import create_chat, ask

ai_router = APIRouter()

# Store chat sessions in memory keyed by user id
_chat_sessions: dict = {}

# All columns that the three functions fill in
_SCAN_COLUMNS = [
    "tos", "translation", "source_name",
    "data_privacy_score", "data_privacy_just",
    "integrity_score", "integrity_just",
    "consumer_fairness_score", "consumer_fairness_just",
]

class TosRequest(BaseModel):
    tos_text: str


def _find_incomplete_scan(user_id: str):
    """Find the most recent scan row for this user that has at least one NULL column, or return None."""
    rows = (
        supabase.table("scans")
        .select("*")
        .eq("user_id", user_id)
        .order("id", desc=True)
        .limit(1)
        .execute()
    )
    if not rows.data:
        return None
    row = rows.data[0]
    for col in _SCAN_COLUMNS:
        if row.get(col) is None:
            return row
    return None


def _save_to_scan(data: dict, user_id: str):
    """Insert into a new row or update an existing incomplete row for this user."""
    incomplete = _find_incomplete_scan(user_id)
    if incomplete:
        supabase.table("scans").update(data).eq("id", incomplete["id"]).execute()
    else:
        data["user_id"] = user_id
        supabase.table("scans").insert(data).execute()


def _find_by_company(company_name: str, user_id: str):
    """Check if a scan with this company name already exists for this user."""
    rows = (
        supabase.table("scans")
        .select("*")
        .eq("source_name", company_name)
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )
    if rows.data:
        return rows.data[0]
    return None


@ai_router.post("/tos")
def save_tos(body: TosRequest, current_user: User = Depends(get_current_user)):
    """Read the ToS text and save it to the scans table."""
    _save_to_scan({"tos": body.tos_text}, current_user.id)
    return {"tos": body.tos_text}


@ai_router.post("/report")
def get_report(body: TosRequest, current_user: User = Depends(get_current_user)):
    """Return the structured ToS report with scores. Returns cached data if company already scanned."""
    try:
        result = analyze_tos(body.tos_text)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    company_name = result["company_name"]
    existing = _find_by_company(company_name, current_user.id)
    if existing and existing.get("data_privacy_score") is not None:
        return {"report": {
            "company_name": existing["source_name"],
            "data_privacy": {"score": existing["data_privacy_score"], "justification": existing["data_privacy_just"]},
            "integrity": {"score": existing["integrity_score"], "justification": existing["integrity_just"]},
            "consumer_fairness": {"score": existing["consumer_fairness_score"], "justification": existing["consumer_fairness_just"]},
        }, "cached": True}

    _save_to_scan({
        "source_name": company_name,
        "data_privacy_score": result["data_privacy"]["score"],
        "data_privacy_just": result["data_privacy"]["justification"],
        "integrity_score": result["integrity"]["score"],
        "integrity_just": result["integrity"]["justification"],
        "consumer_fairness_score": result["consumer_fairness"]["score"],
        "consumer_fairness_just": result["consumer_fairness"]["justification"],
    }, current_user.id)

    return {"report": result, "cached": False}


@ai_router.post("/translate")
def get_translate(body: TosRequest, current_user: User = Depends(get_current_user)):
    """Return the brainrot-flavored red flag summary. Returns cached data if company already scanned."""
    tos_text = body.tos_text

    # Check if the most recent scan already has a translation
    incomplete = _find_incomplete_scan(current_user.id)
    if incomplete and incomplete.get("source_name"):
        existing = _find_by_company(incomplete["source_name"], current_user.id)
        if existing and existing.get("translation") is not None:
            return {"translation": existing["translation"], "cached": True}

    try:
        result = translate_tos(tos_text)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    _save_to_scan({"translation": result}, current_user.id)

    return {"translation": result, "cached": False}


class ChatRequest(BaseModel):
    message: str
    tos_text: str = None  # optional, to initialize chat


@ai_router.post("/chat")
def chat(body: ChatRequest, current_user: User = Depends(get_current_user)):
    """Send a question about the ToS and get a response. Maintains conversation history per user."""
    user_id = current_user.id
    
    if body.tos_text:
        # Re-initialize chat if new text is provided
        try:
            _chat_sessions[user_id] = create_chat(body.tos_text)
        except RuntimeError as e:
            raise HTTPException(status_code=500, detail=str(e))
            
    if user_id not in _chat_sessions:
        raise HTTPException(status_code=400, detail="No active chat session. Please provide tos_text to start one.")

    session = _chat_sessions[user_id]
    answer = ask(session, body.message)
    return {"response": answer}


@ai_router.post("/chat/reset")
def reset_chat(current_user: User = Depends(get_current_user)):
    """Reset the chat session for the current user."""
    _chat_sessions.pop(current_user.id, None)
    return {"status": "Chat session reset."}
