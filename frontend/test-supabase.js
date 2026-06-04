// Supabase 连接测试脚本
// 在浏览器控制台中运行此代码

const SUPABASE_URL = 'https://hgtmzdueqhxnwnjrtwcm.supabase.co'
const SUPABASE_KEY = 'sb_publishable_L1QOaivTH6Tlqd7NbM_sWg_nP5dOQ-e'

async function testSupabase() {
  console.log('🧪 Testing Supabase Connection...')
  
  // 测试 predictions 表
  const response = await fetch(`${SUPABASE_URL}/rest/v1/predictions?select=*&limit=10`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    }
  })
  
  if (response.ok) {
    const data = await response.json()
    console.log('✅ Supabase Connected!')
    console.log('📊 Predictions count:', data.length)
    if (data.length > 0) {
      console.log('📋 Latest prediction:', data[0])
    }
  } else {
    console.log('❌ Connection failed:', response.status, response.statusText)
  }
}

testSupabase()
