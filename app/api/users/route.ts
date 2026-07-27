import { UpdateUserDto } from '@/dto/UpdateUserDto'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(users)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const content = UpdateUserDto.parse(await req.json())

        const updated = await prisma.user.update({
            where: { id: content.id },
            data: {
                username: content.username,
                email: content.email,
                role: content.role,
            },
        })

        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const id = req.nextUrl.searchParams.get('userId')
        if (!id) {
            return NextResponse.json({ error: 'Parameter "userId" is required' }, { status: 400 })
        }

        if (!(await prisma.user.findUnique({ where: { id } }))) {
            return NextResponse.json({ error: 'User does not exist' }, { status: 400 })
        }

        // Daily results have onDelete: Cascade, so delete user directly
        await prisma.user.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }
}
