'use client'

import { useMemo, useState } from 'react'
import { Card } from '../components/Card'
import SetupAlert from '../components/SetupAlert'
import { fetchJson } from '../hooks/useSensorData'
import type { SensorLog } from '../types/sensor'

function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fmtTime(v: string) {
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function avg(values: number[]) {
  if (!values.length) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

function LineChart({ title, unit, data, field }: { title: string; unit: string; data: SensorLog[]; field: 'voltage' | 'current_value' | 'power' }) {
  const points = useMemo(() => [...data].reverse().slice(-80), [data])
  const values = points.map(item => Number(item[field] ?? 0)).filter(Number.isFinite)
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 1
  const range = max - min || 1
  const path = points.map((item, index) => {
    const x = points.length === 1 ? 0 : (index / (points.length - 1)) * 100
    const y = 90 - ((Number(item[field] ?? 0) - min) / range) * 80
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')

  return (
    <section className="panel chart-panel">
      <div className="section-title">
        <div>
          <h3>{title}</h3>
          <p>最大 {max.toFixed(2)}{unit} · 最小 {min.toFixed(2)}{unit} · 平均 {avg(values).toFixed(2)}{unit}</p>
        </div>
      </div>
      <svg className="line-chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`${title}曲线图`}>
        <path d="M 0 90 H 100" className="chart-axis" />
        <path d="M 0 50 H 100" className="chart-grid-line" />
        <path d="M 0 10 H 100" className="chart-grid-line" />
        {path ? <path d={path} className="chart-line" /> : null}
      </svg>
      <div className="chart-labels">
        <span>{points[0] ? fmtTime(points[0].created_at) : '-'}</span>
        <span>{points[points.length - 1] ? fmtTime(points[points.length - 1].created_at) : '-'}</span>
      </div>
    </section>
  )
}

export default function EnergyPage() {
  const now = new Date()
  const before = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const [start, setStart] = useState(toLocalInput(before))
  const [end, setEnd] = useState(toLocalInput(now))
  const [logs, setLogs] = useState<SensorLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function query() {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ limit: '500', start, end })
      const data = await fetchJson<SensorLog[]>(`/api/sensor-data?${params.toString()}`)
      setLogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const latest = logs[0]
  const totalEnergy = logs.length ? Math.max(...logs.map(x => Number(x.energy_kwh || 0))) - Math.min(...logs.map(x => Number(x.energy_kwh || 0))) : 0

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="section-title">
          <div>
            <h3>能耗统计</h3>
            <p>按时间段查询 HLW8032 上传的电压、电流、功率数据，并生成曲线图。</p>
          </div>
          <button className="btn btn-primary" onClick={query} disabled={loading}>{loading ? '查询中...' : '查询能耗'}</button>
        </div>
        <div className="form-grid compact-grid">
          <label className="field"><span>开始时间</span><input className="input" type="datetime-local" value={start} onChange={e => setStart(e.target.value)} /></label>
          <label className="field"><span>结束时间</span><input className="input" type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} /></label>
        </div>
      </section>
      <SetupAlert error={error} />
      <section className="metric-grid">
        <Card title="最新电压" value={latest?.voltage ?? '-'} unit="V" hint="Voltage" icon="🔋" />
        <Card title="最新电流" value={latest?.current_value ?? '-'} unit="A" hint="Current" icon="〰" />
        <Card title="最新功率" value={latest?.power ?? '-'} unit="W" hint="Power" icon="⚡" />
        <Card title="区间电量差" value={logs.length ? totalEnergy.toFixed(4) : '-'} unit="kWh" hint="Energy" icon="◎" />
      </section>
      {logs.length ? (
        <>
          <LineChart title="电压曲线" unit="V" data={logs} field="voltage" />
          <LineChart title="电流曲线" unit="A" data={logs} field="current_value" />
          <LineChart title="功率曲线" unit="W" data={logs} field="power" />
        </>
      ) : <div className="empty panel">请选择时间范围并点击查询。</div>}
    </div>
  )
}
