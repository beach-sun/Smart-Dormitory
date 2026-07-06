'use client'

import { useEffect, useState } from 'react'
import type { DormConfig } from '../types/sensor'

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
  updated_at: ''
}

export default function ConfigForm({ config, onChanged }: { config: DormConfig | null; onChanged?: () => void }) {
  const [draft, setDraft] = useState<DormConfig>(config ?? fallback)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (config) setDraft(config)
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
        body: JSON.stringify(draft)
      })
      const payload = await res.json()
      if (!res.ok || !payload.success) throw new Error(payload.message || '保存失败')
      setMessage('模式与阈值参数已保存。')
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
          <h3>模式与阈值</h3>
          <p>此处仅维护报警阈值、自动规则与离寝判定参数；灯、风扇、插座控制已移至“执行器状态”页面，避免功能重复。</p>
        </div>
      </div>
      <div className="form-grid">
        <NumberField label="烟雾阈值" value={draft.mq2Threshold} onChange={v => setNumber('mq2Threshold', v)} suffix="ADC" />
        <NumberField label="CO₂ 阈值" value={draft.co2Threshold} onChange={v => setNumber('co2Threshold', v)} suffix="ppm" />
        <NumberField label="功率阈值" value={draft.powerThreshold} onChange={v => setNumber('powerThreshold', v)} suffix="W" />
        <NumberField label="光照阈值" value={draft.lightThreshold} onChange={v => setNumber('lightThreshold', v)} suffix="lx" />
        <NumberField label="最低温度" value={draft.minTemperature} onChange={v => setNumber('minTemperature', v)} suffix="℃" />
        <NumberField label="最高温度" value={draft.maxTemperature} onChange={v => setNumber('maxTemperature', v)} suffix="℃" />
        <NumberField label="风扇自动开启温度" value={draft.fanOnTemperature} onChange={v => setNumber('fanOnTemperature', v)} suffix="℃" />
        <NumberField label="风扇自动关闭温度" value={draft.fanOffTemperature} onChange={v => setNumber('fanOffTemperature', v)} suffix="℃" />
        <NumberField label="短时离寝" value={draft.shortAwaySeconds} onChange={v => setNumber('shortAwaySeconds', v)} suffix="秒" />
        <NumberField label="长时离寝" value={draft.longAwaySeconds} onChange={v => setNumber('longAwaySeconds', v)} suffix="秒" />
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="button" disabled={saving} onClick={submit}>{saving ? '保存中...' : '保存模式与阈值'}</button>
        {message ? <span className="muted">{message}</span> : null}
      </div>
    </section>
  )
}

function NumberField({ label, value, suffix, onChange }: { label: string; value: number; suffix: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input className="input" type="number" value={value} onChange={e => onChange(e.target.value)} />
      <small className="muted">单位：{suffix}</small>
    </label>
  )
}
