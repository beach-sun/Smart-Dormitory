import { NextResponse } from 'next/server'
import { readJson } from '../_shared/format'
import { writeOperationLog } from '../_shared/log'
import { getConfig, updateConfig } from './state'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = getConfig()
  return NextResponse.json({ success: true, data, ...data })
}

export async function POST(request: Request) {
  const body = await readJson(request)
  const oldValue = getConfig()
  const data = updateConfig(body)
  await writeOperationLog({
    type: '阈值设置',
    content: '更新传感器阈值与自动控制参数',
    oldValue,
    newValue: data
  })
  return NextResponse.json({ success: true, data, ...data })
}
