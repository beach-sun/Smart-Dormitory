import { NextResponse } from 'next/server'
import { db, apiError } from '../_shared/db'
import { readJson, toSafeString } from '../_shared/format'

export const dynamic = 'force-dynamic'

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    created_at: row.创建时间,
    source: row.操作来源,
    type: row.操作类型,
    content: row.操作内容,
    old_value: row.旧值,
    new_value: row.新值
  }
}

export async function GET(request: Request) {
  try {
    const limit = Math.min(200, Math.max(1, Number(new URL(request.url).searchParams.get('limit') ?? 50)))
    const { data, error } = await db().from('操作日志').select('*').order('创建时间', { ascending: false }).limit(limit)
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
      操作来源: toSafeString(body.source, '设备端'),
      操作类型: toSafeString(body.type, '系统事件'),
      操作内容: toSafeString(body.content, '无内容'),
      旧值: body.old_value ?? null,
      新值: body.new_value ?? null
    }
    const { data, error } = await db().from('操作日志').insert(payload).select('*').single()
    if (error) throw error
    return NextResponse.json({ success: true, data: data ? mapRow(data) : payload })
  } catch (error) {
    return apiError(error)
  }
}
