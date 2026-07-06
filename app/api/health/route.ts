import { apiOk } from '../_shared/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  return apiOk({
    ok: true,
    time: new Date().toISOString(),
    env: {
      supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      deviceTokenEnabled: Boolean(process.env.DEVICE_API_TOKEN)
    }
  })
}
