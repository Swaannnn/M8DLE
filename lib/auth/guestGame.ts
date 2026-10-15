import 'server-only'

import { prisma } from '@/lib/db'
import { deleteGuestSession, getGuestId } from '@/lib/auth/guestSession'
import { getGameDate } from '@/utils/dateUtils'
import { isUniqueConstraintViolation } from '@/lib/prismaErrors'

/**
 * Rattache au compte la partie du jour jouée en invité, puis ferme la session invité.
 * A appeler à la création de session : la connexion passant par une navigation complète,
 * le client ne peut pas observer cette transition.
 *
 * L'UPDATE est atomique, donc aucune fenêtre de course : si le compte a déjà une partie
 * du jour, c'est la contrainte unique qui tranche.
 *
 * @returns true si une partie invité a été rattachée.
 */
export async function claimGuestGame(userId: string): Promise<boolean> {
    const guestId = await getGuestId()
    if (!guestId) return false

    const date = getGameDate()
    let claimed = false

    try {
        const { count } = await prisma.dailyM8DLEResult.updateMany({
            where: { guestId, date },
            data: { userId, guestId: null },
        })

        claimed = count > 0
    } catch (error) {
        if (!isUniqueConstraintViolation(error)) {
            // On garde la session invité pour qu'une prochaine connexion puisse retenter.
            throw error
        }

        // Le compte a déjà joué aujourd'hui : sa partie fait foi, on écarte celle de l'invité
        // pour ne pas la laisser orpheline ni la compter deux fois dans /dailywinners.
        await prisma.dailyM8DLEResult.deleteMany({ where: { guestId, date } })
    }

    await deleteGuestSession()

    return claimed
}
