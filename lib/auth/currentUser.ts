import 'server-only'
import { cache } from 'react'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

/**
 * Utilisateur connecté, relu en base : le rôle est toujours à jour et un jeton révoqué est refusé.
 */
export const getCurrentUser = cache(async () => {
    const session = await getSession()
    if (!session?.userId) return null

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, discordId: true, role: true, sessionVersion: true },
    })

    if (!user || user.sessionVersion !== (session.sessionVersion ?? 0)) return null
    return user
})

/** Utilisateur connecté s'il est administrateur, `null` sinon. */
export async function getCurrentAdmin() {
    const user = await getCurrentUser()
    return user?.role === Role.ADMIN ? user : null
}
