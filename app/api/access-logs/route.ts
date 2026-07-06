import { NextResponse } from 'next/server'
import { db, apiError } from '../_shared/db'
import { readJson, toNumber, toSafeString } from '../_shared/format'

export const dynamic = 'force-dynamic'

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    created_at: row.创建时间,
    device_id: row.设备ID,
    person_id: row.人员ID,
    face_code: row.人脸编号,
    face_name: row.人脸姓名,
    action: row.进入状态,
    person_confidence: row.人体置信度,
    face_confidence: row.人脸置信度,
    raw: row.OpenMV原始数据
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(1000, Math.max(1, Number(searchParams.get('limit') ?? 100)))
    const start = searchParams.get('start') || searchParams.get('from')
    const end = searchParams.get('end') || searchParams.get('to')
    const name = searchParams.get('name')?.trim()

    let query = db().from('安防出入记录').select('*')
    if (start) query = query.gte('创建时间', new Date(start).toISOString())
    if (end) query = query.lte('创建时间', new Date(end).toISOString())
    if (name) query = query.ilike('人脸姓名', `%${name}%`)

    const { data, error } = await query.order('创建时间', { ascending: false }).limit(limit)
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
      人员ID: Math.round(toNumber(body.person_id ?? body.personId ?? body.person ?? body.人员ID, 0)),
      人脸编号: Math.round(toNumber(body.face_code ?? body.faceCode ?? body.人脸编号, 0)),
      人脸姓名: toSafeString(body.face_name ?? body.faceName ?? body.name ?? body.人脸姓名, '未知人员'),
      进入状态: toSafeString(body.action ?? body.进入状态, '进入寝室'),
      人体置信度: toNumber(body.person_confidence ?? body.personConfidence ?? body.人体置信度, 0),
      人脸置信度: toNumber(body.face_confidence ?? body.faceConfidence ?? body.人脸置信度, 0),
      OpenMV原始数据: toSafeString(body.raw ?? body.openmv_raw ?? body.OpenMV原始数据, '')
    }
    const { data, error } = await db().from('安防出入记录').insert(payload).select('*').single()
    if (error) throw error
    return NextResponse.json({ success: true, data: data ? mapRow(data) : payload })
  } catch (error) {
    return apiError(error)
  }
}
