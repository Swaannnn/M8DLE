import { SignJWT, errors, jwtVerify } from 'jose'

const SECRET_KEY = process.env.AUTH_SECRET
const encodedKey = new TextEncoder().encode(SECRET_KEY)

export type SessionPayload = {
    userId: string
    discordId: string
    role: string
    expiresAt: Date
}

export async function encrypt(payload: Omit<SessionPayload, 'expiresAt'>) {
    return new SignJWT({ ...payload })
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
        // Jeton expiré ou invalide : cas normal, le visiteur repasse simplement en anonyme.
        if (!(error instanceof errors.JOSEError)) console.error('JWT verification failed:', error)
        return null
    }
}
