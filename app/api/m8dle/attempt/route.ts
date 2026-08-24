import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { getGameDate } from '@/utils/dateUtils'
import { AttemptDto } from '@/dto/AttemptDto'
import { ZodError } from 'zod'
import { Role } from '@prisma/client'
import { getOrGeneratePlayerOfTheDay } from '@/utils/playerOtdUtils'

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await req.json()
        const payload = AttemptDto.parse(body)

        const gameDate = getGameDate()
        const playerOtd = await getOrGeneratePlayerOfTheDay(gameDate)
        const isWin = playerOtd ? payload.attempt === playerOtd.id : false

        const dailyResult = await prisma.dailyM8DLEResult.findUnique({
            where: { userId_date: { userId: session.userId, date: gameDate } },
            select: {
                id: true,
                success: true,
                attempts: { orderBy: { attemptNumber: 'asc' } },
            },
        })

        if (dailyResult) {
            if (dailyResult.success) {
                return NextResponse.json({ error: 'Daily Result is already a success' }, { status: 400 })
            }

            if (dailyResult.attempts.some((a) => a.playerId === payload.attempt)) {
                return NextResponse.json({ error: 'Player already attempted' }, { status: 400 })
            }

            const updated = await prisma.dailyM8DLEResult.update({
                where: { id: dailyResult.id },
                data: {
                    success: isWin,
                    attempts: {
                        create: {
                            playerId: payload.attempt,
                            attemptNumber:
                                (dailyResult.attempts[dailyResult.attempts.length - 1]?.attemptNumber ?? 0) + 1,
                        },
                    },
                },
                include: {
                    attempts: { orderBy: { attemptNumber: 'asc' } },
                },
            })

            return NextResponse.json(updated)
        }

        const created = await prisma.dailyM8DLEResult.create({
            data: {
                userId: session.userId,
                date: gameDate,
                success: isWin,
                attempts: {
                    create: {
                        attemptNumber: 1,
                        playerId: payload.attempt,
                    },
                },
            },
            include: {
                attempts: { orderBy: { attemptNumber: 'asc' } },
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

export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session?.userId || session?.role !== Role.ADMIN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const id = req.nextUrl.searchParams.get('id')
        if (!id) {
            return NextResponse.json({ error: "Parameter 'id' is required" }, { status: 400 })
        }

        const attempt = await prisma.attempt.findUnique({ where: { id } })
        if (!attempt) {
            return NextResponse.json({ error: 'Attempt does not exists' }, { status: 400 })
        }

        await prisma.attempt.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
