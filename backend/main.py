"""
Crazy Match - 世界杯预测平台 - FastAPI 后端
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import teams, matches, predict

app = FastAPI(title="Crazy Match API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(teams.router, prefix="/api/teams", tags=["teams"])
app.include_router(matches.router, prefix="/api/matches", tags=["matches"])
app.include_router(predict.router, prefix="/api/predict", tags=["predict"])

@app.get("/")
async def root():
    return {"message": "Crazy Match API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}