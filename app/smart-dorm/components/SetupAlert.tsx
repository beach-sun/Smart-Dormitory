export default function SetupAlert({ error }: { error?: string }) {
  if (!error) return null
  return (
    <div className="setup-alert">
      <strong>数据接口暂不可用</strong>
      <p>{error}</p>
      <p>请确认已执行 <code>supabase/schema.sql</code>，并在 <code>.env.local</code> 中配置 Supabase URL 与 service role key。</p>
    </div>
  )
}
