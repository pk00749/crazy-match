import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hgtmzdueqhxnwnjrtwcm.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_L1QOaivTH6Tlqd7NbM_sWg_nP5dOQ-e'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
