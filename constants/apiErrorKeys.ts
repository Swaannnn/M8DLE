/**
 * Clés d'erreur communs à toutes les routes API pour le i18n.
 */
const ApiErrorKey = {
    UNAUTHORIZED: 'unauthorized',
    BAD_REQUEST: 'badRequest',
    MISSING_PARAMETER: 'missingParameter',
    NOT_FOUND: 'notFound',
    ALREADY_EXISTS: 'alreadyExists',
    ALREADY_SUCCESS: 'alreadySuccess',
    ALREADY_ATTEMPTED: 'alreadyAttempted',
    METHOD_NOT_ALLOWED: 'methodNotAllowed',
    AUTH_FAILED: 'authFailed',
    FETCH_FAILED: 'fetchFailed',
    CREATE_FAILED: 'createFailed',
    UPDATE_FAILED: 'updateFailed',
    DELETE_FAILED: 'deleteFailed',
    INTERNAL_ERROR: 'internalError',
} as const

export type ApiErrorKey = (typeof ApiErrorKey)[keyof typeof ApiErrorKey]

export default ApiErrorKey
