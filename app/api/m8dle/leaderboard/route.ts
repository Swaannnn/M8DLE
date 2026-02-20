import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                discordId: true,
                avatar: true,
                dailyResults: {
                    select: { attempts: true, success: true },
                },
            },
        })

        const stats = users.map((u) => {
            const wins = u.dailyResults.filter((dr) => dr.success).length
            const totalAttempts = u.dailyResults.reduce(
                (acc, dr) => acc + (Array.isArray(dr.attempts) ? dr.attempts.length : 0),
                0
            )
            const averageAttempts = u.dailyResults.length > 0 ? totalAttempts / u.dailyResults.length : 0

            return {
                id: u.id,
                username: u.username,
                discordId: u.discordId,
                avatar: u.avatar,
                wins,
                averageAttempts: Number(averageAttempts.toFixed(2)),
            }
        })

        stats.sort((a, b) => b.wins - a.wins)

        return NextResponse.json(stats)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
