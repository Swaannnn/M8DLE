import { getAuthorizationUrl } from '@/lib/auth/discord'
import { redirect } from 'next/navigation'

export async function GET() {
    const url = getAuthorizationUrl()
    redirect(url)
}
