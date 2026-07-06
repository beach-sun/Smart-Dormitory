'use client'

import SetupAlert from '../components/SetupAlert'
import StatusBadge from '../components/StatusBadge'
import { useSmartDorm } from '../hooks/useSensorData'

function fmt(v: string) {
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString('zh-CN')
}

export default function AlarmsPage() {
  const { alarms, error, refresh } = useSmartDorm()
  const dangerCount = alarms.filter(item => item.level === 'danger').length

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="section-title">
          <div>
            <h3>报警信息</h3>
            <p>烟雾、CO₂、功率、温度异常会自动写入报警表。</p>
          </div>
          <button className="btn btn-primary" onClick={refresh}>刷新报警</button>
        </div>
        <div className="metric-grid two">
          <div className="metric-card"><div className="metric-head"><span>报警总数</span><span>!</span></div><div className="metric-value"><strong>{alarms.length}</strong><span className="metric-unit">条</span></div></div>
          <div className="metric-card"><div className="metric-head"><span>严重报警</span><span>⚠</span></div><div className="metric-value"><strong>{dangerCount}</strong><span className="metric-unit">条</span></div></div>
        </div>
      </section>
      <SetupAlert error={error} />
      <section className="panel">
        <div className="section-title">
          <div><h3>报警列表</h3><p>按时间倒序展示最近报警。</p></div>
        </div>
        <div className="alarm-list">
          {alarms.length ? alarms.map(item => (
            <article className={item.level === 'danger' ? 'alarm-card danger' : 'alarm-card'} key={item.id}>
              <div>
                <h3 style={{ margin: 0 }}>{item.alarm_type}</h3>
                <p className="muted" style={{ margin: '6px 0' }}>{item.content}</p>
                <div className="log-meta">设备：{item.device_id} · 数值：{item.value ?? '-'} · {fmt(item.created_at)}</div>
              </div>
              <StatusBadge active={item.level === 'danger'} activeText="严重" inactiveText="预警" danger={item.level === 'danger'} warn={item.level !== 'danger'} />
            </article>
          )) : <div className="empty">暂无报警记录。</div>}
        </div>
      </section>
    </div>
  )
}
