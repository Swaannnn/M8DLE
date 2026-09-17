import 'server-only'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { getGuestId, getOrCreateGuestId } from '@/lib/auth/guestSession'

/**
 * Propriétaire d'une partie : utilisateur connecté ou session invité. Les deux champs étant
 * exclusifs, `{ ...owner }` s'utilise tel quel comme filtre ou données Prisma.
 */
export type GameOwner = { userId: string; guestId: null } | { userId: null; guestId: string }

/**
 * Identifiant de l'utilisateur connecté, à condition qu'il existe toujours,
 * y compris après la suppression du compte qu'il désigne. Sans cette
 * vérification la partie serait rattachée à un utilisateur fantôme,
 * et l'écriture violerait la contrainte de clé étrangère.
 */
async function findSessionUserId(): Promise<string | null> {
    const session = await getSession()
    if (!session?.userId) return null

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true },
    })

    return user?.id ?? null
}

/** Résout le propriétaire, en ouvrant une session invité si besoin. Pour les écritures. */
export async function resolveGameOwner(): Promise<GameOwner> {
    const userId = await findSessionUserId()
    if (userId) return { userId, guestId: null }

    return { userId: null, guestId: await getOrCreateGuestId() }
}

/** Résout le propriétaire sans rien créer : `null` si le visiteur n'a jamais joué. */
export async function findGameOwner(): Promise<GameOwner | null> {
    const userId = await findSessionUserId()
    if (userId) return { userId, guestId: null }

    const guestId = await getGuestId()
    return guestId ? { userId: null, guestId } : null
}
