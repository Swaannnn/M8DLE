import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Healthcheck utilisé par Docker / Coolify. Ne touche pas à la base pour ne pas
 * faire tomber le conteneur sur une indisponibilité passagère de la DB.
 */
export function GET() {
    return NextResponse.json({ status: 'ok' })
}
