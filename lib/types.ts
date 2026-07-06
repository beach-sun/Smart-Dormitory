export type ControlState = {
  id?: number
  mode: 'auto' | 'manual'
  light: boolean
  fan: boolean
  fan_speed: number
  socket: boolean
  sleep_mode: boolean
  updated_at?: string
}

export type DormConfig = {
  id?: number
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
  uploadIntervalMs?: number
  updated_at?: string
}

export type SensorLog = {
  id?: number
  created_at?: string
  device_id?: string
  temperature?: number
  humidity?: number
  lux?: number
  mq2_value?: number
  mq2_do?: boolean
  co2?: number
  recognition_result?: string
  scene?: string
  scene_cn?: string
  work_mode?: string
  work_mode_cn?: string
  voltage?: number
  current_value?: number
  power?: number
  energy_kwh?: number
  light_relay_state?: boolean
  fan_state?: boolean
  fan_speed?: number
  socket_relay_state?: boolean
  smoke_alarm?: boolean
  co2_alarm?: boolean
  abnormal_power_alarm?: boolean
  temperature_alarm?: boolean
  energy_score?: number
  openmv_online?: boolean
  person_detected?: boolean
  person?: number
  face_code?: number
  face_name?: string
  person_confidence?: number
  face_confidence?: number
  openmv_raw?: string
}

export type AlarmLog = {
  id?: number
  created_at?: string
  device_id?: string
  alarm_type?: string
  content?: string
  level?: 'info' | 'warning' | 'danger' | string
  value?: number
  threshold?: number
  acknowledged?: boolean
}
