import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { getGameDate } from '@/utils/dateUtils'
import ApiErrorCode from '@/constants/apiErrorCodes'

/**
 * Récupère le status de l'avancement
 * de l'utilisateur en cours.
 *
 * @returns
 */
export async function GET() {
    try {
        const session = await getSession()
        if (!session?.userId) return NextResponse.json({ error: ApiErrorCode.UNAUTHORIZED }, { status: 401 })

        const gameDate = getGameDate()
        const dailyResult = await prisma.dailyM8DLEResult.findUnique({
            where: { userId_date: { userId: session.userId, date: gameDate } },
            select: {
                userId: true,
                success: true,
                attempts: { orderBy: { attemptNumber: 'asc' } },
            },
        })

        if (!dailyResult) {
            return NextResponse.json({
                userId: session.userId,
                success: false,
                attempts: [],
            })
        }

        return NextResponse.json(dailyResult)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorCode.INTERNAL_ERROR }, { status: 500 })
    }
}
