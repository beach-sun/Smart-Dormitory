'use client'

import Link from 'next/link'
import { Card } from './components/Card'
import SetupAlert from './components/SetupAlert'
import StatusBadge from './components/StatusBadge'
import { useSmartDorm } from './hooks/useSensorData'

function boolLabel(value?: boolean) {
  return value ? '开启' : '关闭'
}

export default function DashboardHome() {
  const { latest, control, alarms, error, loading, refresh } = useSmartDorm()
  const active = Boolean(latest?.smoke_alarm || latest?.co2_alarm || latest?.abnormal_power_alarm || latest?.temperature_alarm)

  return (
    <div className="page-stack">
      <section className="dashboard-hero ai-hero">
        <div className="hero-row">
          <div>
            <div className="kicker" style={{ background: 'rgba(255,255,255,.12)', color: '#dbeafe', borderColor: 'rgba(255,255,255,.2)' }}>欢迎使用智寝云控</div>
            <h2>点亮 AI，让宿舍更安全、更节能。</h2>
            <p style={{ color: '#dbeafe', lineHeight: 1.8 }}>融合 ESP32-S3、OpenMV、HLW8032 与 Supabase 数据平台，完成环境监测、安防识别、能耗分析和执行器控制闭环。</p>
            <div className="actions">
              <Link href="/smart-dorm/security" className="btn btn-ghost">查看安防</Link>
              <Link href="/smart-dorm/energy" className="btn btn-ghost">能耗统计</Link>
              <button className="btn btn-ghost" onClick={refresh}>刷新</button>
            </div>
          </div>
          <div className="hero-panel">
            <div className="section-title" style={{ marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#cbd5e1' }}>当前状态</p>
              </div>
              <StatusBadge active={active} activeText="有报警" inactiveText="正常" danger />
            </div>
            <div className="metric-grid two">
              <div><strong style={{ fontSize: 30 }}>{latest?.temperature ?? '-'}</strong><span> ℃</span><p>温度</p></div>
              <div><strong style={{ fontSize: 30 }}>{latest?.co2 ?? '-'}</strong><span> ppm</span><p>CO₂</p></div>
              <div><strong style={{ fontSize: 30 }}>{latest?.power ?? '-'}</strong><span> W</span><p>功率</p></div>
              <div><strong style={{ fontSize: 30 }}>{latest?.face_name || (latest?.person_detected ? '未知人员' : '-')}</strong><p>安防识别</p></div>
            </div>
          </div>
        </div>
      </section>

      <SetupAlert error={error} />
      {loading ? <div className="panel">正在加载数据...</div> : null}

      <section className="metric-grid">
        <Card title="温度" value={latest?.temperature ?? '-'} unit="℃" hint="AHT20" icon="🌡️" />
        <Card title="二氧化碳" value={latest?.co2 ?? '-'} unit="ppm" hint="SCD41" icon="🌿" />
        <Card title="实时功率" value={latest?.power ?? '-'} unit="W" hint="HLW8032" icon="⚡" />
        <Card title="能耗评分" value={latest?.energy_score ?? '-'} unit="分" hint="安全与离寝综合" icon="◎" />
      </section>

      <section className="device-grid">
        <article className="device-card"><div className="icon">💡</div><h3>照明灯</h3><StatusBadge active={latest?.light_relay_state ?? control?.light} activeText={boolLabel(true)} inactiveText={boolLabel(false)} /></article>
        <article className="device-card"><div className="icon">🌀</div><h3>风扇</h3><StatusBadge active={latest?.fan_state ?? control?.fan} activeText={`运行 ${latest?.fan_speed ?? control?.fan_speed ?? 0}%`} inactiveText="关闭" /></article>
        <article className="device-card"><div className="icon">🔌</div><h3>插座电源</h3><StatusBadge active={latest?.socket_relay_state ?? control?.socket} activeText="接通" inactiveText="断开" /></article>
      </section>

      <section className="metric-grid">
        <Link className="feature-card" href="/smart-dorm/sensors"><div className="feature-icon">◌</div><h3>传感器数据</h3><p>查看实时环境与历史上传。</p></Link>
        <Link className="feature-card" href="/smart-dorm/query"><div className="feature-icon">⌕</div><h3>数据查询</h3><p>按时间段查询传感器明细。</p></Link>
        <Link className="feature-card" href="/smart-dorm/energy"><div className="feature-icon">⚡</div><h3>能耗统计</h3><p>查看电压、电流、功率曲线。</p></Link>
        <Link className="feature-card" href="/smart-dorm/security"><div className="feature-icon">🛡</div><h3>安防识别</h3><p>记录人员进入寝室的时间。</p></Link>
        <Link className="feature-card" href="/smart-dorm/actuators"><div className="feature-icon">◍</div><h3>执行器状态</h3><p>网页端下发灯、风扇、插座状态。</p></Link>
        <Link className="feature-card" href="/smart-dorm/alarms"><div className="feature-icon">!</div><h3>报警记录</h3><p>当前读取 {alarms.length} 条报警记录。</p></Link>
      </section>
    </div>
  )
}


export const dynamic = 'force-dynamic'