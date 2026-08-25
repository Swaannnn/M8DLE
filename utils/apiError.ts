import { useTranslations } from 'next-intl'

/**
 * Erreur API côté client
 */
export class ApiError extends Error {
    readonly statusCode: number
    readonly rel?: string

    constructor(statusCode: number, message: string, rel?: string) {
        super(message)
        this.name = 'ApiError'
        this.statusCode = statusCode
        this.rel = rel
    }
}

/**
 * error.message est censé être un code (voir constants/apiErrorCodes.ts). Si ce n'est pas
 * une clé connue (route non migrée, erreur réseau...), on retombe sur le message brut.
 */
export function translateApiError(t: ReturnType<typeof useTranslations<'error'>>, error: ApiError): string {
    return t.has(error.message) ? t(error.message) : error.message
}
