from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.ai import ai_router
from routes.cards import cards_router
from routes.scans import scans_router

app = FastAPI(title="SASEHacks API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router,    prefix="/ai",    tags=["AI"])
app.include_router(cards_router, prefix="/cards", tags=["Cards"])
app.include_router(scans_router, prefix="/scans", tags=["Scans"])

@app.get("/")
def health():
    return {"status": "ok"}
