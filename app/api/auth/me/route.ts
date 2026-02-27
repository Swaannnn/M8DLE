import { getSession } from '@/lib/auth/session'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { UserProfile } from '@/types/userProfile'

export async function GET() {
    const session = await getSession()

    if (!session?.userId) {
        return NextResponse.json(null)
    }

    // Récupérer les infos complètes de l'utilisateur depuis la base
    const user: UserProfile | null = await prisma.user.findUnique({
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

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
}
