import { apiFail, apiOk, db, deviceTokenValid, readJson } from '../_shared/db'
import { defaultControl } from '../_shared/defaults'
import { normalizeControl } from '../_shared/model'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const { data, error } = await db()
      .from('device_control')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    if (error) throw error
    return apiOk(data ?? { id: 1, ...defaultControl })
  } catch (error) {
    return apiOk({ id: 1, ...defaultControl })
  }
}

export async function POST(request: Request) {
  try {
    if (!deviceTokenValid(request)) return apiFail('Invalid device token', 401)

    const body = await readJson(request)

    const { data: old } = await db()
      .from('device_control')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    const payload = { id: 1, ...normalizeControl(body, old ?? {}) }

    const { data, error } = await db()
      .from('device_control')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .maybeSingle()

    if (error) throw error
    return apiOk(data ?? payload)
  } catch (error) {
    return apiFail(error)
  }
}
