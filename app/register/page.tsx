'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '', confirm: '', nickname: '', phone: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  function setField(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    if (form.password !== form.confirm) {
      setMessage('两次输入的密码不一致。')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify(form)
      })
      const payload = await res.json().catch(() => ({ success: false, message: '注册失败' }))
      if (!res.ok || !payload.success) throw new Error(payload.message || '注册失败')
      setMessage('注册成功，即将跳转登录。')
      window.setTimeout(() => router.replace('/login'), 800)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page page-shell">
      <div className="auth-card">
        <section className="auth-visual">
          <div className="kicker" style={{ background: 'rgba(255,255,255,.12)', color: '#dbeafe' }}>Register</div>
          <h1>注册智寝云控账号</h1>
          <p style={{ color: '#dbeafe', lineHeight: 1.8 }}>账号信息会写入 Supabase 的 app_users 表。</p>
        </section>
        <form className="auth-form" onSubmit={submit}>
          <div className="form-grid">
            <label className="field"><span>账号</span><input className="input" value={form.username} onChange={e => setField('username', e.target.value)} /></label>
            <label className="field"><span>昵称</span><input className="input" value={form.nickname} onChange={e => setField('nickname', e.target.value)} /></label>
            <label className="field"><span>密码</span><input className="input" type="password" value={form.password} onChange={e => setField('password', e.target.value)} /></label>
            <label className="field"><span>确认密码</span><input className="input" type="password" value={form.confirm} onChange={e => setField('confirm', e.target.value)} /></label>
            <label className="field"><span>手机</span><input className="input" value={form.phone} onChange={e => setField('phone', e.target.value)} /></label>
            <label className="field"><span>邮箱</span><input className="input" type="email" value={form.email} onChange={e => setField('email', e.target.value)} /></label>
          </div>
          {message ? <div className={message.includes('成功') ? 'setup-alert' : 'error-box'}>{message}</div> : null}
          <button className="btn btn-primary" disabled={loading}>{loading ? '注册中...' : '注册账号'}</button>
          <p className="muted" style={{ textAlign: 'center' }}>已有账号？<Link href="/login">返回登录</Link></p>
        </form>
      </div>
    </main>
  )
}
