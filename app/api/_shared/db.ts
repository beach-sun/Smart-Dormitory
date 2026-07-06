import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'

export function db() { return getSupabaseAdmin() }
export function apiError(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : String(error)
  return NextResponse.json({ success: false, message, data: null }, { status })
}
