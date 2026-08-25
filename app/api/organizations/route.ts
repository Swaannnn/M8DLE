import { CreateOrganizationDto } from '@/dto/CreateOrganizationDto'
import { UpdateOrganizationDto } from '@/dto/UpdateOrganizationDto'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import ApiErrorCode from '@/constants/apiErrorCodes'

export async function GET() {
    try {
        const orgs = await prisma.organization.findMany({
            orderBy: { name: 'asc' },
        })
        return NextResponse.json(orgs)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorCode.FETCH_FAILED }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: ApiErrorCode.UNAUTHORIZED }, { status: 401 })
        }

        const content = CreateOrganizationDto.parse(await req.json())
        const created = await prisma.organization.create({
            data: {
                name: content.name,
                imageUrl: content.imageUrl,
            },
        })

        return NextResponse.json(created, { status: 201 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: ApiErrorCode.BAD_REQUEST }, { status: 400 })
        }

        console.error(error)
        return NextResponse.json({ error: ApiErrorCode.CREATE_FAILED }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: ApiErrorCode.UNAUTHORIZED }, { status: 401 })
        }

        const content = UpdateOrganizationDto.parse(await req.json())

        const updated = await prisma.organization.update({
            where: { id: content.id },
            data: {
                name: content.name,
                imageUrl: content.imageUrl,
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

        const id = req.nextUrl.searchParams.get('organizationId') || req.nextUrl.searchParams.get('orgId')
        if (!id) {
            return NextResponse.json({ error: ApiErrorCode.MISSING_PARAMETER }, { status: 400 })
        }

        if (!(await prisma.organization.findUnique({ where: { id } }))) {
            return NextResponse.json({ error: ApiErrorCode.NOT_FOUND }, { status: 404 })
        }

        // Delete associated OrganizationPlayer join records before deleting organization
        await prisma.organizationPlayer.deleteMany({
            where: { organizationId: id },
        })

        await prisma.organization.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: ApiErrorCode.DELETE_FAILED }, { status: 500 })
    }
}
