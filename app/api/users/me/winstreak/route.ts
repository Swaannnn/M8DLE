import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import ApiErrorKey from '@/constants/apiErrorKeys'
import { computeWinstreak } from '@/utils/winstreakUtils'

export async function GET() {
    try {
        const session = await getSession()
        if (!session || !session.userId) {
            return NextResponse.json({ error: ApiErrorKey.UNAUTHORIZED }, { status: 401 })
        }

        const winstreak = await computeWinstreak(session.userId)

        return NextResponse.json({ winstreak })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.FETCH_FAILED }, { status: 500 })
    }
}
