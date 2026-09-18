import { NextRequest } from 'next/server'

/**
 * Récupère sous forme de number un paramètre en requête.
 *
 * Seuls les entiers finis sont acceptés : une conversion brute laisserait passer 'Infinity',
 * '1e999' ou un décimal, autant de valeurs qui font échouer un `skip` / `take` Prisma chez
 * l'appelant (et donc répondre 500 sur une query string malformée).
 *
 * @param request Requête
 * @param key Clé du paramètre
 * @param replace Valeur de remplacement si le paramètre est absent ou inexploitable
 * @returns Valeur du paramètre
 */
export function getNumberParamFromRequest(request: NextRequest, key: string, replace: number): number {
    const param = request.nextUrl.searchParams.get(key)
    if (!param) return replace

    const num = Number(param)

    return Number.isSafeInteger(num) ? num : replace
}
