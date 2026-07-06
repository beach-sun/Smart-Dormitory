import { db } from './db'
export async function writeOperationLog(input: { source?: string; type: string; content: string; oldValue?: unknown; newValue?: unknown }) {
  try {
    await db().from('操作日志').insert({ 操作来源: input.source ?? '网页端', 操作类型: input.type, 操作内容: input.content, 旧值: input.oldValue ?? null, 新值: input.newValue ?? null })
  } catch (error) {
    console.error('[操作日志] 写入失败', error)
  }
}
