import { prisma } from '@/lib/db'
import { getGameDate } from '@/utils/dateUtils'

const DAY_MS = 86_400_000

/**
 * Calcule la winstreak de plusieurs utilisateurs, en une seule requête.
 *
 * La winstreak compte le nombre de victoires consécutives jusqu'à aujourd'hui ou hier.
 * Si l'utilisateur n'a pas encore gagné aujourd'hui, la série se terminant hier
 * est conservée car la journée en cours n'est pas encore terminée.
 */
export async function computeWinstreaks(userIds: string[]): Promise<Map<string, number>> {
    const results = await prisma.dailyM8DLEResult.findMany({
        where: { userId: { in: userIds }, success: true },
        select: { userId: true, date: true },
    })

    const wonDaysByUser = new Map<string, Set<number>>()
    for (const { userId, date } of results) {
        if (!userId) continue
        const wonDays = wonDaysByUser.get(userId) ?? new Set<number>()
        wonDays.add(date.getTime())
        wonDaysByUser.set(userId, wonDays)
    }

    const today = getGameDate().getTime()
    return new Map(userIds.map((userId) => [userId, countStreak(wonDaysByUser.get(userId), today)]))
}

export async function computeWinstreak(userId: string): Promise<number> {
    const winstreaks = await computeWinstreaks([userId])
    return winstreaks.get(userId) ?? 0
}

function countStreak(wonDays: Set<number> | undefined, today: number): number {
    if (!wonDays) return 0

    let streak = 0
    let current = wonDays.has(today) ? today : today - DAY_MS

    while (wonDays.has(current)) {
        streak++
        current -= DAY_MS
    }

    return streak
}
