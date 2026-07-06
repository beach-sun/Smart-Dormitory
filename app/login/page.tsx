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
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ username, password })
      })
      const payload = await res.json().catch(() => ({ message: '登录失败' }))
      if (!res.ok || !payload.success) throw new Error(payload.message || '登录失败')
      router.replace(from)
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page page-shell">
      <div className="auth-card">
        <section className="auth-visual">
          <div className="kicker" style={{ background: 'rgba(255,255,255,.12)', color: '#dbeafe' }}>Smart Dorm Secure Console</div>
          <h1>智寝云控中心</h1>
          <p style={{ color: '#dbeafe', lineHeight: 1.8 }}>默认管理员账号来自环境变量。也可以注册数据库账号。</p>
        </section>
        <form className="auth-form" onSubmit={submit}>
          <div className="brand">
            <span className="brand-mark">智</span>
            <div>
              <div>登录系统</div>
              <div className="muted">默认账号：admin，默认密码：123456。上线后请在 Vercel 环境变量中修改。</div>
            </div>
          </div>
          <label className="field">
            <span>账号</span>
            <input className="input" value={username} onChange={e => setUsername(e.target.value)} />
          </label>
          <label className="field">
            <span>密码</span>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="请输入密码" />
          </label>
          {error ? <div className="error-box">{error}</div> : null}
          <button className="btn btn-primary" disabled={loading}>{loading ? '登录中...' : '进入控制台'}</button>
          <p className="muted" style={{ textAlign: 'center' }}>还没有账号？<Link href="/register">立即注册</Link></p>
        </form>
      </div>
    </main>
  )
}
