'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [from, setFrom] = useState('/smart-dorm')
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const url = new URL(window.location.href)
    setFrom(url.searchParams.get('from') || '/smart-dorm')
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      router.replace(from)
    } else {
      const payload = await res.json().catch(() => ({ message: '登录失败' }))
      setError(payload.message || '登录失败')
    }
    setLoading(false)
  }

  return (
    <main className="auth-page page-shell">
      <div className="auth-card">
        <section className="auth-visual">
          <div className="kicker" style={{ background: 'rgba(255,255,255,.12)', color: '#dbeafe', borderColor: 'rgba(255,255,255,.2)' }}>Smart Dorm Secure Console</div>
          <h1>智寝云控中心</h1>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>统一查看环境、用电、报警、安防出入与执行器状态。点亮 AI，让宿舍更懂安全与节能。</p>
          <div className="preview-grid" style={{ marginTop: 32 }}>
            <div className="preview-metric"><span>AI 安防</span><strong>识别</strong></div>
            <div className="preview-metric"><span>能耗曲线</span><strong>分析</strong></div>
          </div>
        </section>

        <form className="auth-form" onSubmit={submit}>
          <div className="brand">
            <span className="brand-mark">智</span>
            <div>
              <div>登录系统</div>
              <div className="muted" style={{ fontSize: 13 }}>支持默认管理员账号，也支持数据库注册账号。</div>
            </div>
          </div>

          <label className="field">
            <span>账号</span>
            <input className="input" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
          </label>

          <label className="field">
            <span>密码</span>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" placeholder="请输入密码" />
          </label>

          {error ? <div className="error-box">{error}</div> : null}

          <button className="btn btn-primary" style={{ width: '100%', marginTop: 22 }} disabled={loading}>
            {loading ? '登录中...' : '进入控制台'}
          </button>
          <p className="muted" style={{ textAlign: 'center', marginTop: 18 }}>还没有账号？<Link className="text-link" href="/register">立即注册</Link></p>
        </form>
      </div>
    </main>
  )
}
