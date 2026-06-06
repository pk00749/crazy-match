# AGENT.md - Crazy Match 世界杯预测平台

> 本文件是 AI 编程代理的工作指南。所有支持 AGENT.md 的 AI 代理（如 Claude Code、Cursor 等）进入此目录时会自动读取此文件。

---

## 项目概述

**Crazy Match** 是一个 2026 世界杯比赛预测平台，帮助用户预测比赛结果并提供各队实力评分。

- **前端**: React 19 + Vite + TypeScript
- **后端**: FastAPI (Python)
- **数据存储**: Supabase（预测数据、排行榜）
- **部署**: 前端 Vercel，后端独立服务
- **比赛总数**: 79 场（48 小组赛 + 31 淘汰赛）

---

## 目录结构

```
crazy-match/
├── AGENT.md              # AI 代理工作指南（本文档）
├── CLAUDE.md             # Claude Code 专用指南（内容同 AGENT.md）
├── AGENTS.md             # 内部开发说明（项目进度追踪）
├── prd.md                # 产品需求文档
├── tasks.md              # 开发任务清单
├── vercel.json           # Vercel 部署配置
├── supabase-setup.sql    # Supabase 表结构初始化
├── supabase-update.sql   # Supabase 数据更新
├── data/                 # 本地数据文件
│   ├── teams.json        # 球队数据
│   ├── matches.json      # 比赛赛程
│   └── historic_records.json  # 历史战绩
├── frontend/             # React 前端
│   ├── src/
│   │   ├── App.tsx       # 根组件 + 路由
│   │   ├── pages/        # 页面组件
│   │   │   ├── TodayPage.tsx    # /today 今日预测
│   │   │   └── SchedulePage.tsx # /schedule 完整赛程
│   │   ├── components/   # 可复用组件
│   │   │   ├── MatchCard.tsx
│   │   │   ├── PredictionForm.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── TeamModal.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   └── ShareImageModal.tsx
│   │   ├── api/          # API 调用
│   │   │   └── index.ts   # 后端 API 封装
│   │   ├── lib/          # 工具库
│   │   │   └── supabase.ts
│   │   ├── hooks/        # React hooks
│   │   ├── utils/        # 工具函数
│   │   └── data/          # 前端静态数据
│   ├── tests/            # Playwright E2E 测试
│   └── package.json
└── backend/              # FastAPI 后端
    ├── main.py           # 应用入口
    ├── models.py         # Pydantic 数据模型
    ├── data_loader.py    # JSON 数据加载
    ├── routers/         # API 路由
    │   ├── matches.py    # /api/matches
    │   ├── teams.py      # /api/teams
    │   ├── predict.py    # /api/predict
    │   └── leaderboard.py # /api/leaderboard
    ├── services/         # 业务逻辑
    │   └── prediction.py  # 预测算法实现
    ├── requirements.txt
    └── tests/            # pytest 单元测试
```

---

## API 设计

后端 API 统一返回格式：

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  timestamp: string;
}
```

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/matches` | GET | 获取比赛列表/赛程 |
| `/api/teams` | GET | 获取球队列表 |
| `/api/teams/:id` | GET | 获取球队详情+历史成绩 |
| `/api/predict` | POST | 提交预测请求 |
| `/api/predict/:matchId` | GET | 获取单场比赛预测结果 |
| `/api/leaderboard` | GET | 获取排行榜（Supabase 聚合） |
| `/api/predictions/:deviceId` | GET | 获取某用户预测记录 |
| `/api/match/:id/result` | POST | 管理员录入比赛结果 |

---

## 预测算法

- **历史分**: 满分 40 分（冠军次数 15 + 参赛次数 5 + 胜率 10 + 最近表现 10）
- **球员分**: 满分 60 分（FIFA排名 15 + 五大联赛球员 15 + 身价 15 + 主教练 5 + 阵容深度 10）
- **综合评分**: `历史分 × 40% + 球员分 × 60%`
- **胜率计算**: logistic 函数 `1 / (1 + 10^(-power_diff/3))`

---

## 常用命令

### 前端
```bash
cd frontend
npm install
npm run dev        # 开发服务器
npm run build      # 生产构建
npm run lint       # 代码检查
```

### 后端
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000  # 开发服务器
pytest tests/    # 单元测试
```

---

## 编码规范

### 前端 (TypeScript/React)

- 使用 TypeScript，严格类型定义
- 组件使用函数式组件 + Hooks
- 组件放在 `components/`，页面组件放在 `pages/`
- API 调用统一放在 `api/` 目录
- 使用 `ApiResponse<T>` 统一响应格式处理后端返回

### 后端 (Python/FastAPI)

- 使用 Pydantic 定义数据模型（见 `models.py`）
- 路由放在 `routers/` 目录，业务逻辑放在 `services/` 目录
- 所有 API 返回统一的 `ApiResponse` 格式
- 单元测试使用 pytest，放在 `tests/` 目录

---

## Supabase 数据模型

### predictions 表（预测记录）
```sql
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  predicted_winner TEXT NOT NULL,  -- 球队代码或 'draw'
  team_a_code TEXT,
  team_b_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, device_id)
);
```

### leaderboard_stats 表（排行榜统计）
```sql
CREATE TABLE leaderboard_stats (
  device_id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  correct_count INT DEFAULT 0,
  total_count INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### match_results 表（比赛结果）
```sql
CREATE TABLE match_results (
  match_id TEXT PRIMARY KEY,
  winner TEXT NOT NULL,  -- 球队代码或 'draw'
  score_a INT,
  score_b INT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 开发注意事项

1. **球队分组**: 当前使用占位符分组（8组 A-H），等待 2025 年底抽签后更新为真实分组
2. **比赛总数**: 79 场（48 小组赛 + 31 淘汰赛），不是 64 场
3. **设备 ID**: 使用 fingerprint.js 生成匿名设备 ID（见 `frontend/src/api/supabase.ts`），目前使用 localStorage 简化版
4. **数据状态**: 2026 世界杯赛程和小组赛分组为占位符，历史战绩和球员评分为模拟数据
5. **部署配置**: 前端通过 Vercel 部署，`/api/*` 路径代理到后端服务
6. **Supabase**: 不要使用 Firebase，已选择 Supabase 作为后端存储

---

## 相关文档

- `prd.md` - 完整产品需求文档
- `tasks.md` - 开发任务清单与进度
- `SUPABASE_DEPLOY.md` - Supabase 部署指南
- `frontend/README.md` - 前端项目说明
