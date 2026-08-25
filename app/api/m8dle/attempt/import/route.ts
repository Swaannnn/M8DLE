import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { getGameDate } from '@/utils/dateUtils'
import { MultipleAttemptDto } from '@/dto/AttemptDto'
import { ZodError } from 'zod'
import { getOrGeneratePlayerOfTheDay } from '@/utils/playerOtdUtils'
import ApiErrorCode from '@/constants/apiErrorCodes'

export async function POST(req: Request) {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: ApiErrorCode.UNAUTHORIZED }, { status: 401 })

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
            return NextResponse.json({ error: ApiErrorCode.ALREADY_EXISTS }, { status: 400 })
        }

        const players = await prisma.player.findMany({
            where: {
                id: {
                    in: payload.attempts,
                },
            },
        })
        const existingPlayerIds = new Set(players.map((p) => p.id))

        // On numérote selon l'ordre chronologique de payload.attempts (celui du local storage),
        // pas selon l'ordre renvoyé par la requête ci-dessus qui n'est pas garanti.
        const attempts = payload.attempts
            .filter((playerId) => existingPlayerIds.has(playerId))
            .map((playerId, index) => ({
                playerId,
                attemptNumber: index + 1,
            }))

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
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: ApiErrorCode.BAD_REQUEST }, { status: 400 })
        }

        console.error(error)
        return NextResponse.json({ error: ApiErrorCode.INTERNAL_ERROR }, { status: 500 })
    }
}
