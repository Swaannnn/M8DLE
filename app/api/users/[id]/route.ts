import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const user = await prisma.user.findUnique({
        where: { id },
    })

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    try {
        await prisma.user.delete({
            where: { id },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }
}
