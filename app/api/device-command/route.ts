import { apiOk, db, deviceTokenValid, apiFail } from '../_shared/db'
import { defaultConfig, defaultControl } from '../_shared/defaults'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    if (!deviceTokenValid(request)) return apiFail('Invalid device token', 401)

    const [controlRes, configRes] = await Promise.all([
      db().from('device_control').select('*').eq('id', 1).maybeSingle(),
      db().from('config').select('*').eq('id', 1).maybeSingle()
    ])

    const control = controlRes.data ?? { id: 1, ...defaultControl }
    const config = configRes.data ?? { id: 1, ...defaultConfig }

    return apiOk({
      control: {
        mode: control.mode ?? 'auto',
        light: Boolean(control.light),
        fan: Boolean(control.fan),
        fan_speed: Number(control.fan_speed ?? 0),
        socket: Boolean(control.socket),
        sleep_mode: Boolean(control.sleep_mode)
      },
      config: {
        mq2Threshold: Number(config.mq2Threshold ?? defaultConfig.mq2Threshold),
        co2Threshold: Number(config.co2Threshold ?? defaultConfig.co2Threshold),
        powerThreshold: Number(config.powerThreshold ?? defaultConfig.powerThreshold),
        minTemperature: Number(config.minTemperature ?? defaultConfig.minTemperature),
        maxTemperature: Number(config.maxTemperature ?? defaultConfig.maxTemperature),
        fanOnTemperature: Number(config.fanOnTemperature ?? defaultConfig.fanOnTemperature),
        fanOffTemperature: Number(config.fanOffTemperature ?? defaultConfig.fanOffTemperature),
        lightThreshold: Number(config.lightThreshold ?? defaultConfig.lightThreshold),
        shortAwaySeconds: Number(config.shortAwaySeconds ?? defaultConfig.shortAwaySeconds),
        longAwaySeconds: Number(config.longAwaySeconds ?? defaultConfig.longAwaySeconds)
      }
    })
  } catch {
    return apiOk({
      control: defaultControl,
      config: defaultConfig
    })
  }
}
