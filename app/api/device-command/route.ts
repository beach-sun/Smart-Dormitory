import { NextResponse } from 'next/server'
import { db } from '../_shared/db'

export const dynamic = 'force-dynamic'

// ================= GET =================
export async function GET() {
  try {
    const { data, error } = await db()
      .from('device_control')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    if (error) {
      return NextResponse.json({
        success: false,
        message: error.message,
        data: null
      })
    }

    return NextResponse.json({
      success: true,
      data: data ?? {
        id: 1,
        mode: 'auto',
        light: false,
        fan: false,
        fan_speed: 0,
        socket: false,
        sleep_mode: false
      }
    })
  } catch (e) {
    return NextResponse.json({
      success: false,
      data: null
    })
  }
}

// ================= POST =================
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const payload = {
      id: 1,
      mode: body.mode ?? 'auto',
      light: body.light ?? false,
      fan: body.fan ?? false,
      fan_speed: body.fan_speed ?? 0,
      socket: body.socket ?? false,
      sleep_mode: body.sleep_mode ?? false,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await db()
      .from('device_control')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .maybeSingle()

    if (error) {
      return NextResponse.json({
        success: false,
        message: error.message,
        data: null
      })
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: 'server error',
      data: null
    })
  }
}