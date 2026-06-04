-- 重建 predictions 表，确保列和约束正确

-- 删除旧表（如果存在）
DROP TABLE IF EXISTS predictions;

-- 创建新表
CREATE TABLE predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  predicted_winner TEXT NOT NULL,
  team_a_code TEXT,
  team_b_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建唯一约束（允许同一设备对同一比赛多次预测）
CREATE UNIQUE INDEX predictions_unique ON predictions (match_id, device_id);

-- 开启 RLS
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- 添加策略：所有人可读写
DROP POLICY IF EXISTS "Anyone can insert predictions" ON predictions;
CREATE POLICY "Anyone can insert predictions" ON predictions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read predictions" ON predictions;
CREATE POLICY "Anyone can read predictions" ON predictions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can upsert predictions" ON predictions;
CREATE POLICY "Anyone can upsert predictions" ON predictions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete predictions" ON predictions;
CREATE POLICY "Anyone can delete predictions" ON predictions FOR DELETE USING (true);

-- 启用实时订阅
DROP PUBLICATION IF EXISTS supabase_realtime CASCADE;
CREATE PUBLICATION supabase_realtime FOR TABLE predictions;

-- 授予权限
GRANT ALL ON predictions TO anon;
GRANT ALL ON predictions TO authenticated;
