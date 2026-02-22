import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { getGameDate } from '@/utils/dateUtils'

export async function POST(req: Request) {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const playerName = typeof body.playerName === 'string' ? body.playerName.trim() : ''
    const isWin = body.isWin === true
    const hasWin = body.hasWin === true
    const requestAttempts: string[] = Array.isArray(body.attempts)
        ? body.attempts.filter((name: unknown): name is string => typeof name === 'string' && name.trim().length > 0)
        : []

    if (playerName) requestAttempts.push(playerName)
    if (requestAttempts.length === 0 && !isWin && !hasWin) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const gameDate = getGameDate()

    const existing = await prisma.dailyM8DLEResult.findUnique({
        where: { userId_date: { userId: session.userId, date: gameDate } },
    })

    if (existing) {
        if (existing.success) return NextResponse.json(existing)

        const currentAttempts = Array.isArray(existing.attempts) ? existing.attempts : []
        const updatedAttempts = [...currentAttempts]

        requestAttempts.forEach((name) => {
            if (!updatedAttempts.includes(name)) updatedAttempts.push(name)
        })

        const updated = await prisma.dailyM8DLEResult.update({
            where: { id: existing.id },
            data: {
                attempts: updatedAttempts,
                ...((isWin || hasWin) && { success: true }),
            },
        })
        return NextResponse.json(updated)
    }

    const uniqueAttempts: string[] = []
    requestAttempts.forEach((name) => {
        if (!uniqueAttempts.includes(name)) uniqueAttempts.push(name)
    })

    const created = await prisma.dailyM8DLEResult.create({
        data: {
            userId: session.userId,
            date: gameDate,
            attempts: uniqueAttempts,
            success: isWin || hasWin,
        },
    })
    return NextResponse.json(created)
}
