import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import ApiErrorKey from '@/constants/apiErrorKeys'

export async function GET() {
    try {
        const config = await prisma.appConfig.findUnique({
            where: { key: 'lastPlayerUpdate' },
        })

        return NextResponse.json({ date: config?.value ?? null })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.FETCH_FAILED }, { status: 500 })
    }
}
