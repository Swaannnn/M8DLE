import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { getGameDate } from '@/utils/dateUtils'
import type { UserStatus } from '@/types/userStatus'

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

    const status: UserStatus = {
        hasWin: result?.success ?? false,
        attempts: result?.attempts ?? [],
    }

    return NextResponse.json(status)
}
