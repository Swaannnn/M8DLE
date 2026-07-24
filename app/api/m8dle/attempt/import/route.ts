import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { getGameDate } from '@/utils/dateUtils'
import { MultipleAttemptDto } from '@/dto/AttemptDto'
import { ZodError } from 'zod'
import { getOrGeneratePlayerOfTheDay } from '@/utils/playerOtdUtils'

export async function POST(req: Request) {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await req.json()
        const payload = MultipleAttemptDto.parse(body)

        const gameDate = getGameDate()
        const playerOtd = await getOrGeneratePlayerOfTheDay(gameDate)
        const isWin = playerOtd ? payload.attempts.includes(playerOtd.id) : false

        const dailyResult = await prisma.dailyM8DLEResult.findUnique({
            where: { userId_date: { userId: session.userId, date: gameDate } },
            select: { id: true, success: true, attempts: true },
        })

        if (dailyResult) {
            return NextResponse.json({ error: 'Daily result already exists' }, { status: 400 })
        }

        const players = await prisma.player.findMany({
            where: {
                id: {
                    in: payload.attempts,
                },
            },
        })

        const attempts = []
        for (let i = 0; i < players.length; i++) {
            attempts.push({
                playerId: players[i].id,
                attemptNumber: i + 1,
            })
        }

        const created = await prisma.dailyM8DLEResult.create({
            data: {
                userId: session.userId,
                date: gameDate,
                success: isWin,
                attempts: {
                    createMany: {
                        data: attempts,
                    },
                },
            },
            select: {
                id: true,
                success: true,
                attempts: true,
            },
        })

        return NextResponse.json(created, { status: 201 })
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
        } else {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    }
}
