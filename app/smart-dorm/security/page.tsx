'use client'

import { useEffect, useState } from 'react'
import SetupAlert from '../components/SetupAlert'
import StatusBadge from '../components/StatusBadge'
import { fetchJson } from '../hooks/useSensorData'
import type { AccessLog } from '../types/sensor'

function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fmt(v: string) {
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString('zh-CN')
}

export default function SecurityPage() {
  const [start, setStart] = useState(toLocalInput(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))
  const [end, setEnd] = useState(toLocalInput(new Date()))
  const [name, setName] = useState('')
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function query() {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ limit: '300', start, end })
      if (name.trim()) params.set('name', name.trim())
      const data = await fetchJson<AccessLog[]>(`/api/access-logs?${params.toString()}`)
      setLogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { query() }, [])

  return (
    <div className="page-stack">
      <section className="panel security-hero">
        <div className="section-title">
          <div>
            <div className="kicker">AI 安防识别</div>
            <h3 style={{ marginTop: 14 }}>记录哪一位人员在什么时候进入寝室</h3>
            <p>设备端 OpenMV 上传人脸编号、人脸姓名和置信度后，系统自动写入安防出入记录，可按时间段和姓名查询。</p>
          </div>
          <StatusBadge active={logs.length > 0} activeText={`${logs.length} 条记录`} inactiveText="暂无记录" />
        </div>
        <div className="form-grid compact-grid">
          <label className="field"><span>开始时间</span><input className="input" type="datetime-local" value={start} onChange={e => setStart(e.target.value)} /></label>
          <label className="field"><span>结束时间</span><input className="input" type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} /></label>
          <label className="field"><span>姓名关键词</span><input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="例如 张三 / 未知人员" /></label>
          <div className="field action-field"><span>&nbsp;</span><button className="btn btn-primary" type="button" disabled={loading} onClick={query}>{loading ? '查询中...' : '查询安防记录'}</button></div>
        </div>
      </section>
      <SetupAlert error={error} />
      <section className="table-card">
        <div className="section-title" style={{ padding: '20px 22px 0' }}>
          <div>
            <h3>进入寝室记录</h3>
            <p>按创建时间倒序展示，每条记录包含人员姓名、进入时间、识别置信度和原始识别数据。</p>
          </div>
        </div>
        {logs.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>进入时间</th>
                  <th>人员姓名</th>
                  <th>人员ID</th>
                  <th>人脸编号</th>
                  <th>状态</th>
                  <th>人体置信度</th>
                  <th>人脸置信度</th>
                  <th>设备</th>
                  <th>原始数据</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(item => (
                  <tr key={item.id}>
                    <td>{fmt(item.created_at)}</td>
                    <td>{item.face_name || '未知人员'}</td>
                    <td>{item.person_id}</td>
                    <td>{item.face_code}</td>
                    <td><StatusBadge active activeText={item.action || '进入寝室'} inactiveText="-" /></td>
                    <td>{Number(item.person_confidence || 0).toFixed(2)}</td>
                    <td>{Number(item.face_confidence || 0).toFixed(2)}</td>
                    <td>{item.device_id}</td>
                    <td title={item.raw || ''}>{item.raw || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="empty">当前条件下暂无安防记录。</div>}
      </section>
    </div>
  )
}
