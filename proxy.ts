import { decrypt } from '@/lib/auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// 1. Specify protected routes
const protectedRoutes = ['/api/users']

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

    if (isProtectedRoute) {
        // 3. Decrypt the session from the cookie
        const cookie = req.cookies.get('session')?.value
        const session = await decrypt(cookie)

        // 4. Redirect to /login if the user is not authenticated
        if (!session?.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
