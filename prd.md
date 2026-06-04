# Crazy Match - 世界杯比赛预测平台

> PRD v1.0 · 2026-05-31
> 整合自 prd_1.md + prd_2.md

---

## 1. 项目概述

**项目名称**: Crazy Match
**项目类型**: Web 应用（预测型工具）
**核心定位**: 基于历史数据和球员实力，对 2026 世界杯比赛结果进行预测分析
**目标用户**: 球迷、博彩爱好者、数据分析爱好者

**一句话描述**: 2026 世界杯比赛预测平台，帮助用户预测比赛结果并提供各队实力评分

**长期定位**:
- V1（当前）: 2026 世界杯比赛预测
- V2: 扩展到欧冠、欧洲杯等赛事
- V3: 加入 AI 比分预测模型

---

## 2. 核心功能

### 2.1 比赛数据

- **2026年世界杯完整赛程**: 48 支球队，小组赛 + 淘汰赛
- **数据策略**: MVP 阶段使用模拟数据

### 2.2 历史成绩查询

各队过往世界杯成绩（1930 年至今）:
- 参赛届数、总胜/平/负场次
- 总进球/失球、最佳成绩
- 近年表现（最近 3 届战绩）

### 2.3 预测模型

#### 模型一：历史战绩预测（40%）

```
战绩分 = (胜场数 × 3 + 平场数 × 1) / 总场次 × 权重系数
近期加成 = 最近一届成绩 × 调整系数
```

#### 模型二：球员实力评估（60%）

综合考量:
- 个人能力值（FIFA 球员评分 0-100）
- 阵容完整性（主力球员健康状态、年龄结构）
- 位置分布（前锋、中场、门将人员储备）
- 大赛经验（过往世界杯/大赛出场次数）

计算公式:
```
球队实力分 = Σ(球员评分 × 位置权重) × 大赛经验系数 × 阵容完整度
```

#### 综合评分

```
球队实力 = 历史分 × 40% + 球员分 × 60%
```

### 2.4 社交功能（Supabase 多设备存储）

基于 Supabase + fingerprint.js 实现多设备匿名预测:

#### 匿名预测系统
- 用户提交预测时只需输入昵称（不注册）
- 使用 fingerprint.js 生成匿名设备 ID
- 预测数据存储在 Supabase（支持多设备同步）
- 每场比赛开奖后自动计算准确率
- 用户可查看"我的预测"记录

#### 多设备排行榜
- 通过 Supabase 聚合所有用户预测数据
- 维度：总准确率 / 今日准确率 / 连胜次数
- 展示前 20 名，匿名展示昵称
- 排行榜每 5 分钟刷新一次

#### 预测分享链接
- 生成的 URL 包含预测结果参数
- 示例: `crazymatch.app/p/bra-cro?winner=bra`
- 接收者打开链接可查看预测内容
- 投票/评论交由社交平台（微信/微博）处理

#### 晒单图片生成
- Canvas 渲染生成可分享的图片
- 包含：比赛信息、预测结果、昵称、生成时间
- 适配微信/微博分享尺寸（1:1 或 9:16）
- 内置引导语"扫码来 Crazy Match 预测"

---

## 3. 用户界面设计

### 3.1 页面结构

```
/today        # 当日赛程预测
/schedule     # 小组赛 + 淘汰赛完整赛程
```

### 3.2 主页（/today）

**功能**:
- 展示当前选中日期的比赛列表（默认当天）
- 每场比赛显示双方信息 + 预测结果
- 日历控件：支持选择任意日期，查看该日赛程预测
- 切换预测模型：历史战绩 / 球员实力
- 社交：匿名预测提交 + 排行榜

**布局**:
```
┌────────────────────────────────────────────┐
│  [日期选择器]  ← 日历控件                  │
│  2026年6月11日 · 小组赛第1轮               │
├────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐   │
│  │ 🇧🇷 巴西  vs  🇭🇷 克罗地亚           │   │
│  │  历史预测: 62% / 23% / 15%          │   │
│  │  球员实力: 88 vs 82                 │   │
│  │  [预测] [查看详情] [分享]            │   │
│  └─────────────────────────────────────┘   │
│  ...                                       │
├────────────────────────────────────────────┤
│  📊 匿名预测排行榜（当前比赛日）           │
│  1. 铁杆球迷  · 3场全中 🏆                 │
│  2. 赌神附体  · 2中1错                     │
│  ...                                       │
└────────────────────────────────────────────┘
```

### 3.3 总赛程（/schedule）

**功能**:
- 展示世界杯完整赛程（小组赛 → 淘汰赛）
- 小组赛按组别分组（8 组 × 4 队 = 32 队，A-H 组）
- 淘汰赛按阶段展示（16强 → 8强 → 4强 → 决赛）
- Tab 切换小组赛/淘汰赛阶段

**布局**:
```
┌────────────────────────────────────────────┐
│  [小组赛] [16强] [8强] [4强] [决赛]        │
├────────────────────────────────────────────┤
│  📅 小组赛 A 组                            │
│  ├─ 巴西 vs 克罗地亚  6月11日 19:00       │
│  ├─ 墨西哥 vs 法国   6月11日 22:00        │
│                                             │
│  📅 小组赛 B 组                            │
│  ├─ ...                                    │
└────────────────────────────────────────────┘
```

### 3.4 核心交互

- 日历控件切换日期 → 更新比赛列表
- 点击比赛卡片 → 展开预测详情面板
- Tab 切换小组赛/淘汰赛阶段
- 切换预测模型（历史模型 / 球员模型）

---

## 4. 技术架构

### 4.1 技术栈

| 层级 | 技术选型 |
|------|----------|
| 前端 | React 19 + Vite + TypeScript |
| 后端 | FastAPI (Python) |
| 部署 | Vercel（前后端一体化） |
| 冷数据存储 | JSON 文件 + 内存缓存 |
| 社交数据存储 | Supabase（用户预测、排行榜） |

### 4.2 项目结构（Monorepo）

```
crazy-match/
├── frontend/           # React 前端
│   ├── src/
│   │   ├── components/ # UI 组件
│   │   ├── pages/      # 页面
│   │   ├── api/        # API 调用
│   │   └── utils/      # 工具函数
│   ├── package.json
│   └── vite.config.ts
├── backend/            # FastAPI 后端
│   ├── main.py
│   ├── routers/
│   └── services/       # 预测逻辑
├── vercel.json         # Vercel 部署配置
└── README.md
```

### 4.3 API 设计

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

#### 统一响应格式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  timestamp: string;
}
```

### 4.4 数据模型

```typescript
// 球队
interface Team {
  id: string;
  name: string;
  code: string;           // 如 "BRA", "ARG"
  flag: string;           // 国旗 emoji
  fifa_rank: number;
  group: string;          // A-L
  historicRecord: HistoricRecord;
  currentSquad: Player[];
  strengthScore: StrengthScore;  // 100分制
}

// 历史战绩
interface HistoricRecord {
  participations: number;      // 参赛次数
  championships: number;      // 冠军次数
  wins: number;               // 胜场
  draws: number;              // 平场
  losses: number;             // 负场
  goals_scored: number;      // 进球
  goals_conceded: number;     // 失球
  best_result: string;       // 最好成绩
  recent_performance: string[];  // 近三届成绩
}

// 球员
interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  age: number;
  club: string;
  market_value: number;    // 身价（万欧元）
  rating: number;         // 0-100
}

// 比赛
interface Match {
  id: string;
  date: string;
  time: string;
  stage: 'group' | 'round16' | 'quarter' | 'semi' | 'final';
  group?: string;         // A-L (小组赛)
  teamA: string;          // 队伍 code
  teamB: string;          // 队伍 code
  venue: string;
  city: string;
  prediction?: Prediction;
}

// 预测结果
interface Prediction {
  model: 'historic' | 'squad';
  winProbability: { teamA: number; teamB: number; draw: number };
  strengthRating: { teamA: number; teamB: number };
  factors: string[];       // 预测依据
}

// 用户预测（localStorage 存储）
interface UserPrediction {
  id: string;
  matchId: string;
  nickname: string;
  predictedWinner: 'teamA' | 'teamB' | 'draw';
  predictedScore?: { teamA: number; teamB: number };
  createdAt: string;
}

// 用户积分（localStorage 存储）
interface UserStats {
  nickname: string;
  totalPredictions: number;
  correctPredictions: number;
  currentStreak: number;
  longestStreak: number;
}
```

---

## 5. 参赛队伍（2026 世界杯 48 强）

> ⚠️ 以下为占位符数据，待抽签后更新为真实分组
> 2026 世界杯共 8 组（A-H），每组 4 队，共 32 支球队

| 组别 | 队伍 |
|------|------|
| A组 | [待更新]、[待更新]、[待更新]、[待更新] |
| B组 | [待更新]、[待更新]、[待更新]、[待更新] |
| C组 | [待更新]、[待更新]、[待更新]、[待更新] |
| D组 | [待更新]、[待更新]、[待更新]、[待更新] |
| E组 | [待更新]、[待更新]、[待更新]、[待更新] |
| F组 | [待更新]、[待更新]、[待更新]、[待更新] |
| G组 | [待更新]、[待更新]、[待更新]、[待更新] |
| H组 | [待更新]、[待更新]、[待更新]、[待更新] |

---

## 6. 数据策略

### 6.1 数据来源

| 数据类型 | 来源 | 状态 | 说明 |
|----------|------|------|------|
| 2026世界杯赛程 | **模拟数据** | ✅ 已确认 | MVP阶段使用预设赛程 |
| 小组赛对阵 | **模拟数据** | ✅ 已确认 | 48强按分档预设，A-L组对阵模拟 |
| 历史战绩 | **模拟数据** | ✅ 已确认 | 主要参赛国历史数据（1930-2022） |
| 淘汰赛对阵 | **模拟数据** | ✅ 已确认 | 16强起按预设逻辑推演 |
| 球员评分 | **模拟数据** | ✅ 已确认 | MVP按位置+星级模拟真实球员评分 |
| 真实赛程 | FIFA官方 / 维基百科 | ⏳ 待接入 | 抽签完成后接入 |
| 真实历史数据 | Wikipedia / OpenData | ⏳ 待接入 | 需结构化清洗 |
| 真实球员评分 | Transfermarkt / SOFIFA | ⏳ 待评估 | 付费API，评估成本后决定 |

### 6.2 数据维护策略（更新至 2026）

| 阶段 | 时间 | 数据策略 |
|------|------|----------|
| MVP开发期 | ~2026年5月 | 纯模拟数据，保证功能完整 |
| 抽签完成 | 2024年12月 | ✅ 已完成 - 接入真实赛程+分档 |
| 小组赛开始 | 2026年6月11日 | ✅ 接入真实球队阵容+球员评分 |
| 比赛期间 | 2026年6月-7月 | 每日更新比分，实时计算预测准确率 |

### 6.3 数据质量标准

- 模拟数据必须覆盖 **48 强全部参赛队**
- 每队至少包含 **23 名模拟球员**（符合真实阵容人数）
- 模拟数据格式与真实 API 返回格式 **完全一致**，便于后续替换

### 6.4 Supabase 社交存储方案

**职责分工**:
| 组件 | 职责 |
|------|------|
| FastAPI | 预测算法、比赛/球队数据 API |
| Supabase | 用户预测存储、排行榜聚合、多设备识别 |
| JSON Files | 冷数据存储（球队历史、球员评分、赛程） |

**Supabase 集合**:
```typescript
// predictions 集合
interface UserPrediction {
  id: string;
  match_id: string;
  device_id: string;          // fingerprint.js 生成
  nickname: string;
  predicted_winner: 'teamA' | 'teamB' | 'draw';
  created_at: string;
  is_correct?: boolean;       // 开奖后计算
}

// leaderboard 通过 RPC 聚合
```

---

## 7. 预测算法详解

**注意**: 比赛总数为 **79 场**（48 小组赛 + 31 淘汰赛），不是 64 场

### 7.1 历史分计算（满分 40 分）

| 指标 | 权重 | 说明 |
|------|------|------|
| 冠军次数 | 15分 | 每冠 2.5 分，上限 15 |
| 参赛次数 | 5分 | 参赛超过 15 次得满分 |
| 胜率 | 10分 | 胜率 >60% 得满分 |
| 最近表现 | 10分 | 近三届成绩加权 |

### 7.2 球员分计算（满分 60 分）

| 指标 | 权重 | 说明 |
|------|------|------|
| FIFA 排名 | 15分 | 排名 1 得 15 分，递减 |
| 五大联赛球员 | 15分 | 每名主力加 1-3 分 |
| 身价总和 | 15分 | 身价前三球员加权 |
| 主教练 | 5分 | 名帅加成 |
| 阵容深度 | 10分 | 替补席实力 |

### 7.3 预测公式

```python
# 计算预测结果
def calculate_prediction(home_team, away_team):
    # 历史分 (满分 40)
    home_history = calculate_history_score(home_team) * 0.4
    away_history = calculate_history_score(away_team) * 0.4

    # 球员分 (满分 60)
    home_player = calculate_player_score(home_team) * 0.6
    away_player = calculate_player_score(away_team) * 0.6

    # 综合实力分
    home_power = home_history + home_player
    away_power = away_history + away_player

    # 计算胜率（使用 logistic 函数）
    power_diff = home_power - away_power
    home_win_prob = 1 / (1 + 10 ** (-power_diff / 3))
    away_win_prob = 1 - home_win_prob

    return {
        "home_win": home_win_prob,
        "draw": 0.15,  # 平局假设
        "away_win": away_win_prob
    }
```

---

## 8. 开发阶段

### Phase 1: MVP（当前 PRD 范围）

**重要**: MVP 阶段全部使用**模拟数据**，不依赖任何外部 API。

- [ ] 完整的模拟比赛数据（48强 + 79场比赛）
- [ ] 模拟历史战绩数据（主要参赛国 1930-2022）
- [ ] 模拟球员评分数据（每队23人）
- [ ] 历史战绩预测算法（FastAPI）
- [ ] 球员实力评估算法（基于模拟评分）
- [ ] 基础前端展示（/today + /schedule）
- [ ] Supabase 集成（用户预测存储）
- [ ] fingerprint.js 设备 ID 生成
- [ ] 多设备排行榜（Supabase 聚合）
- [ ] 晒单图片生成
- [ ] Vercel 部署验证

### Phase 2: 真实数据接入

- [ ] 抽签后接入真实赛程和分档
- [ ] 接入真实历史战绩数据（Wikipedia 清洗）
- [ ] 评估真实球员评分 API 成本

### Phase 3: 增强

- [ ] 预测准确率统计
- [ ] 用户自定义权重
- [ ] 分享链接追踪（可选）

---

## 9. 约束与限制

- 本项目仅支持 **2026 世界杯**（美国/加拿大/墨西哥联合举办）
- MVP 阶段球员数据使用 **模拟数据**，Phase 2 接入真实评分
- 预测结果仅供娱乐参考，不构成任何投注建议
- **社交功能使用 Supabase 存储**（非 localStorage），支持多设备同步
- 设备识别使用 fingerprint.js，匿名且不支持跨设备数据迁移

---

## 10. 验收标准

### 10.1 主页（/today）
- [ ] 日历控件默认选中当天
- [ ] 切换日期后正确显示该日比赛列表
- [ ] 每场比赛展示双方队徽、预测胜率、球员实力分

### 10.2 总赛程（/schedule）
- [ ] 支持切换小组赛/淘汰赛 Tab
- [ ] 小组赛按组别分组显示（8 组，A-H）
- [ ] 淘汰赛按阶段（16强→决赛）展示
- [ ] 点击比赛可查看预测详情

### 10.3 全局
- [ ] 网站可成功部署到 Vercel 并正常运行

### 10.4 社交功能（Supabase 多设备）
- [ ] 用户可输入昵称提交预测（不注册）
- [ ] 使用 fingerprint.js 生成设备 ID
- [ ] 预测数据正确保存到 Supabase
- [ ] 开奖后可查看个人预测记录和准确率
- [ ] 多设备排行榜正确展示前 20 名（Supabase 聚合）
- [ ] 可生成晒单图片（Canvas）
- [ ] 可生成分享链接（URL 参数携带预测结果）

---

## 11. 成功指标

| 指标 | 描述 | 目标 |
|------|------|------|
| 预测准确率 | 正确预测胜负的比例 | >70% |
| UV | 独立访客数 | 世界杯期间 5w+ |
| 页面停留 | 平均停留时间 | >3min |
| 分享率 | 分享到社交媒体的比例 | >10% |

---

## 12. 风险与对策

| 风险 | 概率 | 影响 | 对策 |
|------|------|------|------|
| 数据不准确 | 中 | 高 | 多源交叉验证 |
| 预测误差大 | 高 | 中 | 明确标注"仅供参考" |
| 球队阵容变化 | 中 | 中 | 设置数据更新机制 |
| 世界杯延期 | 低 | 高 | 预留缓冲时间 |

---

*文档版本：1.1*
*创建日期：2026-05-31*
*最后更新：2026-06-03*
*整合自：prd_1.md + prd_2.md*
*更新内容：Supabase 多设备存储、分组占位符、比赛总数修正（79场）、技术栈细化