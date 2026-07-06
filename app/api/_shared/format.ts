export function toNumber(value: unknown, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function toInt(value: unknown, fallback = 0) {
  return Math.round(toNumber(value, fallback))
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function toBoolean(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase()
    return ['true', '1', 'yes', 'on', '开', '有人', 'manual', 'person', 'detected', '识别到', '有'].includes(v)
  }
  return fallback
}

export function toSafeString(value: unknown, fallback = '-') {
  if (value === null || value === undefined) return fallback
  const s = String(value).trim()
  return s || fallback
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  return request.json().catch(() => ({}))
}
