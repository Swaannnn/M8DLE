import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const orgs = await prisma.organization.findMany()
        return NextResponse.json(orgs)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 })
    }
}
