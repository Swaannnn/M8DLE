import 'server-only'
import { cookies } from 'next/headers'
import { encrypt, decrypt } from '@/lib/auth/jwt'
import { redirect } from 'next/navigation'

export async function createSession(userId: string, discordId: string, role: string) {
    const session = await encrypt({ userId, discordId, role })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sameSite: 'lax',
        path: '/',
    })
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    const payload = await decrypt(session)

    if (!payload) return null
    return payload
}

export async function verifySession() {
    const session = await getSession()
    if (!session?.userId) {
        redirect('/api/auth/login')
    }
    return session
}
