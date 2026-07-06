'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { AlarmLog, ControlState, DormConfig, SensorLog } from '@/lib/types'

type State = {
  latest: SensorLog | null
  logs: SensorLog[]
  control: ControlState | null
  config: DormConfig | null
  alarms: AlarmLog[]
  loading: boolean
  error: string
}

const initialState: State = {
  latest: null,
  logs: [],
  control: null,
  config: null,
  alarms: [],
  loading: true,
  error: ''
}

async function fetchJson(path: string, timeoutMs = 4500) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(path, {
      cache: 'no-store',
      signal: controller.signal
    })
    return await res.json().catch(() => ({ success: false, data: null, message: 'JSON解析失败' }))
  } finally {
    clearTimeout(timer)
  }
}

export function useSmartDorm(autoRefreshMs = 0) {
  const [state, setState] = useState<State>(initialState)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      const [sensor, control, config, alarms] = await Promise.allSettled([
        fetchJson('/api/sensor-data?limit=50'),
        fetchJson('/api/device-control'),
        fetchJson('/api/config'),
        fetchJson('/api/alarms?limit=50')
      ])

      const sensorPayload = sensor.status === 'fulfilled' ? sensor.value : null
      const controlPayload = control.status === 'fulfilled' ? control.value : null
      const configPayload = config.status === 'fulfilled' ? config.value : null
      const alarmsPayload = alarms.status === 'fulfilled' ? alarms.value : null

      const logs = Array.isArray(sensorPayload?.data) ? sensorPayload.data : []

      if (!mounted.current) return
      setState({
        latest: logs[0] ?? null,
        logs,
        control: controlPayload?.data ?? null,
        config: configPayload?.data ?? null,
        alarms: Array.isArray(alarmsPayload?.data) ? alarmsPayload.data : [],
        loading: false,
        error: [
          sensor.status === 'rejected' ? '传感器接口超时' : '',
          control.status === 'rejected' ? '控制接口超时' : '',
          alarms.status === 'rejected' ? '报警接口超时' : ''
        ].filter(Boolean).join('；')
      })
    } catch (error) {
      if (!mounted.current) return
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '数据加载失败'
      }))
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    refresh()
    if (!autoRefreshMs) return () => { mounted.current = false }
    const timer = window.setInterval(refresh, autoRefreshMs)
    return () => {
      mounted.current = false
      window.clearInterval(timer)
    }
  }, [refresh, autoRefreshMs])

  return { ...state, refresh }
}
