import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/** Récupère un utilisateur via son identifiant */
export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
        return NextResponse.json({ error: 'Paramter "id" is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
}

/** Modifie un utilisateur via son identifiant,*/
export async function PATCH(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
        return NextResponse.json({ error: 'Parameter "id" is required' }, { status: 400 })
    }

    try {
        const body = await request.json()
        const user = await prisma.user.update({
            where: { id },
            data: {
                role: body.role,
            },
        })
        return NextResponse.json(user)
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}

/** Supprime un utilisateur via son identifiant */
export async function DELETE(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
        return NextResponse.json({ error: 'Parameter "id" is required' }, { status: 400 })
    }

    try {
        await prisma.user.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }
}
