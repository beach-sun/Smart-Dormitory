'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AlarmLog, ControlState, DormConfig, OperationLog, SensorLog } from '../types/sensor'

type ApiResult<T> = { success: boolean; data: T; message?: string }

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  const payload = await res.json().catch(() => ({ success: false, message: `${url} 返回非 JSON` })) as ApiResult<T>
  if (!res.ok || !payload.success) throw new Error(payload.message || `${url} HTTP ${res.status}`)
  return payload.data
}

export function useSmartDorm(intervalMs = 5000) {
  const [sensors, setSensors] = useState<SensorLog[]>([])
  const [alarms, setAlarms] = useState<AlarmLog[]>([])
  const [logs, setLogs] = useState<OperationLog[]>([])
  const [control, setControl] = useState<ControlState | null>(null)
  const [config, setConfig] = useState<DormConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    const results = await Promise.allSettled([
      fetchJson<SensorLog[]>('/api/sensor-data?limit=80'),
      fetchJson<AlarmLog[]>('/api/alarms'),
      fetchJson<OperationLog[]>('/api/logs'),
      fetchJson<ControlState>('/api/device-control'),
      fetchJson<DormConfig>('/api/config')
    ])

    const errs = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    if (results[0].status === 'fulfilled') setSensors(results[0].value)
    if (results[1].status === 'fulfilled') setAlarms(results[1].value)
    if (results[2].status === 'fulfilled') setLogs(results[2].value)
    if (results[3].status === 'fulfilled') setControl(results[3].value)
    if (results[4].status === 'fulfilled') setConfig(results[4].value)
    setError(errs.map(e => e.reason instanceof Error ? e.reason.message : String(e.reason)).join('；'))
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const timer = window.setInterval(refresh, intervalMs)
    return () => window.clearInterval(timer)
  }, [refresh, intervalMs])

  return {
    sensors,
    latest: sensors[0],
    alarms,
    logs,
    control,
    config,
    loading,
    error,
    refresh
  }
}
