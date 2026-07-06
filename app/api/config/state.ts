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

const g = globalThis as unknown as { smartDormConfig?: DormConfig }

export function getConfig(): DormConfig {
  if (!g.smartDormConfig) {
    g.smartDormConfig = {
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
      updated_at: new Date().toISOString()
    }
  }
  return g.smartDormConfig
}

function finite(value: unknown, fallback: number) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function updateConfig(body: Record<string, unknown>): DormConfig {
  const c = getConfig()
  const n: DormConfig = {
    ...c,
    mq2Threshold: Math.max(0, Math.round(finite(body.mq2Threshold ?? body.mq2_threshold, c.mq2Threshold))),
    co2Threshold: Math.max(400, Math.round(finite(body.co2Threshold ?? body.co2_threshold, c.co2Threshold))),
    powerThreshold: Math.max(0, finite(body.powerThreshold ?? body.power_threshold, c.powerThreshold)),
    minTemperature: finite(body.minTemperature ?? body.min_temperature, c.minTemperature),
    maxTemperature: finite(body.maxTemperature ?? body.max_temperature, c.maxTemperature),
    fanOnTemperature: finite(body.fanOnTemperature ?? body.fan_on_temperature, c.fanOnTemperature),
    fanOffTemperature: finite(body.fanOffTemperature ?? body.fan_off_temperature, c.fanOffTemperature),
    lightThreshold: Math.max(0, finite(body.lightThreshold ?? body.light_threshold, c.lightThreshold)),
    shortAwaySeconds: Math.max(1, Math.round(finite(body.shortAwaySeconds ?? body.short_away_seconds, c.shortAwaySeconds))),
    longAwaySeconds: Math.max(2, Math.round(finite(body.longAwaySeconds ?? body.long_away_seconds, c.longAwaySeconds))),
    updated_at: new Date().toISOString()
  }

  if (n.maxTemperature <= n.minTemperature) n.maxTemperature = n.minTemperature + 1
  if (n.fanOffTemperature >= n.fanOnTemperature) n.fanOffTemperature = n.fanOnTemperature - 1
  if (n.longAwaySeconds <= n.shortAwaySeconds) n.longAwaySeconds = n.shortAwaySeconds + 1

  g.smartDormConfig = n
  return n
}
