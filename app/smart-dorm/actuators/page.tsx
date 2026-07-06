'use client'

import ControlPanel from '../components/ControlPanel'
import SetupAlert from '../components/SetupAlert'
import StatusBadge from '../components/StatusBadge'
import { useSmartDorm } from '../hooks/useSensorData'

export default function ActuatorsPage() {
  const { latest, control, error, refresh } = useSmartDorm()

  return (
    <div className="page-stack">
      <SetupAlert error={error} />
      <section className="device-grid">
        <article className="device-card">
          <div className="icon">💡</div>
          <h3>照明灯</h3>
          <p className="muted">当前上报：{latest?.light_relay_state ? '开启' : '关闭'}</p>
          <StatusBadge active={control?.light} activeText="命令：开启" inactiveText="命令：关闭" />
        </article>
        <article className="device-card">
          <div className="icon">🌀</div>
          <h3>风扇</h3>
          <p className="muted">当前上报：{latest?.fan_state ? `${latest.fan_speed}%` : '关闭'}</p>
          <StatusBadge active={control?.fan} activeText={`命令：${control?.fan_speed ?? 0}%`} inactiveText="命令：关闭" />
        </article>
        <article className="device-card">
          <div className="icon">🔌</div>
          <h3>插座电源</h3>
          <p className="muted">当前上报：{latest?.socket_relay_state ? '接通' : '断开'}</p>
          <StatusBadge active={control?.socket} activeText="命令：接通" inactiveText="命令：断开" />
        </article>
      </section>
      <ControlPanel control={control} onChanged={refresh} />
    </div>
  )
}
