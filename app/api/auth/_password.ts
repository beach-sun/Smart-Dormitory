import crypto from 'crypto'

export function makeSalt() {
  return crypto.randomBytes(16).toString('hex')
}

export function hashPassword(password: string, salt: string) {
  return crypto.createHash('sha256').update(`${salt}:${password}`).digest('hex')
}

export function verifyPassword(password: string, salt: unknown, hash: unknown) {
  if (!password || typeof salt !== 'string' || typeof hash !== 'string') return false
  return hashPassword(password, salt) === hash
}
