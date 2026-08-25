import { UpdateUserDto } from '@/dto/UpdateUserDto'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import ApiErrorCode from '@/constants/apiErrorCodes'

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(users)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorCode.FETCH_FAILED }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: ApiErrorCode.UNAUTHORIZED }, { status: 401 })
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
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: ApiErrorCode.BAD_REQUEST }, { status: 400 })
        }

        console.error(error)
        return NextResponse.json({ error: ApiErrorCode.UPDATE_FAILED }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: ApiErrorCode.UNAUTHORIZED }, { status: 401 })
        }

        const id = req.nextUrl.searchParams.get('userId')
        if (!id) {
            return NextResponse.json({ error: ApiErrorCode.MISSING_PARAMETER }, { status: 400 })
        }

        if (!(await prisma.user.findUnique({ where: { id } }))) {
            return NextResponse.json({ error: ApiErrorCode.NOT_FOUND }, { status: 404 })
        }

        // Daily results have onDelete: Cascade, so delete user directly
        await prisma.user.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: ApiErrorCode.DELETE_FAILED }, { status: 500 })
    }
}
