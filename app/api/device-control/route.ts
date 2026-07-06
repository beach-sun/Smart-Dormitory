import { NextResponse } from 'next/server'
import { readJson } from '../_shared/format'
import { writeOperationLog } from '../_shared/log'
import { getControlState, updateControlState } from './state'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = getControlState()
  return NextResponse.json({ success: true, data, ...data })
}

export async function POST(request: Request) {
  const body = await readJson(request)
  const oldValue = getControlState()
  const data = updateControlState(body)
  await writeOperationLog({
    type: '设备控制',
    content: `更新执行器：模式=${data.mode === 'manual' ? '手动' : '自动'}，灯=${data.light ? '开' : '关'}，风扇=${data.fan ? `${data.fan_speed}%` : '关'}，插座=${data.socket ? '开' : '关'}`,
    oldValue,
    newValue: data
  })
  return NextResponse.json({ success: true, data, ...data })
}
