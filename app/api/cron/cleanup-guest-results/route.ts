import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import ApiErrorKey from '@/constants/apiErrorKeys'

const GUEST_RESULT_RETENTION_DAYS = 30

/**
 * Supprime les parties invité jamais rattachées à un compte au-delà du délai de rétention
 * (les Attempt suivent en cascade). Déclenché par le Cron Job Vercel défini dans vercel.json,
 * qui injecte `Authorization: Bearer ${CRON_SECRET}`.
 */
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: ApiErrorKey.UNAUTHORIZED }, { status: 401 })
    }

    try {
        const retentionThreshold = new Date()
        retentionThreshold.setDate(retentionThreshold.getDate() - GUEST_RESULT_RETENTION_DAYS)

        const { count } = await prisma.dailyM8DLEResult.deleteMany({
            where: {
                guestId: { not: null },
                date: { lt: retentionThreshold },
            },
        })

        return NextResponse.json({ deleted: count })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.INTERNAL_ERROR }, { status: 500 })
    }
}
