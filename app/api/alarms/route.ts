import { apiFail, apiOk, db, readJson, safeString, toBool, finite } from '../_shared/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const limit = Math.min(500, Math.max(1, Number(new URL(request.url).searchParams.get('limit') ?? 50)))
    const { data, error } = await db()
      .from('alarms')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return apiOk(data ?? [])
  } catch {
    return apiOk([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request)
    const payload = {
      device_id: safeString(body.device_id, 'smart-dorm-001'),
      alarm_type: safeString(body.alarm_type ?? body.type, 'unknown'),
      content: safeString(body.content, '设备上报报警'),
      level: safeString(body.level, 'warning'),
      value: finite(body.value, 0),
      threshold: finite(body.threshold, 0),
      acknowledged: toBool(body.acknowledged, false)
    }
    const { data, error } = await db().from('alarms').insert(payload).select('*').maybeSingle()
    if (error) throw error
    return apiOk(data ?? payload)
  } catch (error) {
    return apiFail(error)
  }
}
