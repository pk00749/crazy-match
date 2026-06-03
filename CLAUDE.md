# Crazy Match - 世界杯预测平台

## 项目概述

2026 世界杯比赛预测平台，帮助用户预测比赛结果并提供各队实力评分。

**技术栈**: React 19 + Vite + TypeScript (前端), FastAPI (Python 后端), Supabase (社交数据存储), Vercel 部署

**开发阶段**:
- MVP: 模拟数据，完整功能
- Phase 2: 真实赛程/球队数据接入
- Phase 3: 预测准确率统计、用户自定义权重

---

## 关键决策（PRD Review 2026-06-03）

| 决策 | 选择 | 原因 |
|------|------|------|
| 后端存储 | Supabase | 更现代，免费套餐宽松 |
| 设备识别 | fingerprint.js | 匿名多设备排行榜需要 |
| 球队分组 | 占位符 | 等待抽签后更新为真实分组 |
| 排行榜 | 多设备 | 通过 Supabase 聚合（非单设备 localStorage） |

---

## 数据模型

### UserPrediction (Supabase)
```typescript
{
  id: string;
  match_id: string;
  device_id: string;          // fingerprint.js 生成
  nickname: string;
  predicted_winner: 'teamA' | 'teamB' | 'draw';
  created_at: string;
  is_correct?: boolean;       // 开奖后计算
}
```

### LeaderboardEntry (Supabase)
```typescript
{
  device_id: string;
  nickname: string;
  correct_count: number;
  total_count: number;
  current_streak: number;
  updated_at: string;
}
```

### Team
```typescript
{
  id: string;
  name: string;
  code: string;           // "BRA", "ARG"
  flag: string;           // 国旗 emoji
  fifa_rank: number;
  group: string;          // A-H (8 groups, not A-L)
  historicRecord: HistoricRecord;
  currentSquad: Player[]; // 23 players
  strengthScore: number;  // 100分制
}
```

### Match
```typescript
{
  id: string;
  date: string;
  time: string;
  stage: 'group' | 'round16' | 'quarter' | 'semi' | 'final';
  group?: string;         // A-H (小组赛)
  teamA: string;
  teamB: string;
  venue: string;
  city: string;
}
```

**注意**: 比赛总数 = 79场（48小组赛 + 31淘汰赛），不是 64 场

---

## API 设计

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

### 统一响应格式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  timestamp: string;
}
```

---

## 页面结构

| 路径 | 功能 |
|------|------|
| `/today` | 当日比赛列表 + 预测 + 排行榜 |
| `/schedule` | 小组赛 + 淘汰赛完整赛程 |

---

## 预测算法

- **历史分**: 满分 40 分（冠军次数 15 + 参赛次数 5 + 胜率 10 + 最近表现 10）
- **球员分**: 满分 60 分（FIFA排名 15 + 五大联赛球员 15 + 身价 15 + 主教练 5 + 阵容深度 10）
- **综合评分**: `历史分 × 40% + 球员分 × 60%`
- **胜率计算**: logistic 函数 `1 / (1 + 10^(-power_diff/3))`

---

## 数据策略

| 数据类型 | 状态 | 说明 |
|----------|------|------|
| 2026世界杯赛程 | 占位符 | 待抽签后更新 |
| 小组赛分组 | 占位符 | 8组 × 4队 = 32队（A-H，非 A-L） |
| 历史战绩 | 模拟 | 1930-2022 主要参赛国 |
| 球员评分 | 模拟 | 每队 23 人 |

---

## Supabase 集成

- 使用 fingerprint.js 生成匿名 device_id
- 预测数据写入 `predictions` 集合
- 排行榜通过 Supabase RPC 聚合计算
- 实时性: 排行榜每 5 分钟刷新

---

## 开发注意

1. 球队分组使用占位符（Section 5 待更新）
2. 不要使用 Firebase（已选择 Supabase）
3. 设备 ID 使用 fingerprint.js，不是简单 UUID
4. 比赛总数 79 场，不是 64 场