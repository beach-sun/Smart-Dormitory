'use client'

import { useEffect, useState } from 'react'
import type { ControlState } from '@/lib/types'
import StatusBadge from './StatusBadge'

const fallback: ControlState = {
  mode: 'auto',
  light: false,
  fan: false,
  fan_speed: 0,
  socket: false,
  sleep_mode: false
}

export default function ControlPanel({ control, onChanged }: { control: ControlState | null; onChanged?: () => void }) {
  const [draft, setDraft] = useState<ControlState>(control ?? fallback)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (control) setDraft({ ...fallback, ...control })
  }, [control])

  function setBool(key: 'light' | 'fan' | 'socket' | 'sleep_mode') {
    setDraft(prev => {
      const next = { ...prev, [key]: !prev[key] }
      if (key === 'fan' && !next.fan) next.fan_speed = 0
      if (key === 'fan' && next.fan && next.fan_speed === 0) next.fan_speed = 60
      return next
    })
  }

  async function submit() {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/device-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify(draft)
      })
      const payload = await res.json().catch(() => ({ success: false, message: '保存失败' }))
      if (!res.ok || !payload.success) throw new Error(payload.message || '保存失败')
      setMessage('控制命令已保存，ESP32 下次轮询时会读取。')
      onChanged?.()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <h3>执行器控制</h3>
          <p>网页端写入 Supabase，ESP32 通过 /api/device-command 远程读取。</p>
        </div>
        <StatusBadge active={draft.mode === 'manual'} activeText="手动模式" inactiveText="自动模式" warn />
      </div>

      <label className="field">
        <span>运行模式</span>
        <select className="select" value={draft.mode} onChange={e => setDraft(prev => ({ ...prev, mode: e.target.value as ControlState['mode'] }))}>
          <option value="auto">自动模式</option>
          <option value="manual">手动模式</option>
        </select>
      </label>

      <div className="control-grid" style={{ marginTop: 16 }}>
        <div className="switch-card"><label><span>照明灯</span><button type="button" className={draft.light ? 'toggle on' : 'toggle'} onClick={() => setBool('light')} /></label></div>
        <div className="switch-card"><label><span>风扇</span><button type="button" className={draft.fan ? 'toggle on' : 'toggle'} onClick={() => setBool('fan')} /></label></div>
        <div className="switch-card"><label><span>插座电源</span><button type="button" className={draft.socket ? 'toggle on' : 'toggle'} onClick={() => setBool('socket')} /></label></div>
        <div className="switch-card"><label><span>睡眠模式</span><button type="button" className={draft.sleep_mode ? 'toggle on' : 'toggle'} onClick={() => setBool('sleep_mode')} /></label></div>
      </div>

      <label className="field" style={{ marginTop: 16 }}>
        <span>风扇速度：{draft.fan_speed}%</span>
        <input className="input" type="range" min="0" max="100" value={draft.fan_speed} onChange={e => setDraft(prev => ({ ...prev, fan: Number(e.target.value) > 0, fan_speed: Number(e.target.value) }))} />
      </label>

      <div className="form-actions">
        <button className="btn btn-primary" type="button" disabled={saving} onClick={submit}>{saving ? '保存中...' : '保存控制命令'}</button>
        {message ? <span className="muted">{message}</span> : null}
      </div>
    </section>
  )
}
