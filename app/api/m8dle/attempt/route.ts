import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { getGameDate } from '@/utils/dateUtils'

export async function POST(req: Request) {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { playerName, isWin } = await req.json()
    const gameDate = getGameDate()

    const existing = await prisma.dailyM8DLEResult.findUnique({
        where: { userId_date: { userId: session.userId, date: gameDate } },
    })

    if (existing) {
        if (existing.success) return NextResponse.json(existing)

        const currentAttempts = Array.isArray(existing.attempts) ? existing.attempts : []
        const updatedAttempts = [...currentAttempts, playerName]

        const updated = await prisma.dailyM8DLEResult.update({
            where: { id: existing.id },
            data: {
                attempts: updatedAttempts,
                ...(isWin && { success: true }),
            },
        })
        return NextResponse.json(updated)
    }

    const created = await prisma.dailyM8DLEResult.create({
        data: {
            userId: session.userId,
            date: gameDate,
            attempts: [playerName],
            success: isWin ?? false,
        },
    })
    return NextResponse.json(created)
}
