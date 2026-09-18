import { useTranslations } from 'next-intl'

/**
 * Erreur API côté client
 */
export class ApiError extends Error {
    readonly statusCode: number

    constructor(statusCode: number, message: string) {
        super(message)
        this.name = 'ApiError'
        this.statusCode = statusCode
    }
}

/**
 * error.message est censé être un code (voir constants/apiErrorKeys.ts). Si ce n'est pas
 * une clé connue (route non migrée, erreur réseau...), on retombe sur le message brut.
 */
export function translateApiError(t: ReturnType<typeof useTranslations<'error'>>, error: ApiError): string {
    return t.has(error.message) ? t(error.message) : error.message
}

export async function fetcher<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, init)

    if (!res.ok) {
        // Les routes API renvoient { error: string } en cas d'échec (voir NextResponse.json({ error: ... })).
        // On récupère ce message pour l'afficher tel quel (toast / message inline) plutôt que le statusText générique.
        let message: string = res.statusText
        try {
            const body = await res.json()
            if (typeof body?.error === 'string') {
                message = body.error
            }
        } catch {
            // Corps de réponse absent ou non-JSON : on garde le statusText
        }

        throw new ApiError(res.status, message)
    }

    // Une réponse sans corps (204, DELETE...) n'est pas du JSON : `res.json()` lèverait.
    // L'appelant type alors `T` en conséquence.
    const body = await res.text()
    return (body ? JSON.parse(body) : undefined) as T
}
