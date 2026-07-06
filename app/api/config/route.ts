import { NextResponse } from 'next/server'
import { readJson } from '../_shared/format'
import { writeOperationLog } from '../_shared/log'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data } = await db()
    .from('config')
    .select('*')
    .single()

  return NextResponse.json({ success: true, data })
}

export async function POST(request: Request) {
  const body = await readJson(request)

  const { data, error } = await db()
    .from('config')
    .update(body)
    .eq('id', 1)
    .select()
    .single()

  if (error) throw error

  return NextResponse.json({ success: true, data })
}
