import 'server-only'
import { cookies } from 'next/headers'

const GUEST_COOKIE_NAME = 'guest_id'
const GUEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/**
 * Identifiant de session invité, porté par un cookie opaque. Volontairement non signé :
 * il ne porte aucune autorisation, seulement de quoi rattacher une partie à un visiteur.
 */
export async function getOrCreateGuestId(): Promise<string> {
    const existing = await getGuestId()
    if (existing) return existing

    const guestId = crypto.randomUUID()
    const cookieStore = await cookies()

    cookieStore.set(GUEST_COOKIE_NAME, guestId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: GUEST_COOKIE_MAX_AGE,
        sameSite: 'lax',
        path: '/',
    })

    return guestId
}

/** Lit l'identifiant invité sans en créer : à utiliser sur les lectures. */
export async function getGuestId(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get(GUEST_COOKIE_NAME)?.value ?? null
}

export async function deleteGuestSession() {
    const cookieStore = await cookies()
    cookieStore.delete(GUEST_COOKIE_NAME)
}
