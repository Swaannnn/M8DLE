import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getGameDate } from '@/utils/dateUtils'

export async function GET() {
    try {
        const startOfDay = getGameDate()

        const endOfDay = new Date(startOfDay)
        endOfDay.setDate(endOfDay.getDate() + 1)

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
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
