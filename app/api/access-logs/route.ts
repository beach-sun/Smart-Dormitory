import { apiOk, db } from '../_shared/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(500, Math.max(1, Number(searchParams.get('limit') ?? 50)))
    const { data, error } = await db()
      .from('access_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return apiOk(data ?? [])
  } catch {
    return apiOk([])
  }
}
