import { getSession } from '@/lib/auth/session'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    const session = await getSession()

    if (!session?.userId) {
        return NextResponse.json({ user: null })
    }

    // Récupérer les infos complètes de l'utilisateur depuis la base
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            discordId: true,
            username: true,
            email: true,
            avatar: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    return NextResponse.json({ user })
}
