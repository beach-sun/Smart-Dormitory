import { NextResponse } from 'next/server'
import { getSupabaseEnvStatus } from '@/utils/supabase/admin'
import { getConfig } from '../config/state'
import { getControlState } from '../device-control/state'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      ok: true,
      time: new Date().toISOString(),
      supabase: getSupabaseEnvStatus(),
      control: getControlState(),
      config: getConfig()
    }
  })
}
