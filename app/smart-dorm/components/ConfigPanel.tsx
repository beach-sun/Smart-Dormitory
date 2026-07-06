'use client'

import { useEffect, useState } from 'react'
import type { DormConfig } from '@/lib/types'

const fallback: DormConfig = {
  mq2Threshold: 1800,
  co2Threshold: 1200,
  powerThreshold: 10,
  minTemperature: 0,
  maxTemperature: 40,
  fanOnTemperature: 30,
  fanOffTemperature: 28,
  lightThreshold: 20,
  shortAwaySeconds: 30,
  longAwaySeconds: 1800,
  uploadIntervalMs: 5000
}

export default function ConfigPanel({ config, onChanged }: { config: DormConfig | null; onChanged?: () => void }) {
  const [draft, setDraft] = useState<DormConfig>(config ?? fallback)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (config) setDraft({ ...fallback, ...config })
  }, [config])

  function setNumber(key: keyof DormConfig, value: string) {
    setDraft(prev => ({ ...prev, [key]: Number(value) }))
  }

  async function submit() {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify(draft)
      })
      const payload = await res.json().catch(() => ({ success: false, message: '保存失败' }))
      if (!res.ok || !payload.success) throw new Error(payload.message || '保存失败')
      setMessage('阈值参数已保存。')
      onChanged?.()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error))
    } finally {
      setSaving(false)
    }
  }

  const fields: [keyof DormConfig, string, string][] = [
    ['mq2Threshold', '烟雾阈值', 'ADC'],
    ['co2Threshold', 'CO₂ 阈值', 'ppm'],
    ['powerThreshold', '功率阈值', 'W'],
    ['lightThreshold', '光照阈值', 'lx'],
    ['minTemperature', '最低温度', '℃'],
    ['maxTemperature', '最高温度', '℃'],
    ['fanOnTemperature', '风扇开启温度', '℃'],
    ['fanOffTemperature', '风扇关闭温度', '℃'],
    ['shortAwaySeconds', '短时离寝', '秒'],
    ['longAwaySeconds', '长时离寝', '秒']
  ]

  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <h3>自动规则与阈值</h3>
          <p>这些参数会随 /api/device-command 一起下发给 ESP32。</p>
        </div>
      </div>
      <div className="form-grid">
        {fields.map(([key, label, suffix]) => (
          <label className="field" key={key}>
            <span>{label}</span>
            <input className="input" type="number" value={Number(draft[key] ?? 0)} onChange={e => setNumber(key, e.target.value)} />
            <small className="muted">单位：{suffix}</small>
          </label>
        ))}
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="button" disabled={saving} onClick={submit}>{saving ? '保存中...' : '保存阈值'}</button>
        {message ? <span className="muted">{message}</span> : null}
      </div>
    </section>
  )
}
