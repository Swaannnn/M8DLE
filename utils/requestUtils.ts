import { NextRequest } from 'next/server'

/**
 * Récupère sous forme de number un paramètre
 * en requête.
 *
 * @param request Requête
 * @param key Clé du paramètre
 * @param replace Valeur de remplacement si paramètre indéfini
 * @returns Valeur du paramètre
 */
export function getNumberParamFromRequest(request: NextRequest, key: string, replace: number): number {
    const param = request.nextUrl.searchParams.get(key)
    if (!param) return replace

    const num = +param
    if (isNaN(num)) {
        return replace
    }

    return num
}
