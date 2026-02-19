import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { getGameDate } from '@/utils/dateUtils'

export async function GET() {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const gameDate = getGameDate()
    const result = await prisma.dailyM8DLEResult.findUnique({
        where: { userId_date: { userId: session.userId, date: gameDate } },
    })

    return NextResponse.json({
        hasWin: result?.success ?? false,
        attempts: result?.attempts ?? [],
    })
}
