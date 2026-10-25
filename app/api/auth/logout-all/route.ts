import { getCurrentUser } from '@/lib/auth/currentUser'
import { deleteSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import ApiErrorKey from '@/constants/apiErrorKeys'

/** Déconnecte tous les appareils : incrémenter la version invalide tous les jetons déjà émis. */
export async function POST() {
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: ApiErrorKey.UNAUTHORIZED }, { status: 401 })
    }

    try {
        await prisma.user.update({
            where: { id: user.id },
            data: { sessionVersion: { increment: 1 } },
        })
        await deleteSession()
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.UPDATE_FAILED }, { status: 500 })
    }
}
