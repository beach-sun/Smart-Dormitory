import { NextResponse } from 'next/server'
import { apiFail, apiOk, db, readJson, safeString } from '../../_shared/db'
import { hashPassword, makeSalt } from '../_password'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await readJson(request)
    const username = safeString(body.username, '').trim()
    const password = safeString(body.password, '').trim()
    const nickname = safeString(body.nickname, username)
    const phone = safeString(body.phone, '')
    const email = safeString(body.email, '')

    if (!/^[A-Za-z0-9_-]{3,24}$/.test(username)) {
      return NextResponse.json({ success: false, message: '账号需为 3-24 位字母、数字、下划线或短横线。', data: null }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: '密码至少 6 位。', data: null }, { status: 400 })
    }

    const salt = makeSalt()
    const { data, error } = await db()
      .from('app_users')
      .insert({
        username,
        password_hash: hashPassword(password, salt),
        password_salt: salt,
        nickname,
        phone: phone || null,
        email: email || null,
        role: 'user',
        status: 'enabled'
      })
      .select('id, created_at, username, nickname, phone, email, role, status')
      .maybeSingle()

    if (error) {
      if (String(error.message).toLowerCase().includes('duplicate')) {
        return NextResponse.json({ success: false, message: '账号已存在，请更换账号。', data: null }, { status: 409 })
      }
      throw error
    }

    return apiOk(data)
  } catch (error) {
    return apiFail(error)
  }
}
