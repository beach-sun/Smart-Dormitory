import { NextResponse } from 'next/server'
import { getConfig } from '../config/state'
import { getControlState } from '../device-control/state'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      control: getControlState(),
      config: getConfig(),
      server_time: new Date().toISOString()
    }
  })
}
