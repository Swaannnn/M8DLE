import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { getGameDate } from '@/utils/dateUtils'
import { M8dleStatus } from '@/types/M8dleStatus'

/**
 * Récupère le status de l'avancement
 * de l'utilisateur en cours.
 *
 * @returns
 */
export async function GET() {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const gameDate = getGameDate()
    const result = await prisma.dailyM8DLEResult.findUnique({
        where: { userId_date: { userId: session.userId, date: gameDate } },
    })

    let attempts: string[] = []
    if (result?.attempts) {
        attempts = [...(result.attempts as string[])]
    }

    const status: M8dleStatus = {
        attempts,
        isWin: result?.success ?? false,
    }

    return NextResponse.json(status)
}
