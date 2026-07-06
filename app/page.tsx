import Link from 'next/link'

const features = [
  { icon: '🌡️', title: '环境监测', text: '温湿度、光照、烟雾、CO₂ 与人员识别状态集中展示。' },
  { icon: '⚡', title: '能耗统计', text: '电压、电流、功率、电量与能耗评分实时追踪，并生成曲线图。' },
  { icon: '🛡️', title: 'AI 安防', text: 'OpenMV 识别人脸后，记录哪一位人员何时进入寝室。' },
  { icon: '🎛️', title: '设备控制', text: '照明灯、风扇 PWM、插座电源支持网页端统一控制。' }
]

export default function LandingPage() {
  return (
    <main className="page-shell">
      <div className="container">
        <nav className="landing-nav">
          <div className="brand">
            <span className="brand-mark">智</span>
            <div>
              <div>智寝云控</div>
              <div className="muted" style={{ fontSize: 12 }}>Smart Dorm · Supabase</div>
            </div>
          </div>
          <div className="actions" style={{ marginTop: 0 }}>
            <Link href="/register" className="btn btn-ghost">注册</Link>
            <Link href="/login" className="btn btn-dark">登录控制台</Link>
          </div>
        </nav>

        <section className="hero">
          <div>
            <div className="kicker">智能宿舍安全监测与自动控制系统</div>
            <h1 className="hero-title">点亮 AI，<span className="gradient-text">一屏掌控</span></h1>
            <p className="hero-copy">前端支持 PC 与手机端自适应，新增安防识别、能耗统计、时间段数据查询与用户注册。数据统一写入 Supabase，便于展示、查询和后续 AI 分析。</p>
            <div className="actions">
              <Link href="/login" className="btn btn-primary">进入系统 →</Link>
              <Link href="/api/health" className="btn btn-ghost">检查接口健康</Link>
            </div>
          </div>

          <div className="preview-card">
            <div className="preview-screen">
              <div className="preview-topbar">
                <div className="preview-dots"><span /><span /><span /></div>
                <strong>AI Live Console</strong>
              </div>
              <div className="preview-body">
                <div className="preview-grid">
                  <div className="preview-metric"><span>安防</span><strong>张三 08:30</strong></div>
                  <div className="preview-metric"><span>电压</span><strong>220V</strong></div>
                  <div className="preview-metric"><span>功率</span><strong>8.6W</strong></div>
                  <div className="preview-metric"><span>能耗</span><strong>96分</strong></div>
                </div>
                <div className="mini-chart"><span style={{ height: '34%' }} /><span style={{ height: '52%' }} /><span style={{ height: '48%' }} /><span style={{ height: '76%' }} /><span style={{ height: '62%' }} /><span style={{ height: '86%' }} /></div>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-grid">
          {features.map(item => (
            <article className="feature-card" key={item.title}>
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

export const dynamic = 'force-dynamic'