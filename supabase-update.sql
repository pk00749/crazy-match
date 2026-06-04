-- 更新 predictions 表结构，添加球队代码字段
ALTER TABLE predictions ADD COLUMN IF NOT EXISTS team_a_code TEXT;
ALTER TABLE predictions ADD COLUMN IF NOT EXISTS team_b_code TEXT;

-- 移除旧的 CHECK 约束（如果存在）
ALTER TABLE predictions DROP CONSTRAINT IF EXISTS predictions_predicted_winner_check;

-- 添加新的 CHECK 约束（允许任意文本：球队代码或 'draw'）
ALTER TABLE predictions ADD CONSTRAINT predictions_predicted_winner_check 
  CHECK (predicted_winner = 'draw' OR length(predicted_winner) <= 5);
