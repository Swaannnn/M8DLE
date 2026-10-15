import { prisma } from '@/lib/db'

/**
 * Calcule la winstreak d'un utilisateur.
 */
export async function computeWinstreak(userId: string): Promise<number> {
    const now = new Date()
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

    const results = await prisma.dailyM8DLEResult.findMany({
        where: { userId },
        select: { date: true },
        orderBy: { date: 'desc' },
    })

    if (results.length === 0) return 0

    const playedDays = new Set(
        results.map((r) => {
            const d = r.date
            return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
        })
    )

    const DAY_MS = 86_400_000

    let streak = 0
    let current = todayUTC.getTime() - DAY_MS

    if (playedDays.has(todayUTC.getTime())) {
        current = todayUTC.getTime()
    }

    while (playedDays.has(current)) {
        streak++
        current -= DAY_MS
    }

    return streak
}
