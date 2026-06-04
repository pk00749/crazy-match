from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import matches, teams, predict, leaderboard

load_dotenv()

app = FastAPI(title="Crazy Match API", version="1.0.0")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载路由
app.include_router(matches.router, prefix="/api", tags=["matches"])
app.include_router(teams.router, prefix="/api", tags=["teams"])
app.include_router(predict.router, prefix="/api", tags=["predict"])
app.include_router(leaderboard.router, prefix="/api", tags=["leaderboard"])

@app.get("/")
def root():
    return {"message": "Crazy Match API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}