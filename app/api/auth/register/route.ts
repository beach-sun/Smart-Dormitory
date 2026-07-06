import { NextResponse } from 'next/server'
import { db, apiError } from '../../_shared/db'
import { readJson, toSafeString } from '../../_shared/format'
import { hashPassword, makeSalt } from '../_password'

export const dynamic = 'force-dynamic'

function mapUser(row: Record<string, unknown>) {
  return {
    id: row.id,
    created_at: row.创建时间,
    username: row.用户名,
    nickname: row.昵称,
    phone: row.手机,
    email: row.邮箱,
    role: row.角色,
    status: row.状态
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request)
    const username = toSafeString(body.username ?? body.用户名, '').trim()
    const password = toSafeString(body.password, '').trim()
    const nickname = toSafeString(body.nickname ?? body.昵称, username)
    const phone = toSafeString(body.phone ?? body.手机, '')
    const email = toSafeString(body.email ?? body.邮箱, '')

    if (!/^[A-Za-z0-9_\-]{3,24}$/.test(username)) {
      return NextResponse.json({ success: false, message: '账号需为 3-24 位字母、数字、下划线或短横线。', data: null }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: '密码至少 6 位。', data: null }, { status: 400 })
    }

    const salt = makeSalt()
    const payload = {
      用户名: username,
      密码哈希: hashPassword(password, salt),
      密码盐: salt,
      昵称: nickname,
      手机: phone || null,
      邮箱: email || null,
      角色: 'user',
      状态: '启用'
    }

    const { data, error } = await db().from('用户注册').insert(payload).select('*').single()
    if (error) {
      if (String(error.message).includes('duplicate')) {
        return NextResponse.json({ success: false, message: '账号已存在，请更换账号。', data: null }, { status: 409 })
      }
      throw error
    }
    return NextResponse.json({ success: true, data: data ? mapUser(data) : { username } })
  } catch (error) {
    return apiError(error)
  }
}
