import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/** Récupère un utilisateur via son identifiant */
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {    
    const id = (await params).id
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
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.role != "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const id = (await params).id
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
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.role != "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const id = (await params).id
    if (!id) {
        return NextResponse.json({ error: 'Parameter "id" is required' }, { status: 400 })
    }

    try {
        const user = await prisma.user.findUnique({ where: { id } })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const deleted = await prisma.user.delete({ where: { id }, select: { discordId: true, username: true } })

        return NextResponse.json(deleted)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }
}
