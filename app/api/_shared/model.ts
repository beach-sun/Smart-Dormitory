import type { ControlState, DormConfig } from '@/lib/types'
import { clamp, finite, safeString, toBool, toInt } from './db'
import { defaultConfig, defaultControl } from './defaults'

export function normalizeControl(body: Record<string, any>, old: Partial<ControlState> = {}): ControlState {
  const current = { ...defaultControl, ...old }
  const rawMode = safeString(body.mode ?? body.work_mode ?? current.mode, current.mode)
  const mode = rawMode === 'manual' || rawMode === '手动' ? 'manual' : 'auto'
  const fan = toBool(body.fan ?? body.fan_state ?? current.fan, current.fan)
  const fanSpeed = fan ? clamp(toInt(body.fan_speed ?? body.fanSpeed ?? current.fan_speed, current.fan_speed), 0, 100) : 0

  return {
    mode,
    light: toBool(body.light ?? body.light_relay_state ?? current.light, current.light),
    fan,
    fan_speed: fanSpeed,
    socket: toBool(body.socket ?? body.socket_relay_state ?? current.socket, current.socket),
    sleep_mode: toBool(body.sleep_mode ?? body.sleepMode ?? current.sleep_mode, current.sleep_mode),
    updated_at: new Date().toISOString()
  }
}

export function normalizeConfig(body: Record<string, any>, old: Partial<DormConfig> = {}): DormConfig {
  const current = { ...defaultConfig, ...old }
  const cfg: DormConfig = {
    mq2Threshold: Math.max(0, toInt(body.mq2Threshold ?? body.mq2_threshold ?? current.mq2Threshold, current.mq2Threshold)),
    co2Threshold: Math.max(400, toInt(body.co2Threshold ?? body.co2_threshold ?? current.co2Threshold, current.co2Threshold)),
    powerThreshold: Math.max(0, finite(body.powerThreshold ?? body.power_threshold ?? current.powerThreshold, current.powerThreshold)),
    minTemperature: finite(body.minTemperature ?? body.min_temperature ?? current.minTemperature, current.minTemperature),
    maxTemperature: finite(body.maxTemperature ?? body.max_temperature ?? current.maxTemperature, current.maxTemperature),
    fanOnTemperature: finite(body.fanOnTemperature ?? body.fan_on_temperature ?? current.fanOnTemperature, current.fanOnTemperature),
    fanOffTemperature: finite(body.fanOffTemperature ?? body.fan_off_temperature ?? current.fanOffTemperature, current.fanOffTemperature),
    lightThreshold: Math.max(0, finite(body.lightThreshold ?? body.light_threshold ?? current.lightThreshold, current.lightThreshold)),
    shortAwaySeconds: Math.max(1, toInt(body.shortAwaySeconds ?? body.short_away_seconds ?? current.shortAwaySeconds, current.shortAwaySeconds)),
    longAwaySeconds: Math.max(2, toInt(body.longAwaySeconds ?? body.long_away_seconds ?? current.longAwaySeconds, current.longAwaySeconds)),
    uploadIntervalMs: Math.max(1000, toInt(body.uploadIntervalMs ?? body.upload_interval_ms ?? current.uploadIntervalMs, current.uploadIntervalMs ?? 5000)),
    updated_at: new Date().toISOString()
  }

  if (cfg.maxTemperature <= cfg.minTemperature) cfg.maxTemperature = cfg.minTemperature + 1
  if (cfg.fanOffTemperature >= cfg.fanOnTemperature) cfg.fanOffTemperature = cfg.fanOnTemperature - 1
  if (cfg.longAwaySeconds <= cfg.shortAwaySeconds) cfg.longAwaySeconds = cfg.shortAwaySeconds + 1

  return cfg
}

export function normalizeSensor(body: Record<string, any>) {
  const personDetected = toBool(body.person_detected ?? body.personDetected ?? body.recognition_result ?? body.occupied, false)
  return {
    device_id: safeString(body.device_id ?? body.deviceId ?? body.device_id, 'smart-dorm-001'),
    temperature: finite(body.temperature ?? body.温度, 0),
    humidity: finite(body.humidity ?? body.湿度, 0),
    lux: finite(body.lux ?? body.light_lux ?? body.光照, 0),
    mq2_value: toInt(body.mq2_value ?? body.mq2 ?? body.烟雾值, 0),
    mq2_do: toBool(body.mq2_do ?? body.mq2DigitalValue ?? body.烟雾数字量, false),
    co2: toInt(body.co2 ?? body.co2_ppm ?? body.二氧化碳, 0),
    recognition_result: safeString(body.recognition_result ?? (personDetected ? 'person' : 'none'), personDetected ? 'person' : 'none'),
    scene: safeString(body.scene ?? body.scene_name, '-'),
    scene_cn: safeString(body.scene_cn ?? body.sceneCn ?? body.寝室状态, '-'),
    work_mode: safeString(body.work_mode ?? body.workMode ?? 'auto', 'auto'),
    work_mode_cn: safeString(body.work_mode_cn ?? body.workModeCn ?? body.工作模式, '自动'),
    voltage: finite(body.voltage ?? body.电压, 0),
    current_value: finite(body.current_value ?? body.current ?? body.电流, 0),
    power: finite(body.power ?? body.功率, 0),
    energy_kwh: finite(body.energy_kwh ?? body.energyKWh ?? body.电量, 0),
    light_relay_state: toBool(body.light_relay_state ?? body.light ?? body.照明灯, false),
    fan_state: toBool(body.fan_state ?? body.fan ?? body.风扇, false),
    fan_speed: clamp(toInt(body.fan_speed ?? body.fanSpeed ?? body.风扇速度, 0), 0, 100),
    socket_relay_state: toBool(body.socket_relay_state ?? body.socket ?? body.插座电源, false),
    smoke_alarm: toBool(body.smoke_alarm ?? body.烟雾报警, false),
    co2_alarm: toBool(body.co2_alarm ?? body.二氧化碳报警, false),
    abnormal_power_alarm: toBool(body.abnormal_power_alarm ?? body.功率报警, false),
    temperature_alarm: toBool(body.temperature_alarm ?? body.温度报警, false),
    energy_score: clamp(toInt(body.energy_score ?? body.能耗评分, 100), 0, 100),
    smoke_alarm_count: toInt(body.smoke_alarm_count ?? body.烟雾报警次数, 0),
    co2_alarm_count: toInt(body.co2_alarm_count ?? body.二氧化碳报警次数, 0),
    abnormal_power_count: toInt(body.abnormal_power_count ?? body.功率报警次数, 0),
    temperature_alarm_count: toInt(body.temperature_alarm_count ?? body.温度报警次数, 0),
    invalid_energy_minutes: toInt(body.invalid_energy_minutes ?? body.无效用电分钟, 0),
    openmv_online: toBool(body.openmv_online ?? body.openmvOnline ?? false, false),
    person_detected: personDetected,
    person: toInt(body.person ?? body.person_id ?? body.personId ?? 0, 0),
    face_code: toInt(body.face_code ?? body.faceCode ?? 0, 0),
    face_name: safeString(body.face_name ?? body.faceName ?? body.person_name ?? (personDetected ? 'UNKNOWN' : 'NONE'), personDetected ? 'UNKNOWN' : 'NONE'),
    person_confidence: toInt(body.person_confidence ?? body.personConfidence ?? 0, 0),
    face_confidence: toInt(body.face_confidence ?? body.faceConfidence ?? 0, 0),
    openmv_raw: safeString(body.openmv_raw ?? body.openmvRaw ?? '', '')
  }
}
