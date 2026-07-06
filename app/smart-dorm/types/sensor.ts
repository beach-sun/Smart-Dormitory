export type SensorLog = {
  id: string
  created_at: string
  device_id: string
  temperature: number
  humidity: number
  lux: number
  mq2_value: number
  mq2_do: boolean
  co2: number
  recognition_result: boolean
  scene: string
  work_mode: string
  voltage: number
  current_value: number
  power: number
  energy_kwh: number
  light_relay_state: boolean
  fan_state: boolean
  fan_speed: number
  socket_relay_state: boolean
  smoke_alarm: boolean
  co2_alarm: boolean
  abnormal_power_alarm: boolean
  temperature_alarm: boolean
  energy_score: number
  smoke_alarm_count: number
  co2_alarm_count: number
  abnormal_power_count: number
  temperature_alarm_count: number
  invalid_energy_minutes: number
  openmv_online: boolean
  person_detected: boolean
  person: number
  face_code: number
  face_name: string
  person_confidence: number
  face_confidence: number
  openmv_raw: string
}

export type AccessLog = {
  id: string
  created_at: string
  device_id: string
  person_id: number
  face_code: number
  face_name: string
  action: string
  person_confidence: number
  face_confidence: number
  raw: string
}

export type ControlState = {
  mode: 'auto' | 'manual'
  light: boolean
  fan: boolean
  fan_speed: number
  socket: boolean
  sleep_mode: boolean
  updated_at: string
}

export type DormConfig = {
  mq2Threshold: number
  co2Threshold: number
  powerThreshold: number
  minTemperature: number
  maxTemperature: number
  fanOnTemperature: number
  fanOffTemperature: number
  lightThreshold: number
  shortAwaySeconds: number
  longAwaySeconds: number
  updated_at: string
}

export type AlarmLog = {
  id: string
  created_at: string
  device_id: string
  alarm_type: string
  content: string
  level: string
  value: number
  threshold: number
  acknowledged: boolean
}

export type OperationLog = {
  id: string
  created_at: string
  source: string
  type: string
  content: string
  old_value?: unknown
  new_value?: unknown
}
