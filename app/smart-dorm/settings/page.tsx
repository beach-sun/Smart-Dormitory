'use client'

import ConfigForm from '../components/ConfigForm'
import SetupAlert from '../components/SetupAlert'
import { useSmartDorm } from '../hooks/useSensorData'

function fmt(v: string) {
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString('zh-CN')
}

export default function SettingsPage() {
  const { config, logs, error, refresh } = useSmartDorm()

  return (
    <div className="page-stack">
      <SetupAlert error={error} />
      <div className="responsive-row">
        <div className="page-stack">
          <ConfigForm config={config} onChanged={refresh} />
          <section className="panel ai-panel">
            <div className="ai-dot">AI</div>
            <div>
              <h3>AI 规则建议位</h3>
              <p>后续可以基于历史数据自动给出阈值建议，例如根据夜间能耗和 CO₂ 波动推荐节能阈值。当前页面仅保留模式与阈值配置，执行器控制已统一放到“执行器状态”页面。</p>
            </div>
          </section>
        </div>
        <section className="panel">
          <div className="section-title">
            <div>
              <h3>操作日志</h3>
              <p>模式切换、阈值修改和执行器控制都会记录。</p>
            </div>
          </div>
          <div className="log-list">
            {logs.length ? logs.map(item => (
              <article className="log-item" key={item.id}>
                <h4>{item.type}</h4>
                <p className="muted" style={{ margin: '6px 0' }}>{item.content}</p>
                <div className="log-meta">来源：{item.source} · {fmt(item.created_at)}</div>
              </article>
            )) : <div className="empty">暂无操作日志。</div>}
          </div>
        </section>
      </div>
    </div>
  )
}
