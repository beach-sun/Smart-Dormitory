import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type EnvStatus = {
  ok: boolean
  url: boolean
  adminKey: boolean
  anonKey: boolean
  message: string
}

let cached: SupabaseClient | null = null

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
}

function getSupabaseServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
}

export function getSupabaseEnvStatus(): EnvStatus {
  const url = Boolean(getSupabaseUrl())
  const adminKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const anonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  return {
    ok: url && (adminKey || anonKey),
    url,
    adminKey,
    anonKey,
    message: url && (adminKey || anonKey) ? 'Supabase 环境变量已配置' : '缺少 Supabase URL 或 Key，请检查 .env.local'
  }
}

export function getSupabaseAdmin() {
  if (cached) return cached
  const url = getSupabaseUrl()
  const key = getSupabaseServiceKey()
  if (!url || !key) {
    throw new Error('Supabase 环境变量未配置：请设置 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY')
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  return cached
}
