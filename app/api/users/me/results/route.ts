import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

export async function GET() {
    try {
        const session = await getSession()
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Accès non-autorisé' }, { status: 401 })
        }

        const results = await prisma.dailyM8DLEResult.findMany({
            where: {
                userId: session.userId,
            },
            orderBy: {
                date: 'desc',
            },
        })

        return NextResponse.json({ results })
    } catch (error) {
        console.error('Error fetching user results:', error)
        return NextResponse.json({ error: 'Erreur lors de la récupération des résultats' }, { status: 500 })
    }
}
