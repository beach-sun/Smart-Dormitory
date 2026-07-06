import Link from 'next/link'

const features = [
  { title: '环境监测', text: '温湿度、光照、烟雾、CO₂ 与人员识别状态集中展示。' },
  { title: '能耗统计', text: '电压、电流、功率、电量与能耗评分统一记录。' },
  { title: '安防识别', text: 'OpenMV 人形 / 人脸识别结果写入远程数据库。' },
  { title: '远程控制', text: '灯、风扇、插座由网页端下发，ESP32 轮询读取。' }
]

export default function LandingPage() {
  return (
    <main className="page-shell">
      <div className="container">
        <nav className="nav">
          <div className="brand">
            <span className="brand-mark">智</span>
            <div>
              <div>智寝云控</div>
              <div className="muted">Smart Dorm · Vercel · Supabase</div>
            </div>
          </div>
          <div className="actions">
            <Link className="btn btn-ghost" href="/register">注册</Link>
            <Link className="btn btn-dark" href="/login">登录控制台</Link>
          </div>
        </nav>

        <section className="hero">
          <div>
            <div className="kicker">智能宿舍安全监测与远程控制系统</div>
            <h1>点亮 AI，<span className="gradient-text">远程掌控</span></h1>
            <p className="muted" style={{ fontSize: 17, maxWidth: 720 }}>
              这版已重构为 Vercel 友好的无状态 API 架构，所有控制状态和传感器数据统一存储在 Supabase，
              页面加载失败会自动降级，不再因为接口慢或数据库错误导致白屏。
            </p>
            <div className="actions" style={{ marginTop: 24 }}>
              <Link href="/smart-dorm" className="btn btn-primary">进入系统</Link>
              <Link href="/api/health" className="btn btn-ghost">检查接口健康</Link>
            </div>
          </div>

          <div className="preview-card">
            <div className="preview-screen">
              <div className="brand" style={{ marginBottom: 18 }}>
                <span className="brand-mark">AI</span>
                <div>Live Console</div>
              </div>
              <div className="preview-grid">
                <div className="preview-metric"><span>温度</span><h2>-- ℃</h2></div>
                <div className="preview-metric"><span>CO₂</span><h2>-- ppm</h2></div>
                <div className="preview-metric"><span>功率</span><h2>-- W</h2></div>
                <div className="preview-metric"><span>能耗</span><h2>--</h2></div>
              </div>
            </div>
          </div>
        </section>

        <section className="metric-grid" style={{ marginTop: 20 }}>
          {features.map(item => (
            <article className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p className="muted">{item.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
