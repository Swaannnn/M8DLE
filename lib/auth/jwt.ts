import { SignJWT, jwtVerify } from 'jose'

const SECRET_KEY = process.env.AUTH_SECRET
const encodedKey = new TextEncoder().encode(SECRET_KEY)

export type SessionPayload = {
    userId: string
    discordId: string
    role: string
    expiresAt: Date
}

export async function encrypt(payload: Omit<SessionPayload, 'expiresAt'>) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    return new SignJWT({ ...payload, expiresAt })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined) {
    if (!session) return null
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload as unknown as SessionPayload
    } catch (error) {
        console.error('JWT verification failed:', error)
        return null
    }
}
