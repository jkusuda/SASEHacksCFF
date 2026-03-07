# routes/ai.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from auth import get_current_user, User
from LLMs.tosreport import analyze_tos
from LLMs.tostranslate import translate_tos
from LLMs.toschat import create_chat, ask

ai_router = APIRouter()

# Store chat sessions in memory keyed by user id
_chat_sessions: dict = {}


@ai_router.get("/report")
def get_report(current_user: User = Depends(get_current_user)):
    """Return the structured ToS report with scores."""
    try:
        result = analyze_tos()
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"report": result}


@ai_router.get("/translate")
def get_translate(current_user: User = Depends(get_current_user)):
    """Return the brainrot-flavored red flag summary."""
    try:
        result = translate_tos()
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"translation": result}


class ChatRequest(BaseModel):
    message: str


@ai_router.post("/chat")
def chat(body: ChatRequest, current_user: User = Depends(get_current_user)):
    """Send a question about the ToS and get a response. Maintains conversation history per user."""
    user_id = current_user.id
    if user_id not in _chat_sessions:
        try:
            _chat_sessions[user_id] = create_chat()
        except RuntimeError as e:
            raise HTTPException(status_code=500, detail=str(e))

    session = _chat_sessions[user_id]
    answer = ask(session, body.message)
    return {"response": answer}


@ai_router.post("/chat/reset")
def reset_chat(current_user: User = Depends(get_current_user)):
    """Reset the chat session for the current user."""
    _chat_sessions.pop(current_user.id, None)
    return {"status": "Chat session reset."}
