'use client'

import { useState } from 'react'
import DataTable from '../components/DataTable'
import SetupAlert from '../components/SetupAlert'
import { fetchJson } from '../hooks/useSensorData'
import type { SensorLog } from '../types/sensor'

function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function QueryPage() {
  const [start, setStart] = useState(toLocalInput(new Date(Date.now() - 24 * 60 * 60 * 1000)))
  const [end, setEnd] = useState(toLocalInput(new Date()))
  const [limit, setLimit] = useState(300)
  const [logs, setLogs] = useState<SensorLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function query() {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ start, end, limit: String(limit) })
      const data = await fetchJson<SensorLog[]>(`/api/sensor-data?${params.toString()}`)
      setLogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="section-title">
          <div>
            <h3>传感器数据查询</h3>
            <p>选择开始时间和结束时间，查询 Supabase 数据库中的历史传感器数据。</p>
          </div>
          <button className="btn btn-primary" onClick={query} disabled={loading}>{loading ? '查询中...' : '查询数据'}</button>
        </div>
        <div className="form-grid compact-grid">
          <label className="field"><span>开始时间</span><input className="input" type="datetime-local" value={start} onChange={e => setStart(e.target.value)} /></label>
          <label className="field"><span>结束时间</span><input className="input" type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} /></label>
          <label className="field"><span>最大条数</span><input className="input" type="number" min="1" max="1000" value={limit} onChange={e => setLimit(Number(e.target.value))} /></label>
        </div>
      </section>
      <SetupAlert error={error} />
      <DataTable logs={logs} title="查询结果" hint={`当前返回 ${logs.length} 条记录。`} />
    </div>
  )
}
