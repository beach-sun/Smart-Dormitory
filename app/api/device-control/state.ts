import { clamp, toBoolean, toInt, toSafeString } from '../_shared/format'

export type ControlState = {
  light: boolean
  fan: boolean
  socket: boolean
}

const g = globalThis as unknown as { smartDormControlState?: ControlState }

export function getControlState(): ControlState {
  if (!g.smartDormControlState) {
    g.smartDormControlState = {
      mode: 'auto',
      light: false,
      fan: false,
      fan_speed: 0,
      socket: false,
      sleep_mode: false,
      updated_at: new Date().toISOString()
    }
  }
  return g.smartDormControlState
}

export function updateControlState(body: Record<string, unknown>): ControlState {
  const current = getControlState()
  const rawMode = toSafeString(body.mode ?? body.work_mode ?? current.mode, current.mode)
  const mode: ControlState['mode'] = rawMode === 'manual' || rawMode === '手动' ? 'manual' : 'auto'
  const fan = toBoolean(body.fan ?? body.fan_state, current.fan)
  const fanSpeed = fan ? clamp(toInt(body.fan_speed ?? body.fanSpeed, current.fan_speed), 0, 100) : 0

  const next: ControlState = {
    mode,
    light: toBoolean(body.light ?? body.light_relay_state, current.light),
    fan,
    fan_speed: fanSpeed,
    socket: toBoolean(body.socket ?? body.socket_relay_state, current.socket),
    sleep_mode: toBoolean(body.sleep_mode ?? body.sleepMode, current.sleep_mode),
    updated_at: new Date().toISOString()
  }

  g.smartDormControlState = next
  return next
}
