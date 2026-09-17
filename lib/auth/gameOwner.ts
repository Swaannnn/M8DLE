import 'server-only'
import { getSession } from '@/lib/auth/session'
import { getGuestId, getOrCreateGuestId } from '@/lib/auth/guestSession'

/**
 * Propriétaire d'une partie : utilisateur connecté ou session invité. Les deux champs étant
 * exclusifs, `{ ...owner }` s'utilise tel quel comme filtre ou données Prisma.
 */
export type GameOwner = { userId: string; guestId: null } | { userId: null; guestId: string }

/** Résout le propriétaire, en ouvrant une session invité si besoin. Pour les écritures. */
export async function resolveGameOwner(): Promise<GameOwner> {
    const session = await getSession()
    if (session?.userId) return { userId: session.userId, guestId: null }

    return { userId: null, guestId: await getOrCreateGuestId() }
}

/** Résout le propriétaire sans rien créer : `null` si le visiteur n'a jamais joué. */
export async function findGameOwner(): Promise<GameOwner | null> {
    const session = await getSession()
    if (session?.userId) return { userId: session.userId, guestId: null }

    const guestId = await getGuestId()
    return guestId ? { userId: null, guestId } : null
}
