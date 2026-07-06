import { NextResponse } from 'next/server'
import { db, apiError } from '../_shared/db'
import { readJson, toBoolean, toInt, toNumber, toSafeString } from '../_shared/format'

export const dynamic = 'force-dynamic'

const TABLE_NAME = '传感器数据'

type SensorPayload = ReturnType<typeof normalize>

function normalize(body: Record<string, unknown>) {
  const personDetected = toBoolean(body.person_detected ?? body.personDetected ?? body.recognition_result ?? body.occupied, false)
  return {
    设备ID: toSafeString(body.device_id ?? body.deviceId ?? body.设备ID, 'smart-dorm-001'),
    温度: toNumber(body.temperature ?? body.温度, 0),
    湿度: toNumber(body.humidity ?? body.湿度, 0),
    光照: toNumber(body.lux ?? body.光照, 0),
    烟雾值: toInt(body.mq2_value ?? body.mq2 ?? body.烟雾值, 0),
    烟雾数字量: toBoolean(body.mq2_do ?? body.mq2DigitalValue ?? body.烟雾数字量, false),
    二氧化碳: toInt(body.co2 ?? body.co2_ppm ?? body.二氧化碳, 0),
    有人识别: personDetected,
    寝室状态: toSafeString(body.scene_cn ?? body.scene ?? body.寝室状态, '-'),
    工作模式: toSafeString(body.work_mode_cn ?? body.work_mode ?? body.workMode ?? body.工作模式, '-'),
    电压: toNumber(body.voltage ?? body.电压, 0),
    电流: toNumber(body.current_value ?? body.current ?? body.电流, 0),
    功率: toNumber(body.power ?? body.功率, 0),
    电量: toNumber(body.energy_kwh ?? body.energyKWh ?? body.电量, 0),
    照明灯: toBoolean(body.light_relay_state ?? body.light ?? body.照明灯, false),
    风扇: toBoolean(body.fan_state ?? body.fan ?? body.风扇, false),
    风扇速度: toInt(body.fan_speed ?? body.fanSpeed ?? body.风扇速度, 0),
    插座电源: toBoolean(body.socket_relay_state ?? body.socket ?? body.插座电源, false),
    烟雾报警: toBoolean(body.smoke_alarm ?? body.烟雾报警, false),
    二氧化碳报警: toBoolean(body.co2_alarm ?? body.二氧化碳报警, false),
    功率报警: toBoolean(body.abnormal_power_alarm ?? body.功率报警, false),
    温度报警: toBoolean(body.temperature_alarm ?? body.温度报警, false),
    能耗评分: toInt(body.energy_score ?? body.能耗评分, 100),
    烟雾报警次数: toInt(body.smoke_alarm_count ?? body.烟雾报警次数, 0),
    二氧化碳报警次数: toInt(body.co2_alarm_count ?? body.二氧化碳报警次数, 0),
    功率报警次数: toInt(body.abnormal_power_count ?? body.功率报警次数, 0),
    温度报警次数: toInt(body.temperature_alarm_count ?? body.温度报警次数, 0),
    无效用电分钟: toInt(body.invalid_energy_minutes ?? body.无效用电分钟, 0),
    OpenMV在线: toBoolean(body.openmv_online ?? body.openmvOnline ?? body.OpenMV在线, false),
    检测到人员: personDetected,
    人员ID: toInt(body.person ?? body.person_id ?? body.personId ?? body.人员ID, 0),
    人脸编号: toInt(body.face_code ?? body.faceCode ?? body.人脸编号, 0),
    人脸姓名: toSafeString(body.face_name ?? body.faceName ?? body.person_name ?? body.人脸姓名, personDetected ? '未知人员' : '-'),
    人体置信度: toNumber(body.person_confidence ?? body.personConfidence ?? body.人体置信度, 0),
    人脸置信度: toNumber(body.face_confidence ?? body.faceConfidence ?? body.人脸置信度, 0),
    OpenMV原始数据: toSafeString(body.openmv_raw ?? body.openmvRaw ?? body.OpenMV原始数据, '')
  }
}

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    created_at: row.创建时间,
    device_id: row.设备ID,
    temperature: row.温度,
    humidity: row.湿度,
    lux: row.光照,
    mq2_value: row.烟雾值,
    mq2_do: row.烟雾数字量,
    co2: row.二氧化碳,
    recognition_result: row.有人识别,
    scene: row.寝室状态,
    work_mode: row.工作模式,
    voltage: row.电压,
    current_value: row.电流,
    power: row.功率,
    energy_kwh: row.电量,
    light_relay_state: row.照明灯,
    fan_state: row.风扇,
    fan_speed: row.风扇速度,
    socket_relay_state: row.插座电源,
    smoke_alarm: row.烟雾报警,
    co2_alarm: row.二氧化碳报警,
    abnormal_power_alarm: row.功率报警,
    temperature_alarm: row.温度报警,
    energy_score: row.能耗评分,
    smoke_alarm_count: row.烟雾报警次数,
    co2_alarm_count: row.二氧化碳报警次数,
    abnormal_power_count: row.功率报警次数,
    temperature_alarm_count: row.温度报警次数,
    invalid_energy_minutes: row.无效用电分钟,
    openmv_online: row.OpenMV在线,
    person_detected: row.检测到人员,
    person: row.人员ID,
    face_code: row.人脸编号,
    face_name: row.人脸姓名,
    person_confidence: row.人体置信度,
    face_confidence: row.人脸置信度,
    openmv_raw: row.OpenMV原始数据
  }
}

async function insertAlarmRows(p: SensorPayload) {
  const rows = []
  if (p.烟雾报警) rows.push({ 设备ID: p.设备ID, 报警类型: '烟雾报警', 报警内容: '烟雾浓度超过阈值', 报警等级: 'danger', 传感器数值: p.烟雾值 })
  if (p.二氧化碳报警) rows.push({ 设备ID: p.设备ID, 报警类型: '二氧化碳过高', 报警内容: '二氧化碳浓度超过阈值', 报警等级: 'warning', 传感器数值: p.二氧化碳 })
  if (p.功率报警) rows.push({ 设备ID: p.设备ID, 报警类型: '功率过高', 报警内容: '实时功率超过阈值', 报警等级: 'danger', 传感器数值: p.功率 })
  if (p.温度报警) rows.push({ 设备ID: p.设备ID, 报警类型: '温度异常', 报警内容: '温度超过设定范围', 报警等级: 'warning', 传感器数值: p.温度 })
  if (rows.length) await db().from('报警数据').insert(rows)
}

async function insertAccessLog(p: SensorPayload) {
  if (!p.检测到人员) return

  const name = p.人脸姓名 === '-' ? '未知人员' : p.人脸姓名
  const since = new Date(Date.now() - 60 * 1000).toISOString()
  const { data: recent, error: recentError } = await db()
    .from('安防出入记录')
    .select('id')
    .eq('设备ID', p.设备ID)
    .eq('人脸姓名', name)
    .gte('创建时间', since)
    .limit(1)

  if (recentError) {
    console.error('[安防记录] 最近记录查询失败', recentError)
    return
  }
  if (recent && recent.length > 0) return

  const payload = {
    设备ID: p.设备ID,
    人员ID: p.人员ID,
    人脸编号: p.人脸编号,
    人脸姓名: name,
    进入状态: '进入寝室',
    人体置信度: p.人体置信度,
    人脸置信度: p.人脸置信度,
    OpenMV原始数据: p.OpenMV原始数据
  }
  const { error } = await db().from('安防出入记录').insert(payload)
  if (error) console.error('[安防记录] 写入失败', error)
}

function applyTimeRange(query: any, start: string | null, end: string | null) {
  let q = query
  if (start) q = q.gte('创建时间', new Date(start).toISOString())
  if (end) q = q.lte('创建时间', new Date(end).toISOString())
  return q
}

export async function GET() {
  try {
    const { data } = await db()
      .from('sensor_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    return NextResponse.json({
      success: true,
      data: data ?? []
    })
  } catch {
    return NextResponse.json({
      success: true,
      data: []
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request)
    const payload = normalize(body)
    const { data, error } = await db().from(TABLE_NAME).insert(payload).select('*').single()
    if (error) throw error
    await Promise.allSettled([insertAlarmRows(payload), insertAccessLog(payload)])
    return NextResponse.json({ success: true, data: data ? mapRow(data) : payload })
  } catch (error) {
    return apiError(error)
  }
}


