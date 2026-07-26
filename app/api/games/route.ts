import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const games = await prisma.game.findMany()
        return NextResponse.json(games)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 })
    }
}
