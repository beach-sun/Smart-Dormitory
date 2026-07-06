import type { ControlState, DormConfig } from '@/lib/types'

export const defaultControl: ControlState = {
  mode: 'auto',
  light: false,
  fan: false,
  fan_speed: 0,
  socket: false,
  sleep_mode: false
}

export const defaultConfig: DormConfig = {
  mq2Threshold: 1800,
  co2Threshold: 1200,
  powerThreshold: 10,
  minTemperature: 0,
  maxTemperature: 40,
  fanOnTemperature: 30,
  fanOffTemperature: 28,
  lightThreshold: 20,
  shortAwaySeconds: 30,
  longAwaySeconds: 1800,
  uploadIntervalMs: 5000
}
