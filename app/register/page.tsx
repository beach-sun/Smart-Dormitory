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
      <div className="auth-card compact">
        <section className="auth-visual">
          <div className="kicker" style={{ background: 'rgba(255,255,255,.12)', color: '#dbeafe', borderColor: 'rgba(255,255,255,.2)' }}>Register Smart Dorm Account</div>
          <h1>注册智寝云控账号</h1>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>注册信息将写入 Supabase 的“用户注册”表，登录时会校验数据库中的账号密码。</p>
        </section>

        <form className="auth-form" onSubmit={submit}>
          <div className="brand">
            <span className="brand-mark">AI</span>
            <div>
              <div>点亮 AI 账号</div>
              <div className="muted" style={{ fontSize: 13 }}>建议使用字母、数字、下划线组合。</div>
            </div>
          </div>
          <div className="form-grid one-on-mobile">
            <label className="field"><span>账号</span><input className="input" value={form.username} onChange={e => setField('username', e.target.value)} placeholder="3-24 位" /></label>
            <label className="field"><span>昵称</span><input className="input" value={form.nickname} onChange={e => setField('nickname', e.target.value)} placeholder="显示名称" /></label>
            <label className="field"><span>密码</span><input className="input" type="password" value={form.password} onChange={e => setField('password', e.target.value)} placeholder="至少 6 位" /></label>
            <label className="field"><span>确认密码</span><input className="input" type="password" value={form.confirm} onChange={e => setField('confirm', e.target.value)} /></label>
            <label className="field"><span>手机</span><input className="input" value={form.phone} onChange={e => setField('phone', e.target.value)} /></label>
            <label className="field"><span>邮箱</span><input className="input" type="email" value={form.email} onChange={e => setField('email', e.target.value)} /></label>
          </div>
          {message ? <div className={message.includes('成功') ? 'setup-alert' : 'error-box'}>{message}</div> : null}
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 22 }} disabled={loading}>{loading ? '注册中...' : '注册账号'}</button>
          <p className="muted" style={{ textAlign: 'center', marginTop: 18 }}>已有账号？<Link className="text-link" href="/login">返回登录</Link></p>
        </form>
      </div>
    </main>
  )
}
