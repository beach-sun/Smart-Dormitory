'use client'

import Link from 'next/link'
import { Card } from './components/Card'
import ControlPanel from './components/ControlPanel'
import ConfigPanel from './components/ConfigPanel'
import StatusBadge from './components/StatusBadge'
import { useSmartDorm } from './hooks/useSmartDorm'

function boolLabel(value?: boolean) {
  return value ? '开启' : '关闭'
}

function fmt(v?: string) {
  if (!v) return '-'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString('zh-CN')
}

export default function DashboardHome() {
  const { latest, logs, control, config, alarms, error, loading, refresh } = useSmartDorm(10000)

  const active = Boolean(latest?.smoke_alarm || latest?.co2_alarm || latest?.abnormal_power_alarm || latest?.temperature_alarm)

  return (
    <main className="page-shell">
      <div className="container page-stack">
        <nav className="nav">
          <Link href="/" className="brand">
            <span className="brand-mark">智</span>
            <div>
              <div>智寝云控</div>
              <div className="muted">远程监测与执行器控制</div>
            </div>
          </Link>
          <div className="actions">
            <button className="btn btn-ghost" onClick={refresh}>刷新</button>
            <Link className="btn btn-ghost" href="/api/health">Health</Link>
          </div>
        </nav>

        <section className="hero">
          <div>
            <div className="kicker">欢迎使用智寝云控</div>
            <h1 style={{ fontSize: 46 }}>点亮 AI，让宿舍更安全、更节能。</h1>
            <p className="muted">最新上传时间：{fmt(latest?.created_at)}。页面已改为客户端容错加载，接口超时不会白屏。</p>
            <div className="actions" style={{ marginTop: 18 }}>
              <StatusBadge active={active} activeText="有报警" inactiveText="正常" danger />
              {loading ? <span className="badge warn">正在加载</span> : null}
              {error ? <span className="badge warn">{error}</span> : null}
            </div>
          </div>

          <div className="preview-card">
            <div className="section-title">
              <h3>当前状态</h3>
              <StatusBadge active={Boolean(latest?.person_detected)} activeText="有人" inactiveText="无人" warn />
            </div>
            <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <Card title="温度" value={latest?.temperature ?? '-'} unit="℃" />
              <Card title="CO₂" value={latest?.co2 ?? '-'} unit="ppm" />
              <Card title="功率" value={latest?.power ?? '-'} unit="W" />
              <Card title="识别" value={latest?.face_name || '-'} />
            </div>
          </div>
        </section>

        <section className="metric-grid">
          <Card title="湿度" value={latest?.humidity ?? '-'} unit="%" hint="AHT20" />
          <Card title="光照" value={latest?.lux ?? '-'} unit="lx" hint="BH1750" />
          <Card title="烟雾" value={latest?.mq2_value ?? '-'} hint="MQ2" />
          <Card title="能耗评分" value={latest?.energy_score ?? '-'} unit="分" hint="综合评分" />
        </section>

        <section className="device-grid">
          <article className="device-card">
            <h3>照明灯</h3>
            <p className="muted">当前上报：{boolLabel(latest?.light_relay_state)}</p>
            <StatusBadge active={control?.light} activeText="命令：开启" inactiveText="命令：关闭" />
          </article>
          <article className="device-card">
            <h3>风扇</h3>
            <p className="muted">当前上报：{latest?.fan_state ? `${latest?.fan_speed ?? 0}%` : '关闭'}</p>
            <StatusBadge active={control?.fan} activeText={`命令：${control?.fan_speed ?? 0}%`} inactiveText="命令：关闭" />
          </article>
          <article className="device-card">
            <h3>插座电源</h3>
            <p className="muted">当前上报：{boolLabel(latest?.socket_relay_state)}</p>
            <StatusBadge active={control?.socket} activeText="命令：接通" inactiveText="命令：断开" />
          </article>
        </section>

        <ControlPanel control={control} onChanged={refresh} />
        <ConfigPanel config={config} onChanged={refresh} />

        <section className="panel">
          <div className="section-title">
            <div>
              <h3>最近传感器数据</h3>
              <p>默认展示最近 50 条。</p>
            </div>
            <span className="badge">{logs.length} 条</span>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>时间</th><th>设备</th><th>温度</th><th>湿度</th><th>CO₂</th><th>功率</th><th>人员</th><th>报警</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((item, idx) => (
                  <tr key={item.id ?? idx}>
                    <td>{fmt(item.created_at)}</td>
                    <td>{item.device_id ?? '-'}</td>
                    <td>{item.temperature ?? '-'} ℃</td>
                    <td>{item.humidity ?? '-'} %</td>
                    <td>{item.co2 ?? '-'} ppm</td>
                    <td>{item.power ?? '-'} W</td>
                    <td>{item.face_name ?? '-'}</td>
                    <td>{item.smoke_alarm || item.co2_alarm || item.abnormal_power_alarm || item.temperature_alarm ? '有' : '无'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="section-title">
            <div>
              <h3>报警记录</h3>
              <p>烟雾、CO₂、功率、温度异常会自动写入。</p>
            </div>
            <span className="badge warn">{alarms.length} 条</span>
          </div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>时间</th><th>设备</th><th>类型</th><th>内容</th><th>等级</th><th>数值</th></tr></thead>
              <tbody>
                {alarms.map((item, idx) => (
                  <tr key={item.id ?? idx}>
                    <td>{fmt(item.created_at)}</td>
                    <td>{item.device_id ?? '-'}</td>
                    <td>{item.alarm_type ?? '-'}</td>
                    <td>{item.content ?? '-'}</td>
                    <td>{item.level ?? '-'}</td>
                    <td>{item.value ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
