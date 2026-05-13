import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { getGameDate } from '@/utils/dateUtils'
import { AttemptDto } from '@/dto/AttemptDto'
import { ZodError } from 'zod'

export async function POST(req: Request) {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await req.json()
        const payload = AttemptDto.parse(body)

        const gameDate = getGameDate()
        const dailyResult = await prisma.dailyM8DLEResult.findUnique({
            where: { userId_date: { userId: session.userId, date: gameDate } },
        })

        if (dailyResult) {
            // Dans cette section, on renvoit un status 200 avec aucun body
            // s'il n'y a pas besoin d'importer des essais
            if (dailyResult.success) {
                return NextResponse.json(null, { status: 200 })
            }

            const attempts = dailyResult.attempts as string[]
            const exists = attempts.some((name) => payload.attempts.includes(name))
            if (exists) {
                return NextResponse.json(null, { status: 200 })
            }

            const updated = await prisma.dailyM8DLEResult.update({
                where: { id: dailyResult.id },
                data: {
                    attempts: [...attempts, ...payload.attempts],
                    success: payload.isWin,
                },
            })

            return NextResponse.json(updated)
        }

        const created = await prisma.dailyM8DLEResult.create({
            data: {
                userId: session.userId,
                attempts: payload.attempts,
                date: gameDate,
                success: payload.isWin,
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
