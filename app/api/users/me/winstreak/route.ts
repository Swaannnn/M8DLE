import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/currentUser'
import ApiErrorKey from '@/constants/apiErrorKeys'
import { computeWinstreak } from '@/utils/winstreakUtils'

export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: ApiErrorKey.UNAUTHORIZED }, { status: 401 })
        }

        const winstreak = await computeWinstreak(user.id)

        return NextResponse.json({ winstreak })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.FETCH_FAILED }, { status: 500 })
    }
}
