import { NextResponse } from 'next/server'
import { db } from '../_shared/db'

export const dynamic = 'force-dynamic'

type DeviceControlBody = {
  mode?: string
  light?: boolean
  fan?: boolean
  fan_speed?: number
  socket?: boolean
  sleep_mode?: boolean
}

export async function GET() {
  try {
    const { data, error } = await db()
      .from('device_control')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    if (error) {
      console.error('GET /api/device-control Supabase error:', error)

      return NextResponse.json(
        {
          success: false,
          message: error.message,
          data: null,
        },
        { status: 500 }
      )
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
        sleep_mode: false,
      },
    })
  } catch (error) {
    console.error('GET /api/device-control error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to read device control state',
        data: null,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DeviceControlBody

    const payload = {
      id: 1,
      mode: body.mode,
      light: body.light,
      fan: body.fan,
      fan_speed: body.fan_speed,
      socket: body.socket,
      sleep_mode: body.sleep_mode,
      updated_at: new Date().toISOString(),
    }

    Object.keys(payload).forEach((key) => {
      const typedKey = key as keyof typeof payload
      if (payload[typedKey] === undefined) {
        delete payload[typedKey]
      }
    })

    const { data, error } = await db()
      .from('device_control')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .maybeSingle()

    if (error) {
      console.error('POST /api/device-control Supabase error:', error)

      return NextResponse.json(
        {
          success: false,
          message: error.message,
          data: null,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('POST /api/device-control error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update device control state',
        data: null,
      },
      { status: 500 }
    )
  }
}