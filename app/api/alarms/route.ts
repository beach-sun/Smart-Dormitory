import { NextResponse } from 'next/server'
import { db, apiError } from '../_shared/db'
import { readJson, toBoolean, toNumber, toSafeString } from '../_shared/format'

export const dynamic = 'force-dynamic'

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    created_at: row.创建时间,
    device_id: row.设备ID ?? row['设备 ID'],
    alarm_type: row.报警类型,
    content: row.报警内容,
    level: row.报警等级,
    value: row.传感器数值,
    threshold: row.阈值,
    acknowledged: row.已确认
  }
}

export async function GET(request: Request) {
  try {
    const limit = Math.min(500, Math.max(1, Number(new URL(request.url).searchParams.get('limit') ?? 50)))
    const { data, error } = await db().from('报警数据').select('*').order('创建时间', { ascending: false }).limit(limit)
    if (error) throw error
    return NextResponse.json({ success: true, data: (data ?? []).map(mapRow) })
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request)
    const payload = {
      设备ID: toSafeString(body.device_id ?? body.deviceId ?? body.设备ID, 'smart-dorm-001'),
      报警类型: toSafeString(body.alarm_type ?? body.type ?? body.报警类型, '未知报警'),
      报警内容: toSafeString(body.content ?? body.报警内容, '设备上报报警'),
      报警等级: toSafeString(body.level ?? body.报警等级, 'warning'),
      传感器数值: toNumber(body.value ?? body.传感器数值, 0),
      阈值: toNumber(body.threshold ?? body.阈值, 0),
      已确认: toBoolean(body.acknowledged ?? body.已确认, false)
    }
    const { data, error } = await db().from('报警数据').insert(payload).select('*').single()
    if (error) throw error
    return NextResponse.json({ success: true, data: data ? mapRow(data) : payload })
  } catch (error) {
    return apiError(error)
  }
}
