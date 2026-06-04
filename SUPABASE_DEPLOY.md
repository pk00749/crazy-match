# Crazy Match - Supabase 部署教程

## 前置要求

- Supabase 账号 ([https://supabase.com](https://supabase.com))
- Node.js 18+
- Git

---

## 第一步：创建 Supabase 项目

### 1.1 注册/登录 Supabase
1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project" 或登录已有账号

### 1.2 创建新项目
1. 点击 "New Project"
2. 填写项目信息：
   - **Organization**: 选择或创建组织
   - **Name**: `crazy-match` 或你喜欢的名称
   - **Database Password**: 设置强密码（保存好！）
   - **Region**: 选择靠近你的区域（如 `East Asia`）

3. 等待项目创建完成（约2分钟）

### 1.3 获取项目配置
创建完成后，在项目设置中找到：
- **Project URL**: `https://xxxxx.supabase.co`
- **anon/public key**: 用于前端
- **service_role key**: 用于后端（保密！）

---

## 第二步：创建数据库表

### 2.1 进入 SQL Editor
在 Supabase Dashboard 中，点击 **SQL Editor** -> **New query**

### 2.2 创建 predictions 表
```sql
-- 预测记录表
CREATE TABLE predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  predicted_winner TEXT NOT NULL CHECK (predicted_winner IN ('team_a', 'team_b', 'draw')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 索引用于查询
  UNIQUE(match_id, device_id)
);

-- 排行榜统计表
CREATE TABLE leaderboard_stats (
  device_id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  correct_count INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用实时订阅
ALTER PUBLICATION supabase_realtime ADD TABLE predictions;
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard_stats;
```

### 2.3 创建 RLS 策略（行级安全）
```sql
-- 预测表：所有人可读写
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert predictions" ON predictions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read predictions" ON predictions
  FOR SELECT USING (true);

-- 排行榜：所有人可读写
ALTER TABLE leaderboard_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can upsert leaderboard" ON leaderboard_stats
  FOR ALL USING (true);
```

### 2.4 创建更新排行榜的函数
```sql
-- 更新排行榜的函数
CREATE OR REPLACE FUNCTION update_leaderboard_stats(
  p_device_id TEXT,
  p_nickname TEXT,
  p_is_correct BOOLEAN
)
RETURNS void AS $$
DECLARE
  v_current Streak INTEGER;
BEGIN
  -- 插入或更新统计
  INSERT INTO leaderboard_stats (device_id, nickname, correct_count, total_count, current_streak, updated_at)
  VALUES (p_device_id, p_nickname, 
          CASE WHEN p_is_correct THEN 1 ELSE 0 END,
          1,
          CASE WHEN p_is_correct THEN 1 ELSE 0 END,
          NOW())
  ON CONFLICT (device_id) DO UPDATE SET
    nickname = COALESCE(p_nickname, leaderboard_stats.nickname),
    correct_count = leaderboard_stats.correct_count + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    total_count = leaderboard_stats.total_count + 1,
    current_streak = CASE 
      WHEN p_is_correct THEN leaderboard_stats.current_streak + 1 
      ELSE 0 
    END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

### 2.5 执行 SQL
点击 **Run** 执行所有 SQL 语句。

---

## 第三步：配置前端环境变量

### 3.1 创建 .env 文件
在 `frontend/` 目录下创建 `.env` 文件：

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3.2 安装 Supabase 客户端
```bash
cd frontend
npm install @supabase/supabase-js
```

### 3.3 创建 Supabase 客户端
创建 `src/lib/supabase.ts`：

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 第四步：更新前端代码使用 Supabase

### 4.1 安装 fingerprint.js（匿名设备识别）
```bash
npm install @fingerprintjs/fingerprintjs
```

### 4.2 更新 API 层使用 Supabase
创建 `src/api/supabase.ts`：

```typescript
import { supabase } from '../lib/supabase'
import fingerprintJs from '@fingerprintjs/fingerprintjs'

// 获取设备ID
export async function getDeviceId(): Promise<string> {
  const fp = await fingerprintJs.load()
  const result = await fp.get()
  return result.visitorId
}

// 提交预测
export async function submitPrediction(
  matchId: string,
  nickname: string,
  predictedWinner: 'team_a' | 'team_b' | 'draw'
) {
  const deviceId = await getDeviceId()
  
  const { data, error } = await supabase
    .from('predictions')
    .upsert({
      match_id: matchId,
      device_id: deviceId,
      nickname: nickname,
      predicted_winner: predictedWinner,
    }, { onConflict: 'match_id,device_id' })
  
  if (error) throw error
  return data
}

// 获取排行榜
export async function getLeaderboard(limit = 20) {
  const { data, error } = await supabase
    .from('leaderboard_stats')
    .select('*')
    .order('correct_count', { ascending: false })
    .order('current_streak', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

// 获取用户预测记录
export async function getUserPredictions() {
  const deviceId = await getDeviceId()
  
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('device_id', deviceId)
  
  if (error) throw error
  return data
}
```

---

## 第五步：本地测试

### 5.1 启动前端
```bash
cd frontend
npm run dev
```

### 5.2 测试功能
1. 打开 http://localhost:5173
2. 提交一个预测
3. 在 Supabase Dashboard 查看 `predictions` 表是否有数据

### 5.3 检查数据库
在 Supabase Dashboard -> Table Editor -> predictions 查看数据。

---

## 第六步：部署到 Vercel

### 6.1 推送代码到 GitHub
```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
```

### 6.2 连接到 Vercel
1. 访问 [https://vercel.com](https://vercel.com)
2. Import 项目（选择你的 GitHub 仓库）
3. 在 Environment Variables 中添加：
   - `VITE_SUPABASE_URL` = 你的 Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = 你的 anon key

### 6.3 部署
点击 Deploy，Vercel 会自动构建和部署。

---

## 常见问题

### Q: SQL 执行失败？
A: 确保在正确的数据库上执行，检查是否有权限。

### Q: 预测提交成功但排行榜没更新？
A: 排行榜需要手动调用 `update_leaderboard_stats` 函数，或者在比赛结果出来后批量更新。

### Q: 如何查看 Supabase API 用量？
A: 在 Supabase Dashboard -> Settings -> Usage 查看。

### Q: 如何重置数据库？
A: 在 SQL Editor 中执行 `DROP TABLE predictions; DROP TABLE leaderboard_stats;` 然后重新运行建表 SQL。

---

## 下一步

1. 配置比赛结果录入功能
2. 添加自动计算预测准确率
3. 实现晒单图片生成功能

---
