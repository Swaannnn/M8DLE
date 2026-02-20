import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    try {
        const count = await prisma.dailyM8DLEResult.count({
            where: { success: true },
        })

        return NextResponse.json({ successCount: count })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
