import { apiFail, apiOk, db, deviceTokenValid, readJson } from '../_shared/db'
import { normalizeSensor } from '../_shared/model'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function buildAlarmRows(payload: any) {
  const rows: any[] = []
  if (payload.smoke_alarm) rows.push({ device_id: payload.device_id, alarm_type: 'smoke', content: '烟雾浓度超过阈值', level: 'danger', value: payload.mq2_value })
  if (payload.co2_alarm) rows.push({ device_id: payload.device_id, alarm_type: 'co2', content: '二氧化碳浓度超过阈值', level: 'warning', value: payload.co2 })
  if (payload.abnormal_power_alarm) rows.push({ device_id: payload.device_id, alarm_type: 'power', content: '实时功率超过阈值', level: 'danger', value: payload.power })
  if (payload.temperature_alarm) rows.push({ device_id: payload.device_id, alarm_type: 'temperature', content: '温度超过设定范围', level: 'warning', value: payload.temperature })
  return rows
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(500, Math.max(1, Number(searchParams.get('limit') ?? 50)))
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    let query = db()
      .from('sensor_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (start) query = query.gte('created_at', new Date(start).toISOString())
    if (end) query = query.lte('created_at', new Date(end).toISOString())

    const { data, error } = await query
    if (error) throw error
    return apiOk(data ?? [])
  } catch {
    return apiOk([])
  }
}

export async function POST(request: Request) {
  try {
    if (!deviceTokenValid(request)) return apiFail('Invalid device token', 401)

    const body = await readJson(request)
    const payload = normalizeSensor(body)

    const { data, error } = await db()
      .from('sensor_data')
      .insert(payload)
      .select('*')
      .maybeSingle()

    if (error) throw error

    const alarmRows = buildAlarmRows(payload)
    if (alarmRows.length) {
      await db().from('alarms').insert(alarmRows).then(() => undefined)
    }

    if (payload.person_detected) {
      await db().from('access_logs').insert({
        device_id: payload.device_id,
        person_id: payload.person,
        face_code: payload.face_code,
        face_name: payload.face_name,
        action: '进入寝室',
        person_confidence: payload.person_confidence,
        face_confidence: payload.face_confidence,
        raw: payload.openmv_raw
      }).then(() => undefined)
    }

    return apiOk(data ?? payload)
  } catch (error) {
    return apiFail(error)
  }
}
