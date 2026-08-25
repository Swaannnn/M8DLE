import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { getFirstDayOfMonth } from '@/utils/dateUtils'
import ApiErrorCode from '@/constants/apiErrorCodes'

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session || !session.userId) {
            return NextResponse.json({ error: ApiErrorCode.UNAUTHORIZED }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const dateParam = searchParams.get('date')

        const targetDate = dateParam ? new Date(dateParam) : new Date()

        if (isNaN(targetDate.getTime())) {
            return NextResponse.json({ error: ApiErrorCode.BAD_REQUEST }, { status: 400 })
        }

        const firstDayOfMonth = getFirstDayOfMonth(targetDate)
        const firstDayOfNextMonth = new Date(firstDayOfMonth)
        firstDayOfNextMonth.setMonth(firstDayOfNextMonth.getMonth() + 1)

        const results = await prisma.dailyM8DLEResult.findMany({
            where: {
                userId: session.userId,
                success: true,
                date: {
                    gte: firstDayOfMonth,
                    lt: firstDayOfNextMonth,
                },
            },
            include: {
                _count: {
                    select: { attempts: true },
                },
            },
            orderBy: {
                date: 'desc',
            },
        })

        return NextResponse.json(results)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorCode.FETCH_FAILED }, { status: 500 })
    }
}
