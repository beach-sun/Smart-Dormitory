import { apiFail, apiOk, db, readJson } from '../_shared/db'
import { defaultConfig } from '../_shared/defaults'
import { normalizeConfig } from '../_shared/model'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const { data, error } = await db()
      .from('config')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    if (error) throw error
    return apiOk(data ?? { id: 1, ...defaultConfig })
  } catch {
    return apiOk({ id: 1, ...defaultConfig })
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request)

    const { data: old } = await db()
      .from('config')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    const payload = { id: 1, ...normalizeConfig(body, old ?? {}) }

    const { data, error } = await db()
      .from('config')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .maybeSingle()

    if (error) throw error
    return apiOk(data ?? payload)
  } catch (error) {
    return apiFail(error)
  }
}
