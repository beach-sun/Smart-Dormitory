import { NextResponse } from 'next/server'
import { db } from '../../_shared/db'
import { verifyPassword } from '../_password'

function setLoginCookie(res: NextResponse) {
  res.cookies.set('smart_dorm_login', 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12
  })
  return res
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const username = String(body.username ?? '').trim()
  const password = String(body.password ?? '')

  const envUser = process.env.DORM_LOGIN_USER || 'admin'
  const envPass = process.env.DORM_LOGIN_PASSWORD || '123456'

  if (username === envUser && password === envPass) {
    return setLoginCookie(NextResponse.json({ success: true, data: { username, role: 'admin' } }))
  }

  try {
    const { data, error } = await db()
      .from('app_users')
      .select('*')
      .eq('username', username)
      .maybeSingle()

    if (error) throw error
    if (!data || data.status !== 'enabled' || !verifyPassword(password, data.password_salt, data.password_hash)) {
      return NextResponse.json({ success: false, message: '账号或密码错误' }, { status: 401 })
    }

    return setLoginCookie(NextResponse.json({ success: true, data: { username: data.username, role: data.role } }))
  } catch {
    return NextResponse.json({ success: false, message: '账号或密码错误，或用户表尚未创建。' }, { status: 401 })
  }
}
