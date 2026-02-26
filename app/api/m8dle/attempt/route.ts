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
        const body = await req.json().catch(() => ({}))
        const attempt = AttemptDto.parse(body)

        if (attempt.playerName) attempt.attempts.push(attempt.playerName)
        if (attempt.attempts.length === 0 && !attempt.isWin && !attempt.hasWin) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
        }

        const isSuccess = attempt.isWin || attempt.hasWin
        const gameDate = getGameDate()
        const dailyResult = await prisma.dailyM8DLEResult.findUnique({
            where: { userId_date: { userId: session.userId, date: gameDate } },
        })

        if (dailyResult) {
            // FIXME: Faire plutôt un bad request car tentative de jouer en ayant déjà gagné ?
            if (dailyResult.success) return NextResponse.json(dailyResult)

            const currentAttempts = Array.isArray(dailyResult.attempts) ? dailyResult.attempts : []
            const updatedAttempts = [...currentAttempts] // Copie du tableau currentAttempts

            attempt.attempts.forEach((name) => {
                if (!updatedAttempts.includes(name)) updatedAttempts.push(name)
            })

            const updated = await prisma.dailyM8DLEResult.update({
                where: { id: dailyResult.id },
                data: {
                    attempts: updatedAttempts,
                    success: isSuccess,
                },
            })

            return NextResponse.json(updated)
        }

        // FIXME: il y a forcément mieux
        const uniqueAttempts: string[] = []
        attempt.attempts.forEach((n) => {
            if (uniqueAttempts.includes(n)) {
                uniqueAttempts.push(n)
            }
        })

        const created = await prisma.dailyM8DLEResult.create({
            data: {
                userId: session.userId,
                date: gameDate,
                attempts: uniqueAttempts,
                success: isSuccess,
            },
        })

        return NextResponse.json(created)
    } catch (e) {
        if (e instanceof ZodError) {
            return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
        } else {
            console.log(e)
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        }
    }
}
