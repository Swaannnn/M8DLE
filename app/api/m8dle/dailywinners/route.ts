import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getGameDate } from '@/utils/dateUtils'
import ApiErrorKey from '@/constants/apiErrorKeys'
import dayjs from 'dayjs'

export async function GET() {
    try {
        const startOfDay = getGameDate()
        const endOfDay = dayjs.utc(startOfDay).add(1, 'day').toDate()

        const count = await prisma.dailyM8DLEResult.count({
            where: {
                success: true,
                date: {
                    gte: startOfDay,
                    lt: endOfDay,
                },
            },
        })

        return NextResponse.json({ successCount: count })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.INTERNAL_ERROR }, { status: 500 })
    }
}
