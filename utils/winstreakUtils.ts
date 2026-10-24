import { prisma } from '@/lib/db'
import { getGameDate } from '@/utils/dateUtils'

const DAY_MS = 86_400_000

/**
 * Calcule la winstreak d'un utilisateur.
 *
 * La winstreak compte le nombre de victoires consécutives jusqu'à aujourd'hui ou hier.
 * Si l'utilisateur n'a pas encore gagné aujourd'hui, la série se terminant hier
 * est conservée car la journée en cours n'est pas encore terminée.
 */
export async function computeWinstreak(userId: string): Promise<number> {
    const results = await prisma.dailyM8DLEResult.findMany({
        where: { userId, success: true },
        select: { date: true },
        orderBy: { date: 'desc' },
    })

    if (results.length === 0) return 0

    const wonDays = new Set(results.map((r) => r.date.getTime()))

    const today = getGameDate().getTime()

    let streak = 0
    let current = wonDays.has(today) ? today : today - DAY_MS

    while (wonDays.has(current)) {
        streak++
        current -= DAY_MS
    }

    return streak
}
