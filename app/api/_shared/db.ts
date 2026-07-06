import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

export function db() {
  return createClient(
    getEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: async (input, init = {}) => {
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 4500)
          try {
            return await fetch(input, { ...init, signal: controller.signal })
          } finally {
            clearTimeout(timeout)
          }
        }
      }
    }
  )
}

export function apiOk(data: unknown = null, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init)
}

export function apiFail(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : String(error)
  console.error('[API ERROR]', message)
  return NextResponse.json({ success: false, message, data: null }, { status })
}

export async function readJson(request: Request): Promise<Record<string, any>> {
  return request.json().catch(() => ({}))
}

export function finite(value: unknown, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function toInt(value: unknown, fallback = 0) {
  return Math.round(finite(value, fallback))
}

export function toBool(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase()
    if (['1', 'true', 'yes', 'on', 'open', 'manual', '开', '开启', '有人', '识别到'].includes(v)) return true
    if (['0', 'false', 'no', 'off', 'close', 'auto', '关', '关闭', '无人'].includes(v)) return false
  }
  return fallback
}

export function safeString(value: unknown, fallback = '') {
  if (value === undefined || value === null) return fallback
  const s = String(value).trim()
  return s || fallback
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function deviceTokenValid(request: Request) {
  const token = process.env.DEVICE_API_TOKEN
  if (!token) return true
  return request.headers.get('x-device-token') === token
}

// Compatibility aliases for older route files.
// Some previous project files import apiError/readJson/toSafeString/toNumber/toBoolean from the old shared helpers.
export const apiError = apiFail
export const toSafeString = safeString
export const toNumber = finite
export const toBoolean = toBool
