// proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import type { Role } from '@prisma/client'
import { getSession } from './lib/auth/session'
import { isInMaintenanceMode } from './lib/maintenance'

// Import de type seulement : importer la valeur embarquerait le client Prisma dans le proxy.
const ADMIN_ROLE: Role = 'ADMIN'

/**
 * Mode maintenance des pages.
 */
export default async function middleware(req: NextRequest) {
    if (isInMaintenanceMode() && (await getSession())?.role !== ADMIN_ROLE) {
        return NextResponse.rewrite(new URL('/maintenance', req.url), { status: 503 })
    }

    if (req.nextUrl.pathname === '/maintenance') {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|credits|privacy|legal).*)'],
}
