'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/smart-dorm', label: '控制台', icon: '⌘' },
  { href: '/smart-dorm/sensors', label: '传感器数据', icon: '◌' },
  { href: '/smart-dorm/query', label: '数据查询', icon: '⌕' },
  { href: '/smart-dorm/energy', label: '能耗统计', icon: '⚡' },
  { href: '/smart-dorm/security', label: '安防识别', icon: '🛡' },
  { href: '/smart-dorm/actuators', label: '执行器状态', icon: '◍' },
  { href: '/smart-dorm/settings', label: '模式与阈值', icon: '⚙' },
  { href: '/smart-dorm/alarms', label: '报警信息', icon: '!' }
]

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const title = nav.find(item => item.href === pathname)?.label ?? '智能宿舍监测与控制平台'

  return (
    <main className="app-layout">
      <aside className="sidebar">
        <div className="side-logo">
          <span className="brand-mark">智</span>
          <div>
            <h1>智寝云控</h1>
            <p>Smart Dorm Console</p>
          </div>
        </div>
        <nav className="nav-list">
          {nav.map(item => {
            const active = item.href === '/smart-dorm' ? pathname === item.href : pathname.startsWith(item.href)
            return <Link key={item.href} className={active ? 'nav-link active' : 'nav-link'} href={item.href}><span>{item.icon}</span>{item.label}</Link>
          })}
        </nav>
        <div className="ai-slogan-card">
          <div className="ai-dot">AI</div>
          <strong>点亮 AI</strong>
          <p>用识别、预测与节能分析，让宿舍主动感知风险。</p>
        </div>
        <div className="sidebar-footer">
          <div className="muted" style={{ color: '#94a3b8' }}>ESP32-S3 · Supabase · Next.js</div>
          <form action="/api/auth/logout" method="post">
            <button className="btn btn-ghost" style={{ width: '100%' }}>退出登录</button>
          </form>
        </div>
      </aside>
      <section className="main-area">
        <header className="topbar">
          <div>
            <div className="kicker">实时在线控制台</div>
            <h2 style={{ marginTop: 10 }}>{title}</h2>
          </div>
          <Link className="btn btn-soft" href="/api/health">接口健康检查</Link>
        </header>
        <div className="content">{children}</div>
      </section>
    </main>
  )
}
