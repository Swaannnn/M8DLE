import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { decrypt } from '@/lib/auth/jwt'
import { cookies } from 'next/headers'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('session')?.value

        if (!token) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const payload = await decrypt(token)
        if (!payload || !payload.userId) {
            return NextResponse.json({ error: 'Session invalide' }, { status: 401 })
        }

        const results = await prisma.dailyM8DLEResult.findMany({
            where: {
                userId: payload.userId,
            },
            orderBy: {
                date: 'desc',
            },
        })

        return NextResponse.json({ results })
    } catch (error) {
        console.error('Error fetching user results:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des résultats' },
            { status: 500 }
        )
    }
}
