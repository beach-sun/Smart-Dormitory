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
  const body = await request.json().catch(() => ({})) as { username?: string; password?: string }
  const username = body.username?.trim() ?? ''
  const password = body.password ?? ''

  const envUser = process.env.DORM_LOGIN_USER || 'admin'
  const envPass = process.env.DORM_LOGIN_PASSWORD || '123456'
  if (username === envUser && password === envPass) {
    return setLoginCookie(NextResponse.json({ success: true, data: { username, role: 'admin' } }))
  }

  try {
    const { data, error } = await db()
      .from('用户注册')
      .select('*')
      .eq('用户名', username)
      .maybeSingle()

    if (error) throw error
    const userRow = data as Record<string, unknown> | null
    if (!userRow || userRow.状态 !== '启用' || !verifyPassword(password, userRow.密码盐, userRow.密码哈希)) {
      return NextResponse.json({ success: false, message: '账号或密码错误' }, { status: 401 })
    }

    return setLoginCookie(NextResponse.json({ success: true, data: { username: userRow.用户名, role: userRow.角色 } }))
  } catch (error) {
    console.error('[登录] 数据库登录失败', error)
    return NextResponse.json({ success: false, message: '账号或密码错误，或用户表尚未创建。' }, { status: 401 })
  }
}
