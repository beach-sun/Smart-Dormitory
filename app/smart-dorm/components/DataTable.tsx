import type { SensorLog } from '../types/sensor'
import StatusBadge from './StatusBadge'

function fmt(v: string) {
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString('zh-CN')
}

export default function DataTable({ logs, title = '历史上传数据', hint = '传感器记录按创建时间倒序展示。' }: { logs: SensorLog[]; title?: string; hint?: string }) {
  return (
    <section className="table-card">
      <div className="section-title" style={{ padding: '20px 22px 0' }}>
        <div>
          <h3>{title}</h3>
          <p>{hint}</p>
        </div>
      </div>
      {logs.length ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>时间</th>
                <th>温度</th>
                <th>湿度</th>
                <th>光照</th>
                <th>烟雾</th>
                <th>CO₂</th>
                <th>电压</th>
                <th>电流</th>
                <th>功率</th>
                <th>人员</th>
                <th>场景</th>
                <th>报警</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(item => {
                const hasAlarm = item.smoke_alarm || item.co2_alarm || item.abnormal_power_alarm || item.temperature_alarm
                return (
                  <tr key={item.id}>
                    <td>{fmt(item.created_at)}</td>
                    <td>{item.temperature} ℃</td>
                    <td>{item.humidity} %</td>
                    <td>{item.lux} lx</td>
                    <td>{item.mq2_value}</td>
                    <td>{item.co2} ppm</td>
                    <td>{item.voltage} V</td>
                    <td>{item.current_value} A</td>
                    <td>{item.power} W</td>
                    <td>{item.person_detected ? (item.face_name || '未知人员') : '-'}</td>
                    <td>{item.scene || '-'}</td>
                    <td><StatusBadge active={hasAlarm} activeText="有报警" inactiveText="正常" danger /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty">暂无传感器数据。</div>
      )}
    </section>
  )
}
