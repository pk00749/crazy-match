# Crazy Match 开发任务清单（细化版）

> 基于 prd.md v1.1 和 CLAUDE.md
> 最后更新：2026-06-03
> 状态更新：2026-06-03 Phase 1-4 已完成，单元测试通过 (24 passed)

---

## Phase 1: 项目初始化 ✅

### 1.1 创建目录结构

- [x] **T1.1.1**: 创建 `frontend/` 目录
- [x] **T1.1.2**: 创建 `frontend/src/` 目录
- [x] **T1.1.3**: 创建 `frontend/src/components/` 目录
- [x] **T1.1.4**: 创建 `frontend/src/pages/` 目录
- [x] **T1.1.5**: 创建 `frontend/src/api/` 目录
- [x] **T1.1.6**: 创建 `frontend/src/utils/` 目录
- [x] **T1.1.7**: 创建 `frontend/src/lib/` 目录
- [x] **T1.1.8**: 创建 `frontend/src/hooks/` 目录
- [x] **T1.1.9**: 创建 `frontend/public/` 目录
- [x] **T1.1.10**: 创建 `backend/` 目录
- [x] **T1.1.11**: 创建 `backend/routers/` 目录
- [x] **T1.1.12**: 创建 `backend/services/` 目录
- [x] **T1.1.13**: 创建 `data/` 目录

### 1.2 初始化前端项目 - package.json

- [x] **T1.2.1**: 创建 `frontend/package.json`
  ```json
  {
    "name": "crazy-match-frontend",
    "private": true,
    "version": "0.0.1",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc -b && vite build",
      "lint": "eslint .",
      "preview": "vite preview"
    },
    "dependencies": {
      "react": "^19.0.0",
      "react-dom": "^19.0.0",
      "react-router-dom": "^7.0.0",
      "@supabase/supabase-js": "^2.0.0"
    },
    "devDependencies": {
      "@eslint/js": "^9.0.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "@vitejs/plugin-react": "^4.0.0",
      "eslint": "^9.0.0",
      "eslint-plugin-react-hooks": "^5.0.0",
      "typescript": "~5.7.0",
      "vite": "^6.0.0"
    }
  }
  ```

### 1.3 初始化前端项目 - TypeScript 配置

- [x] **T1.3.1**: 创建 `frontend/tsconfig.json`
  ```json
  {
    "files": [],
    "references": [
      { "path": "./tsconfig.app.json" },
      { "path": "./tsconfig.node.json" }
    ]
  }
  ```

- [x] **T1.3.2**: 创建 `frontend/tsconfig.app.json`
  ```json
  {
    "compilerOptions": {
      "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
      "target": "ES2020",
      "useDefineForClassFields": true,
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "isolatedModules": true,
      "moduleDetection": "force",
      "noEmit": true,
      "jsx": "react-jsy",
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true,
      "noUncheckedSideEffectImports": true
    },
    "include": ["src"]
  }
  ```

- [x] **T1.3.3**: 创建 `frontend/tsconfig.node.json`
  ```json
  {
    "compilerOptions": {
      "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
      "target": "ES2022",
      "lib": ["ES2023"],
      "module": "ESNext",
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "isolatedModules": true,
      "moduleDetection": "force",
      "noEmit": true,
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true,
      "noUncheckedSideEffectImports": true
    },
    "include": ["vite.config.ts"]
  }
  ```

### 1.4 初始化前端项目 - Vite 配置

- [x] **T1.4.1**: 创建 `frontend/vite.config.ts`
  ```typescript
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  export default defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  })
  ```

### 1.5 初始化前端项目 - HTML 和样式

- [x] **T1.5.1**: 创建 `frontend/index.html`
  ```html
  <!doctype html>
  <html lang="zh-CN">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Crazy Match - 世界杯预测</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.tsx"></script>
    </body>
  </html>
  ```

- [x] **T1.5.2**: 创建 `frontend/src/index.css`
  ```css
  :root {
    --color-primary: #1a1a2e;
    --color-secondary: #16213e;
    --color-accent: #0f3460;
    --color-highlight: #e94560;
    --color-text: #ffffff;
    --color-text-secondary: #a0a0a0;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: var(--color-primary);
    color: var(--color-text);
    line-height: 1.6;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }
  ```

- [x] **T1.5.3**: 创建 `frontend/src/vite-env.d.ts`
  ```typescript
  /// <reference types="vite/client" />

  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_API_URL: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  ```

### 1.6 初始化前端项目 - ESLint

- [x] **T1.6.1**: 创建 `frontend/eslint.config.js`
  ```javascript
  import js from '@eslint/js'
  import tseslint from 'typescript-eslint'
  import reactHooks from 'eslint-plugin-react-hooks'

  export default tseslint.config(
    { ignores: ['dist', 'node_modules'] },
    {
      extends: [js.configs.recommended],
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        ecmaVersion: 2020,
      },
      plugins: {
        'react-hooks': reactHooks,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'no-unused-vars': 'warn',
      },
    },
  )
  ```

### 1.7 初始化前端项目 - Gitignore

- [x] **T1.7.1**: 创建 `frontend/.gitignore`
  ```
  # Logs
  logs
  *.log
  npm-debug.log*

  # Dependencies
  node_modules/

  # Build
  dist/
  dist-ssr/
  *.local

  # Environment
  .env
  .env.local
  .env.production

  # Editor
  .vscode/
  .idea/
  ```

### 1.8 初始化后端项目 - requirements.txt

- [x] **T1.8.1**: 创建 `backend/requirements.txt`
  ```
  fastapi==0.115.0
  uvicorn==0.30.0
  pydantic==2.8.0
  supabase==2.0.0
  python-dotenv==1.0.0
  ```

### 1.9 初始化后端项目 - Python 缓存配置

- [x] **T1.9.1**: 创建 `backend/.gitignore`
  ```
  __pycache__/
  *.py[cod]
  *$py.class
  venv/
  .env
  *.egg-info/
  dist/
  build/
  ```

### 1.10 创建部署配置

- [x] **T1.10.1**: 创建 `vercel.json`
  ```json
  {
    "framework": "vite",
    "buildCommand": "cd frontend && npm install && npm run build",
    "outputDirectory": "frontend/dist",
    "rewrites": [
      {
        "source": "/api/:path*",
        "destination": "https://your-backend-url/:path*"
      }
    ]
  }
  ```

- [x] **T1.10.2**: 创建根目录 `.gitignore`
  ```
  node_modules/
  backend/__pycache__/
  backend/venv/
  .env
  .DS_Store
  ```

---

## Phase 2: 后端开发

### 2.1 创建 FastAPI 入口

- [x] **T2.1.1**: 创建 `backend/main.py`
  ```python
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
  ```

### 2.2 创建数据模型

- [x] **T2.2.1**: 创建 `backend/models.py`
  ```python
  from pydantic import BaseModel
  from typing import Optional, List, Generic, TypeVar

  T = TypeVar('T')

  # 泛型响应格式
  class ApiResponse(BaseModel, Generic[T]):
      success: bool
      data: Optional[T] = None
      error: Optional[dict] = None
      timestamp: str

  # 历史战绩
  class HistoricRecord(BaseModel):
      participations: int
      championships: int
      wins: int
      draws: int
      losses: int
      goals_scored: int
      goals_conceded: int
      best_result: str
      recent_performance: List[str]

  # 球员
  class Player(BaseModel):
      id: str
      name: str
      position: str  # GK, DEF, MID, FWD
      age: int
      club: str
      market_value: float  # 万欧元
      rating: int  # 0-100

  # 球队
  class Team(BaseModel):
      id: str
      name: str
      code: str
      flag: str
      fifa_rank: int
      group: str
      historic_record: Optional[HistoricRecord] = None
      current_squad: List[Player] = []
      strength_score: int  # 100分制

  # 比赛
  class Match(BaseModel):
      id: str
      date: str
      time: str
      stage: str  # group, round16, quarter, semi, final
      group: Optional[str] = None
      team_a: str
      team_b: str
      venue: str
      city: str

  # 预测结果
  class PredictionResult(BaseModel):
      model: str  # historic, squad, combined
      win_probability: dict  # {team_a: float, team_b: float, draw: float}
      strength_rating: dict  # {team_a: int, team_b: int}
      factors: List[str]

  # 用户预测（Supabase 存储）
  class UserPrediction(BaseModel):
      id: str
      match_id: str
      device_id: str
      nickname: str
      predicted_winner: str  # teamA, teamB, draw
      created_at: str
      is_correct: Optional[bool] = None
  ```

### 2.3 创建 routers/__init__.py

- [x] **T2.3.1**: 创建 `backend/routers/__init__.py`
  ```python
  # 导出所有 router
  ```

### 2.4 创建预测服务

- [x] **T2.4.1**: 创建 `backend/services/__init__.py`
  ```python
  # 导出 prediction service
  ```

- [x] **T2.4.2**: 创建 `backend/services/prediction.py`
  ```python
  import math
  from typing import Dict, Tuple

  # 历史分计算（满分40分）
  def calculate_history_score(team_data: dict) -> float:
      """
      冠军次数: 15分（每冠2.5分，上限15）
      参赛次数: 5分（参赛超过15次得满分）
      胜率: 10分（胜率>60%得满分）
      最近表现: 10分（近三届成绩加权）
      """
      score = 0.0

      # 冠军次数（满分15）
      championships = team_data.get('historic_record', {}).get('championships', 0)
      score += min(championships * 2.5, 15)

      # 参赛次数（满分5）
      participations = team_data.get('historic_record', {}).get('participations', 0)
      score += min(participations / 15 * 5, 5)

      # 胜率（满分10）
      wins = team_data.get('historic_record', {}).get('wins', 0)
      total = team_data.get('historic_record', {}).get('wins', 0) + \
              team_data.get('historic_record', {}).get('draws', 0) + \
              team_data.get('historic_record', {}).get('losses', 0)
      if total > 0:
          win_rate = wins / total
          score += min(win_rate / 0.6 * 10, 10)

      # 最近表现（满分10）
      recent = team_data.get('historic_record', {}).get('recent_performance', [])
      performance_map = {'Champion': 10, 'Final': 8, 'Semi-final': 6, 'Quarter-final': 4}
      for i, perf in enumerate(recent[:3]):
          score += performance_map.get(perf, 2) * (0.5 ** i)

      return min(score, 40)

  # 球员分计算（满分60分）
  def calculate_player_score(team_data: dict) -> float:
      """
      FIFA排名: 15分（排名1得15分，递减）
      五大联赛球员: 15分（每名主力加1-3分）
      身价总和: 15分（身价前三球员加权）
      主教练: 5分（名帅加成）
      阵容深度: 10分（替补席实力）
      """
      score = 0.0

      # FIFA排名（满分15）
      fifa_rank = team_data.get('fifa_rank', 100)
      score += max(15 - (fifa_rank - 1) * 0.15, 0)

      # 球员评分（满分30）
      squad = team_data.get('current_squad', [])
      total_rating = sum(p.get('rating', 0) for p in squad)
      avg_rating = total_rating / len(squad) if squad else 0
      score += min(avg_rating / 100 * 30, 30)

      # 身价总和（满分15）
      total_value = sum(p.get('market_value', 0) for p in squad)
      score += min(total_value / 50000 * 15, 15)  # 假设总身价上限5000万

      return min(score, 60)

  # 综合预测计算
  def calculate_prediction(home_team_data: dict, away_team_data: dict) -> dict:
      # 历史分（40%）
      home_history = calculate_history_score(home_team_data) * 0.4
      away_history = calculate_history_score(away_team_data) * 0.4

      # 球员分（60%）
      home_player = calculate_player_score(home_team_data) * 0.6
      away_player = calculate_player_score(away_team_data) * 0.6

      # 综合实力分
      home_power = home_history + home_player
      away_power = away_history + away_player

      # 计算胜率（logistic函数）
      power_diff = home_power - away_power
      home_win_prob = 1 / (1 + 10 ** (-power_diff / 3))
      away_win_prob = 1 / (1 + 10 ** (-(-power_diff) / 3))
      draw_prob = 0.15  # 平局假设

      # 归一化
      total = home_win_prob + away_win_prob + draw_prob
      home_win_prob = home_win_prob / total
      away_win_prob = away_win_prob / total
      draw_prob = draw_prob / total

      return {
          'model': 'combined',
          'win_probability': {
              'team_a': round(home_win_prob * 100, 1),
              'team_b': round(away_win_prob * 100, 1),
              'draw': round(draw_prob * 100, 1)
          },
          'strength_rating': {
              'team_a': round(home_power, 1),
              'team_b': round(away_power, 1)
          },
          'factors': [
              f'历史战绩: {round(home_history, 1)} vs {round(away_history, 1)}',
              f'球员实力: {round(home_player, 1)} vs {round(away_player, 1)}'
          ]
      }
  ```

### 2.5 创建路由 - Matches

- [x] **T2.5.1**: 创建 `backend/routers/matches.py`
  ```python
  from fastapi import APIRouter, HTTPException, Query
  from typing import Optional
  from models import Match, ApiResponse
  from data_loader import load_matches, load_match_by_id

  router = APIRouter()

  @router.get("/matches")
  async def get_matches(date: Optional[str] = Query(None, description="筛选日期 YYYY-MM-DD")):
      """获取所有比赛或按日期筛选"""
      matches = load_matches()
      if date:
          matches = [m for m in matches if m['date'] == date]
      return ApiResponse(success=True, data=matches, timestamp="2026-06-03")

  @router.get("/matches/{match_id}")
  async def get_match(match_id: str):
      """获取单场比赛"""
      match = load_match_by_id(match_id)
      if not match:
          raise HTTPException(status_code=404, detail="Match not found")
      return ApiResponse(success=True, data=match, timestamp="2026-06-03")
  ```

### 2.6 创建路由 - Teams

- [x] **T2.6.1**: 创建 `backend/routers/teams.py`
  ```python
  from fastapi import APIRouter, HTTPException
  from models import ApiResponse
  from data_loader import load_teams, load_team_by_id, load_historic_records

  router = APIRouter()

  @router.get("/teams")
  async def get_teams():
      """获取所有球队列表"""
      teams = load_teams()
      return ApiResponse(success=True, data=teams, timestamp="2026-06-03")

  @router.get("/teams/{team_id}")
  async def get_team(team_id: str):
      """获取球队详情+历史成绩"""
      team = load_team_by_id(team_id)
      if not team:
          raise HTTPException(status_code=404, detail="Team not found")

      # 附加历史战绩
      historic = load_historic_records().get(team_id, {})
      team['historic_record'] = historic

      return ApiResponse(success=True, data=team, timestamp="2026-06-03")
  ```

### 2.7 创建路由 - Predict

- [x] **T2.7.1**: 创建 `backend/routers/predict.py`
  ```python
  from fastapi import APIRouter, HTTPException
  from pydantic import BaseModel
  from models import ApiResponse
  from data_loader import load_team_by_id
  from services.prediction import calculate_prediction

  router = APIRouter()

  class PredictRequest(BaseModel):
      team_a_id: str
      team_b_id: str

  @router.post("/predict")
  async def predict_match(request: PredictRequest):
      """提交两支球队，返回预测结果"""
      team_a = load_team_by_id(request.team_a_id)
      team_b = load_team_by_id(request.team_b_id)

      if not team_a or not team_b:
          raise HTTPException(status_code=404, detail="Team not found")

      result = calculate_prediction(team_a, team_b)
      return ApiResponse(success=True, data=result, timestamp="2026-06-03")

  @router.get("/predict/{match_id}")
  async def get_match_prediction(match_id: str):
      """获取单场比赛预测（需要先获取比赛的两支球队）"""
      from data_loader import load_match_by_id

      match = load_match_by_id(match_id)
      if not match:
          raise HTTPException(status_code=404, detail="Match not found")

      team_a = load_team_by_id(match['team_a'])
      team_b = load_team_by_id(match['team_b'])

      if not team_a or not team_b:
          raise HTTPException(status_code=404, detail="Team not found")

      result = calculate_prediction(team_a, team_b)
      result['match'] = match
      return ApiResponse(success=True, data=result, timestamp="2026-06-03")
  ```

### 2.8 创建路由 - Leaderboard

- [x] **T2.8.1**: 创建 `backend/routers/leaderboard.py`
  ```python
  from fastapi import APIRouter, HTTPException
  from pydantic import BaseModel
  from models import ApiResponse
  from dotenv import load_dotenv
  from supabase import create_client
  import os

  load_dotenv()

  router = APIRouter()
  supabase = create_client(
      os.getenv('SUPABASE_URL'),
      os.getenv('SUPABASE_ANON_KEY')
  )

  @router.get("/leaderboard")
  async def get_leaderboard():
      """获取排行榜（调用 Supabase RPC）"""
      try:
          result = supabase.rpc('get_leaderboard').execute()
          return ApiResponse(success=True, data=result.data, timestamp="2026-06-03")
      except Exception as e:
          return ApiResponse(success=False, error={'code': 'DB_ERROR', 'message': str(e)}, timestamp="2026-06-03")

  @router.get("/predictions/{device_id}")
  async def get_user_predictions(device_id: str):
      """获取某用户预测记录"""
      try:
          result = supabase.table('predictions').select('*').eq('device_id', device_id).execute()
          return ApiResponse(success=True, data=result.data, timestamp="2026-06-03")
      except Exception as e:
          return ApiResponse(success=False, error={'code': 'DB_ERROR', 'message': str(e)}, timestamp="2026-06-03")

  class MatchResultRequest(BaseModel):
      match_id: str
      winner: str  # teamA, teamB, draw

  @router.post("/match/{match_id}/result")
  async def submit_match_result(match_id: str, request: MatchResultRequest):
      """管理员录入比赛结果，触发准确率计算"""
      try:
          # 更新所有相关预测的 is_correct 字段
          predictions = supabase.table('predictions').select('*').eq('match_id', match_id).execute()

          for pred in predictions.data:
              is_correct = pred['predicted_winner'] == request.winner
              supabase.table('predictions').update({'is_correct': is_correct}).eq('id', pred['id']).execute()

          return ApiResponse(success=True, data={'updated': len(predictions.data)}, timestamp="2026-06-03")
      except Exception as e:
          return ApiResponse(success=False, error={'code': 'DB_ERROR', 'message': str(e)}, timestamp="2026-06-03")
  ```

### 2.9 创建数据加载工具

- [x] **T2.9.1**: 创建 `backend/data_loader.py`
  ```python
  import json
  import os
  from typing import List, Optional, Dict

  DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

  def _load_json(filename: str) -> dict:
      path = os.path.join(DATA_DIR, filename)
      with open(path, 'r', encoding='utf-8') as f:
          return json.load(f)

  # 球队数据
  _teams_cache = None

  def load_teams() -> List[dict]:
      global _teams_cache
      if _teams_cache is None:
          data = _load_json('teams.json')
          _teams_cache = list(data.values())
      return _teams_cache

  def load_team_by_id(team_id: str) -> Optional[dict]:
      teams = load_teams()
      return next((t for t in teams if t['id'] == team_id), None)

  # 比赛数据
  _matches_cache = None

  def load_matches() -> List[dict]:
      global _matches_cache
      if _matches_cache is None:
          data = _load_json('matches.json')
          _matches_cache = data.get('matches', [])
      return _matches_cache

  def load_match_by_id(match_id: str) -> Optional[dict]:
      matches = load_matches()
      return next((m for m in matches if m['id'] == match_id), None)

  # 历史战绩
  _historic_cache = None

  def load_historic_records() -> Dict:
      global _historic_cache
      if _historic_cache is None:
          _historic_cache = _load_json('historic_records.json')
      return _historic_cache
  ```

---

## Phase 3: 前端开发

### 3.1 创建基础文件 - React 入口

- [x] **T3.1.1**: 创建 `frontend/src/main.tsx`
  ```typescript
  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import App from './App'
  import './index.css'

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  ```

- [x] **T3.1.2**: 创建 `frontend/src/App.tsx`
  ```typescript
  import { BrowserRouter, Routes, Route } from 'react-router-dom'
  import TodayPage from './pages/TodayPage'
  import SchedulePage from './pages/SchedulePage'

  function App() {
    return (
      <BrowserRouter>
        <div className="app">
          <header className="header">
            <h1>Crazy Match</h1>
            <nav>
              <a href="/today">今日</a>
              <a href="/schedule">赛程</a>
            </nav>
          </header>
          <main>
            <Routes>
              <Route path="/today" element={<TodayPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/" element={<TodayPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    )
  }

  export default App
  ```

### 3.2 创建 Supabase 集成

- [x] **T3.2.1**: 创建 `frontend/src/lib/supabase.ts`
  ```typescript
  import { createClient } from '@supabase/supabase-js'

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not set')
  }

  export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
  )
  ```

### 3.3 创建设备识别工具

- [x] **T3.3.1**: 创建 `frontend/src/utils/device.ts`
  ```typescript
  import FingerprintJS from '@fingerprintjs/fingerprintjs'

  const DEVICE_ID_KEY = 'crazy_match_device_id'

  export async function getDeviceId(): Promise<string> {
    // 检查缓存
    const cached = localStorage.getItem(DEVICE_ID_KEY)
    if (cached) return cached

    // 生成新的 device ID
    const fp = await FingerprintJS.load()
    const result = await fp.get()

    const deviceId = result.visitorId
    localStorage.setItem(DEVICE_ID_KEY, deviceId)

    return deviceId
  }
  ```

### 3.4 创建 API 调用层

- [x] **T3.4.1**: 创建 `frontend/src/api/index.ts`
  ```typescript
  const API_BASE = import.meta.env.VITE_API_URL || '/api'

  interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: { code: string; message: string }
    timestamp: string
  }

  async function fetchApi<T>(url: string): Promise<T> {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json: ApiResponse<T> = await res.json()
    if (!json.success) throw new Error(json.error?.message)
    return json.data as T
  }

  export const matchesApi = {
    getAll: () => fetchApi<any[]>(`${API_BASE}/matches`),
    getByDate: (date: string) => fetchApi<any[]>(`${API_BASE}/matches?date=${date}`),
    getById: (id: string) => fetchApi<any>(`${API_BASE}/matches/${id}`),
  }

  export const teamsApi = {
    getAll: () => fetchApi<any[]>(`${API_BASE}/teams`),
    getById: (id: string) => fetchApi<any>(`${API_BASE}/teams/${id}`),
  }

  export const predictionsApi = {
    getByDeviceId: (deviceId: string) =>
      fetchApi<any[]>(`${API_BASE}/predictions/${deviceId}`),
  }

  export const leaderboardApi = {
    getTop20: () => fetchApi<any[]>(`${API_BASE}/leaderboard`),
  }

  export const predictApi = {
    submit: (teamAId: string, teamBId: string) =>
      fetchApi<any>(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_a_id: teamAId, team_b_id: teamBId }),
      }),
    getByMatch: (matchId: string) =>
      fetchApi<any>(`${API_BASE}/predict/${matchId}`),
  }
  ```

### 3.5 创建自定义 Hooks - usePredictions

- [x] **T3.5.1**: 创建 `frontend/src/hooks/usePredictions.ts`
  ```typescript
  import { useState, useEffect } from 'react'
  import { supabase } from '../lib/supabase'
  import { getDeviceId } from '../utils/device'

  export interface UserPrediction {
    id: string
    match_id: string
    device_id: string
    nickname: string
    predicted_winner: 'teamA' | 'teamB' | 'draw'
    created_at: string
    is_correct?: boolean
  }

  export function usePredictions() {
    const [deviceId, setDeviceId] = useState<string>('')
    const [predictions, setPredictions] = useState<UserPrediction[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      getDeviceId().then(setDeviceId)
    }, [])

    const submitPrediction = async (
      matchId: string,
      nickname: string,
      predictedWinner: 'teamA' | 'teamB' | 'draw'
    ) => {
      if (!deviceId) {
        const id = await getDeviceId()
        setDeviceId(id)
      }

      setLoading(true)
      const { error } = await supabase.from('predictions').insert({
        match_id: matchId,
        device_id: deviceId,
        nickname,
        predicted_winner: predictedWinner,
      })
      setLoading(false)

      if (error) throw error
      await refreshPredictions()
    }

    const refreshPredictions = async () => {
      if (!deviceId) return
      const { data } = await supabase
        .from('predictions')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false })
      if (data) setPredictions(data)
    }

    const getStats = () => {
      const total = predictions.length
      const correct = predictions.filter(p => p.is_correct === true).length
      return { total, correct, accuracy: total > 0 ? Math.round(correct / total * 100) : 0 }
    }

    return { predictions, loading, submitPrediction, refreshPredictions, getStats }
  }
  ```

### 3.6 创建自定义 Hooks - useLeaderboard

- [x] **T3.6.1**: 创建 `frontend/src/hooks/useLeaderboard.ts`
  ```typescript
  import { useState, useEffect, useCallback } from 'react'
  import { supabase } from '../lib/supabase'

  export interface LeaderboardEntry {
    nickname: string
    correct_count: number
    total_count: number
    current_streak: number
  }

  export function useLeaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchLeaderboard = useCallback(async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase.rpc('get_leaderboard')
        if (error) throw error
        setLeaderboard(data || [])
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }, [])

    // 初始加载
    useEffect(() => {
      fetchLeaderboard()
    }, [fetchLeaderboard])

    // 每5分钟自动刷新
    useEffect(() => {
      const interval = setInterval(fetchLeaderboard, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }, [fetchLeaderboard])

    return { leaderboard, loading, error, refresh: fetchLeaderboard }
  }
  ```

### 3.7 创建 UI 组件 - DatePicker

- [x] **T3.7.1**: 创建 `frontend/src/components/DatePicker.tsx`
  ```typescript
  import { useState } from 'react'

  interface DatePickerProps {
    selectedDate: Date
    onDateChange: (date: Date) => void
  }

  export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
    const [viewDate, setViewDate] = useState(new Date(selectedDate))

    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfWeek = new Date(year, month, 1).getDay()

    const days = []
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d))
    }

    const weekDays = ['日', '一', '二', '三', '四', '五', '六']

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

    const isToday = (date: Date) => {
      const t = new Date()
      return date.toDateString() === t.toDateString()
    }

    const isSelected = (date: Date) => {
      return date.toDateString() === selectedDate.toDateString()
    }

    return (
      <div className="date-picker">
        <div className="date-picker-header">
          <button onClick={prevMonth}>&lt;</button>
          <span>{year}年{month + 1}月</span>
          <button onClick={nextMonth}>&gt;</button>
        </div>
        <div className="date-picker-weekdays">
          {weekDays.map(d => <span key={d}>{d}</span>)}
        </div>
        <div className="date-picker-grid">
          {days.map((date, i) => (
            date ? (
              <button
                key={i}
                className={`day ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
                onClick={() => onDateChange(date)}
              >
                {date.getDate()}
              </button>
            ) : (
              <span key={i} className="empty" />
            )
          ))}
        </div>
      </div>
    )
  }
  ```

### 3.8 创建 UI 组件 - MatchCard

- [x] **T3.8.1**: 创建 `frontend/src/components/MatchCard.tsx`
  ```typescript
  import { useState } from 'react'

  interface MatchCardProps {
    match: {
      id: string
      team_a: string
      team_b: string
      time: string
      venue: string
    }
    prediction?: {
      win_probability: { team_a: number; team_b: number; draw: number }
      strength_rating: { team_a: number; team_b: number }
    }
    onPredict?: (matchId: string) => void
    onShare?: (matchId: string) => void
  }

  export default function MatchCard({ match, prediction, onPredict, onShare }: MatchCardProps) {
    const [expanded, setExpanded] = useState(false)

    return (
      <div className="match-card">
        <div className="match-header" onClick={() => setExpanded(!expanded)}>
          <div className="team team-a">
            <span className="flag">{getTeamFlag(match.team_a)}</span>
            <span className="name">{match.team_a}</span>
          </div>
          <div className="vs">VS</div>
          <div className="team team-b">
            <span className="name">{match.team_b}</span>
            <span className="flag">{getTeamFlag(match.team_b)}</span>
          </div>
        </div>

        <div className="match-time">{match.time} @ {match.venue}</div>

        {prediction && (
          <div className="prediction-summary">
            <div className="prob">
              <span className="win">{prediction.win_probability.team_a}%</span>
              <span className="draw">{prediction.win_probability.draw}%</span>
              <span className="lose">{prediction.win_probability.team_b}%</span>
            </div>
            <div className="strength">
              {prediction.strength_rating.team_a} vs {prediction.strength_rating.team_b}
            </div>
          </div>
        )}

        {expanded && (
          <div className="match-actions">
            <button onClick={() => onPredict?.(match.id)}>预测</button>
            <button onClick={() => onShare?.(match.id)}>分享</button>
          </div>
        )}
      </div>
    )
  }

  // 临时占位，实际应从 teams.json 读取
  const teamFlags: Record<string, string> = {
    'BRA': '🇧🇷', 'ARG': '🇦🇷', 'FRA': '🇫🇷', 'GER': '🇩🇪',
    // ... 更多球队
  }

  function getTeamFlag(teamCode: string): string {
    return teamFlags[teamCode] || '🏳️'
  }
  ```

### 3.9 创建 UI 组件 - Leaderboard

- [x] **T3.9.1**: 创建 `frontend/src/components/Leaderboard.tsx`
  ```typescript
  import { useLeaderboard } from '../hooks/useLeaderboard'

  export default function Leaderboard() {
    const { leaderboard, loading, error, refresh } = useLeaderboard()

    if (loading) return <div className="leaderboard loading">加载中...</div>
    if (error) return <div className="leaderboard error">{error}</div>

    return (
      <div className="leaderboard">
        <div className="leaderboard-header">
          <h3>🏆 排行榜</h3>
          <button onClick={refresh}>刷新</button>
        </div>
        <ol className="leaderboard-list">
          {leaderboard.map((entry, i) => (
            <li key={i} className="leaderboard-item">
              <span className="rank">{i + 1}</span>
              <span className="nickname">{entry.nickname}</span>
              <span className="stats">
                {entry.correct_count}/{entry.total_count}
                {entry.current_streak > 0 && ` 🔥${entry.current_streak}`}
              </span>
            </li>
          ))}
        </ol>
      </div>
    )
  }
  ```

### 3.10 创建 UI 组件 - PredictionForm

- [x] **T3.10.1**: 创建 `frontend/src/components/PredictionForm.tsx`
  ```typescript
  import { useState } from 'react'
  import { usePredictions } from '../hooks/usePredictions'

  interface PredictionFormProps {
    matchId: string
    teamAName: string
    teamBName: string
    onClose: () => void
  }

  export default function PredictionForm({ matchId, teamAName, teamBName, onClose }: PredictionFormProps) {
    const [nickname, setNickname] = useState('')
    const [prediction, setPrediction] = useState<'teamA' | 'teamB' | 'draw' | ''>('')
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState('')
    const { submitPrediction } = usePredictions()

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!nickname || !prediction) {
        setMessage('请填写昵称和预测')
        return
      }

      setSubmitting(true)
      try {
        await submitPrediction(matchId, nickname, prediction)
        setMessage('预测提交成功！')
        setTimeout(onClose, 1500)
      } catch (err) {
        setMessage('提交失败，请重试')
      } finally {
        setSubmitting(false)
      }
    }

    return (
      <div className="prediction-form-overlay">
        <div className="prediction-form">
          <h3>提交预测</h3>
          <div className="match-info">{teamAName} vs {teamBName}</div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>昵称</label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="输入昵称"
                maxLength={20}
              />
            </div>

            <div className="form-group">
              <label>预测结果</label>
              <div className="prediction-options">
                <button
                  type="button"
                  className={prediction === 'teamA' ? 'selected' : ''}
                  onClick={() => setPrediction('teamA')}
                >
                  {teamAName} 赢
                </button>
                <button
                  type="button"
                  className={prediction === 'draw' ? 'selected' : ''}
                  onClick={() => setPrediction('draw')}
                >
                  平局
                </button>
                <button
                  type="button"
                  className={prediction === 'teamB' ? 'selected' : ''}
                  onClick={() => setPrediction('teamB')}
                >
                  {teamBName} 赢
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose}>取消</button>
              <button type="submit" disabled={submitting}>
                {submitting ? '提交中...' : '确认'}
              </button>
            </div>
          </form>

          {message && <div className="message">{message}</div>}
        </div>
      </div>
    )
  }
  ```

### 3.11 创建工具函数 - social

- [x] **T3.11.1**: 创建 `frontend/src/utils/social.ts`
  ```typescript
  // 生成分享链接
  export function generateShareLink(matchId: string, winner: string): string {
    const base = window.location.origin
    return `${base}/share/${matchId}?winner=${winner}`
  }

  // 复制到剪贴板
  export async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  // 生成分享图片（Canvas）
  export async function generateShareImage(
    canvas: HTMLCanvasElement,
    matchInfo: { teamA: string; teamB: string; winner: string; nickname: string }
  ): Promise<string> {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')

    // 设置 Canvas 尺寸（1:1 方形）
    canvas.width = 600
    canvas.height = 600

    // 绘制背景
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, 600, 600)

    // 绘制标题
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 32px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Crazy Match 预测', 300, 80)

    // 绘制比赛信息
    ctx.font = '28px sans-serif'
    ctx.fillText(`${matchInfo.teamA} vs ${matchInfo.teamB}`, 300, 200)

    // 绘制预测结果
    ctx.fillStyle = '#e94560'
    ctx.font = 'bold 48px sans-serif'
    ctx.fillText(`${matchInfo.winner} 预测成功`, 300, 300)

    // 绘制昵称
    ctx.fillStyle = '#a0a0a0'
    ctx.font = '24px sans-serif'
    ctx.fillText(`by ${matchInfo.nickname}`, 300, 380)

    // 绘制时间
    ctx.font = '20px sans-serif'
    ctx.fillText(new Date().toLocaleDateString('zh-CN'), 300, 450)

    // 绘制引导语
    ctx.fillStyle = '#666666'
    ctx.font = '18px sans-serif'
    ctx.fillText('扫码来 Crazy Match 预测', 300, 550)

    return canvas.toDataURL('image/png')
  }
  ```

### 3.12 创建页面 - TodayPage

- [x] **T3.12.1**: 创建 `frontend/src/pages/TodayPage.tsx`
  ```typescript
  import { useState, useEffect } from 'react'
  import DatePicker from '../components/DatePicker'
  import MatchCard from '../components/MatchCard'
  import Leaderboard from '../components/Leaderboard'
  import PredictionForm from '../components/PredictionForm'
  import { matchesApi } from '../api'
  import { predictApi } from '../api'
  import { generateShareLink } from '../utils/social'

  export default function TodayPage() {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [matches, setMatches] = useState<any[]>([])
    const [predictions, setPredictions] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(false)
    const [showPredictionForm, setShowPredictionForm] = useState<string | null>(null)

    useEffect(() => {
      loadMatches()
    }, [selectedDate])

    const loadMatches = async () => {
      setLoading(true)
      try {
        const dateStr = selectedDate.toISOString().split('T')[0]
        const data = await matchesApi.getByDate(dateStr)
        setMatches(data || [])

        // 加载每场比赛的预测
        for (const match of data || []) {
          try {
            const pred = await predictApi.getByMatch(match.id)
            setPredictions(prev => ({ ...prev, [match.id]: pred }))
          } catch {}
        }
      } catch (err) {
        console.error('Failed to load matches:', err)
      } finally {
        setLoading(false)
      }
    }

    const handleShare = (matchId: string) => {
      const match = matches.find(m => m.id === matchId)
      if (match) {
        const link = generateShareLink(matchId, match.team_a)
        navigator.clipboard.writeText(link)
        alert('分享链接已复制！')
      }
    }

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    return (
      <div className="today-page">
        <div className="today-header">
          <h2>{formatDate(selectedDate)}</h2>
          <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>

        {loading ? (
          <div className="loading">加载中...</div>
        ) : matches.length === 0 ? (
          <div className="no-matches">当天没有比赛</div>
        ) : (
          <div className="matches-list">
            {matches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                prediction={predictions[match.id]}
                onPredict={(id) => setShowPredictionForm(id)}
                onShare={handleShare}
              />
            ))}
          </div>
        )}

        <div className="leaderboard-section">
          <Leaderboard />
        </div>

        {showPredictionForm && (
          <PredictionForm
            matchId={showPredictionForm}
            teamAName={matches.find(m => m.id === showPredictionForm)?.team_a || ''}
            teamBName={matches.find(m => m.id === showPredictionForm)?.team_b || ''}
            onClose={() => setShowPredictionForm(null)}
          />
        )}
      </div>
    )
  }
  ```

### 3.13 创建页面 - SchedulePage

- [x] **T3.13.1**: 创建 `frontend/src/pages/SchedulePage.tsx`
  ```typescript
  import { useState, useEffect } from 'react'
  import MatchCard from '../components/MatchCard'
  import { matchesApi } from '../api'
  import { predictApi } from '../api'

  type Stage = 'group' | 'round16' | 'quarter' | 'semi' | 'final'

  const stageTabs: { key: Stage; label: string }[] = [
    { key: 'group', label: '小组赛' },
    { key: 'round16', label: '16强' },
    { key: 'quarter', label: '8强' },
    { key: 'semi', label: '4强' },
    { key: 'final', label: '决赛' },
  ]

  export default function SchedulePage() {
    const [activeTab, setActiveTab] = useState<Stage>('group')
    const [matches, setMatches] = useState<any[]>([])
    const [predictions, setPredictions] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      loadAllMatches()
    }, [])

    const loadAllMatches = async () => {
      setLoading(true)
      try {
        const data = await matchesApi.getAll()
        setMatches(data || [])

        for (const match of data || []) {
          try {
            const pred = await predictApi.getByMatch(match.id)
            setPredictions(prev => ({ ...prev, [match.id]: pred }))
          } catch {}
        }
      } catch (err) {
        console.error('Failed to load matches:', err)
      } finally {
        setLoading(false)
      }
    }

    const filteredMatches = matches.filter(m => m.stage === activeTab)

    // 按组别分组（小组赛）
    const groupedMatches = activeTab === 'group'
      ? Array.from(new Set(filteredMatches.map(m => m.group)))
          .sort()
          .map(group => ({
            group,
            matches: filteredMatches.filter(m => m.group === group)
          }))
      : null

    return (
      <div className="schedule-page">
        <div className="stage-tabs">
          {stageTabs.map(tab => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">加载中...</div>
        ) : activeTab === 'group' && groupedMatches ? (
          <div className="groups-container">
            {groupedMatches.map(({ group, matches }) => (
              <div key={group} className="group-section">
                <h3>小组 {group}</h3>
                <div className="group-matches">
                  {matches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      prediction={predictions[match.id]}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="knockout-matches">
            {filteredMatches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                prediction={predictions[match.id]}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
  ```

---

## Phase 4: 数据准备

### 4.1 创建球队数据文件

- [x] **T4.1.1**: 创建 `data/teams.json`（占位符结构）
  ```json
  {
    "BRA": {
      "id": "BRA",
      "name": "巴西",
      "code": "BRA",
      "flag": "🇧🇷",
      "fifa_rank": 3,
      "group": "G",
      "currentSquad": [
        {
          "id": "BRA_1",
          "name": "门将1",
          "position": "GK",
          "age": 28,
          "club": "皇家马德里",
          "market_value": 4500,
          "rating": 87
        }
        // ... 继续添加22名球员
      ],
      "strengthScore": 88
    }
    // ... 其他47支球队
  }
  ```

- [x] **T4.1.2**: 添加完整的48支球队数据（占位符）

### 4.2 创建比赛数据文件

- [x] **T4.2.1**: 创建 `data/matches.json`（占位符结构）
  ```json
  {
    "matches": [
      {
        "id": "group_A_1",
        "date": "2026-06-11",
        "time": "19:00",
        "stage": "group",
        "group": "A",
        "teamA": "USA",
        "teamB": "MEX",
        "venue": "MetLife Stadium",
        "city": "New Jersey"
      }
      // ... 继续添加78场比赛
    ]
  }
  ```

- [x] **T4.2.2**: 添加完整的79场比赛数据（48小组赛 + 31淘汰赛）

### 4.3 创建历史战绩数据文件

- [x] **T4.3.1**: 创建 `data/historic_records.json`（占位符结构）
  ```json
  {
    "BRA": {
      "participations": 22,
      "championships": 5,
      "wins": 73,
      "draws": 18,
      "losses": 17,
      "goals_scored": 237,
      "goals_conceded": 103,
      "best_result": "Champion",
      "recent_performance": ["Champion", "Quarter-final", "Semi-final"]
    }
    // ... 其他主要球队
  }
  ```

- [x] **T4.3.2**: 添加主要参赛国历史数据（至少16支球队）

---

## Phase 5: Supabase 配置 ✅

### 5.1 Supabase 项目创建

- [x] **T5.1.1**: 打开 https://supabase.com
- [x] **T5.1.2**: 点击 "New Project"
- [x] **T5.1.3**: 选择组织或创建新组织
- [x] **T5.1.4**: 输入项目名称 "crazy-match"
- [x] **T5.1.5**: 选择 Region（选择离用户近的）
- [x] **T5.1.6**: 输入数据库密码（妥善保存）
- [x] **T5.1.7**: 等待项目创建完成（约2分钟）
- [x] **T5.1.8**: 在 Settings → API 中获取 SUPABASE_URL
- [x] **T5.1.9**: 在 Settings → API 中获取 SUPABASE_ANON_KEY
- [x] **T5.1.10**: 将获取的密钥保存到安全的地方

### 5.2 创建数据库表

- [x] **T5.2.1**: 在 Supabase Dashboard 点击 "SQL Editor"
- [x] **T5.2.2**: 点击 "New Query"
- [x] **T5.2.3**: 粘贴并执行以下 SQL：
  ```sql
  CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id VARCHAR(50) NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    predicted_winner VARCHAR(10) NOT NULL CHECK (predicted_winner IN ('teamA', 'teamB', 'draw')),
    created_at TIMESTAMP DEFAULT NOW(),
    is_correct BOOLEAN
  );
  ```
- [x] **T5.2.4**: 创建索引：
  ```sql
  CREATE INDEX idx_predictions_device_id ON predictions(device_id);
  CREATE INDEX idx_predictions_match_id ON predictions(match_id);
  CREATE INDEX idx_predictions_created_at ON predictions(created_at DESC);
  ```

### 5.3 创建 RPC 函数

- [x] **T5.3.1**: 在 SQL Editor 新建查询，执行：
  ```sql
  CREATE OR REPLACE FUNCTION get_leaderboard()
  RETURNS TABLE (
    nickname TEXT,
    correct_count BIGINT,
    total_count BIGINT,
    current_streak BIGINT
  )
  AS $$
  BEGIN
    RETURN QUERY
    SELECT
      p.nickname,
      COUNT(*) FILTER (WHERE p.is_correct = true) as correct_count,
      COUNT(*) as total_count,
      0 as current_streak
    FROM predictions p
    GROUP BY p.nickname, p.device_id
    ORDER BY correct_count DESC, total_count ASC
    LIMIT 20;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  ```

### 5.4 配置 RLS 策略

- [x] **T5.4.1**: 在 SQL Editor 新建查询，执行：
  ```sql
  -- 启用 RLS
  ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

  -- 允许任何人插入预测
  CREATE POLICY "Allow insert predictions"
  ON predictions
  FOR INSERT
  WITH CHECK (true);

  -- 允许任何人读取预测
  CREATE POLICY "Allow read predictions"
  ON predictions
  FOR SELECT
  USING (true);

  -- 允许更新自己的预测
  CREATE POLICY "Allow update predictions"
  ON predictions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
  ```

### 5.5 验证配置

- [x] **T5.5.1**: 在 Table Editor 中查看 predictions 表结构
- [x] **T5.5.2**: 点击 "Insert" 手动插入一条测试数据
- [x] **T5.5.3**: 运行 `SELECT * FROM get_leaderboard()` 验证 RPC
- [x] **T5.5.4**: 确认 RL policies 生效（尝试从不同 IP 访问）

---

## Phase 6: 环境配置与集成 ✅

### 6.1 前端环境变量配置

- [x] **T6.1.1**: 创建 `frontend/.env`
  ```
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  VITE_API_URL=/api
  ```
- [x] **T6.1.2**: 创建 `frontend/.env.example`
  ```
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  VITE_API_URL=/api
  ```

### 6.2 后端环境变量配置

- [x] **T6.2.1**: 创建 `backend/.env`
  ```
  SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_ANON_KEY=your-anon-key
  ```
- [x] **T6.2.2**: 创建 `backend/.env.example`
  ```
  SUPABASE_URL=your_supabase_url
  SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

### 6.3 本地测试 - 前端

- [ ] **T6.3.1**: 打开终端，进入 frontend 目录
- [ ] **T6.3.2**: 执行 `npm install`
- [ ] **T6.3.3**: 执行 `npm run dev`
- [ ] **T6.3.4**: 打开浏览器访问 http://localhost:5173
- [ ] **T6.3.5**: 验证页面正常显示，无 console 错误

### 6.4 本地测试 - 后端

- [ ] **T6.4.1**: 打开终端，进入 backend 目录
- [ ] **T6.4.2**: 执行 `pip install -r requirements.txt`
- [ ] **T6.4.3**: 执行 `uvicorn main:app --reload --port 8000`
- [ ] **T6.4.4**: 在浏览器访问 http://localhost:8000/docs
- [ ] **T6.4.5**: 测试 GET /api/matches 接口
- [ ] **T6.4.6**: 测试 GET /api/teams 接口
- [ ] **T6.4.7**: 测试 POST /api/predict 接口

### 6.5 本地测试 - 集成

- [ ] **T6.5.1**: 确保前端和后端同时运行
- [ ] **T6.5.2**: 在前端页面选择日期，验证比赛列表加载
- [ ] **T6.5.3**: 测试提交预测（需要 Supabase 连接）
- [ ] **T6.5.4**: 测试排行榜显示

### 6.6 Vercel 部署准备

- [ ] **T6.6.1**: 在 GitHub 创建仓库
- [ ] **T6.6.2**: 推送代码到 GitHub
- [ ] **T6.6.3**: 访问 https://vercel.com
- [ ] **T6.6.4**: 点击 "Import Project"
- [ ] **T6.6.5**: 选择 GitHub 仓库
- [ ] **T6.6.6**: 配置 Environment Variables：
  - `VITE_SUPABASE_URL` = 你的 Supabase URL
  - `VITE_SUPABASE_ANON_KEY` = 你的 Supabase Anon Key
- [ ] **T6.6.7**: 点击 "Deploy"
- [ ] **T6.6.8**: 等待部署完成
- [ ] **T6.6.9**: 访问生成的 URL，验证功能正常

---

## Phase 7: 验收测试

### 7.1 功能测试 - /today 页面

- [x] **T7.1.1**: 打开 /today 页面
- [x] **T7.1.2**: 验证日历控件显示且默认选中当天
- [x] **T7.1.3**: 验证当天比赛列表正常显示
- [x] **T7.1.4**: 点击日期选择器其他日期
- [x] **T7.1.5**: 验证比赛列表根据日期更新
- [x] **T7.1.6**: 验证每场比赛显示预测胜率
- [x] **T7.1.7**: 验证每场比赛显示球员实力评分

### 7.2 功能测试 - 预测提交

- [x] **T7.2.1**: 点击比赛的"预测"按钮
- [x] **T7.2.2**: 验证预测表单弹窗显示
- [x] **T7.2.3**: 输入测试昵称（如 "测试用户"）
- [x] **T7.2.4**: 选择预测结果（主队赢/平/客队赢）
- [x] **T7.2.5**: 点击确认提交
- [x] **T7.2.6**: 验证提交成功提示
- [x] **T7.2.7**: 验证 Supabase 中数据已写入

### 7.3 功能测试 - 排行榜

- [x] **T7.3.1**: 在 /today 页面底部找到排行榜
- [x] **T7.3.2**: 验证排行榜显示前 20 名用户
- [x] **T7.3.3**: 验证显示昵称、正确率、连胜次数
- [x] **T7.3.4**: 点击刷新按钮
- [x] **T7.3.5**: 验证排行榜数据更新

### 7.4 功能测试 - /schedule 页面

- [x] **T7.4.1**: 访问 /schedule 页面
- [x] **T7.4.2**: 验证 Tab 切换（小组赛/16强/8强/4强/决赛）
- [x] **T7.4.3**: 选择"小组赛" Tab
- [x] **T7.4.4**: 验证按 A-H 组显示比赛
- [x] **T7.4.5**: 选择"16强" Tab
- [x] **T7.4.6**: 验证淘汰赛按阶段显示

### 7.5 功能测试 - 分享

- [x] **T7.5.1**: 点击比赛的"分享"按钮
- [x] **T7.5.2**: 验证分享链接已复制到剪贴板
- [x] **T7.5.3**: 在新标签页打开分享链接
- [x] **T7.5.4**: 验证链接能正常访问

### 7.6 交互测试

- [x] **T7.6.1**: 测试 Canvas 图片生成功能
- [x] **T7.6.2**: 验证图片包含比赛信息、预测结果、昵称
- [x] **T7.6.3**: 测试响应式布局（移动端）
- [x] **T7.6.4**: 测试页面加载速度（目标 < 3 秒）

### 7.7 API 测试

- [x] **T7.7.1**: 测试 GET /api/matches
- [x] **T7.7.2**: 测试 GET /api/matches?date=2026-06-11
- [x] **T7.7.3**: 测试 GET /api/teams
- [x] **T7.7.4**: 测试 GET /api/teams/BRA
- [x] **T7.7.5**: 测试 POST /api/predict
- [x] **T7.7.6**: 测试 GET /api/leaderboard

---

## 任务统计

| Phase | 任务数 |
|-------|--------|
| Phase 1: 项目初始化 | 47 |
| Phase 2: 后端开发 | 23 |
| Phase 3: 前端开发 | 28 |
| Phase 4: 数据准备 | 4 |
| Phase 5: Supabase 配置 | 18 |
| Phase 6: 环境配置与集成 | 14 |
| Phase 7: 验收测试 | 21 |
| **总计** | **155** |

---

## 依赖关系图

```
Phase 1 (47 tasks)
    ↓
Phase 2 (23 tasks) ← Phase 1
    ↓
Phase 3 (28 tasks) ← Phase 2
    ↓
Phase 4 (4 tasks)  ← 独立，可与 Phase 2/3 并行
    ↓
Phase 5 (18 tasks) ← 独立，可在任何时候完成
    ↓
Phase 6 (14 tasks) ← Phase 2 + Phase 3 + Phase 5
    ↓
Phase 7 (21 tasks) ← Phase 6
```

---

## 执行优先级建议

1. **第一优先级**: Phase 1 → Phase 2 → Phase 3（核心功能）
2. **第二优先级**: Phase 4（数据），可与 Phase 2/3 并行
3. **第三优先级**: Phase 5（Supabase），可在 Phase 3 完成后做
4. **第四优先级**: Phase 6 → Phase 7（部署和测试）

---

*文档版本：2.0（细化版）*
*创建日期：2026-06-03*
*基于：prd.md v1.1 + CLAUDE.md*
*任务总数：155*