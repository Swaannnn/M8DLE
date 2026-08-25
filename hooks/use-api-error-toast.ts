'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ApiError, translateApiError } from '@/utils/apiError'
import { toaster } from '@/components/ui/toaster'

/**
 * toaster.create() appelle flushSync en interne (store Zustand de Chakra). L'appeler
 * pendant que React est encore en train de flusher les effets du commit courant lève
 * "flushSync was called from inside a lifecycle method" — ça peut arriver dès qu'une page
 * a plusieurs useEffect au montage, pas seulement en cas de redirection concurrente.
 * On diffère donc toujours l'appel d'un tick (setTimeout) pour sortir de ce cycle.
 */
function createErrorToast(description: string) {
    const timeoutId = setTimeout(() => {
        toaster.create({
            description,
            type: 'error',
            closable: true,
        })
    }, 0)

    return () => clearTimeout(timeoutId)
}

/**
 * Affiche un toast d'erreur pour une erreur API "métier" (statut < 500), déjà connue
 * (ex: le résultat d'un useSWR). Les erreurs serveur (5xx) sont ignorées ici : elles sont
 * gérées séparément par ApiErrorContainer, affiché à la place du contenu de la page.
 *
 * Volontairement opt-in par écran (à appeler avec l'`error` de son propre useSWR) :
 * un usage global au niveau du fetcher toasterait aussi les erreurs "attendues"
 * comme le 401 de /api/auth/me pour un visiteur non connecté.
 *
 * Ne déclenche qu'un seul toast par erreur distincte (évite le spam en cas de
 * retries automatiques de SWR tant que le statut/message ne change pas).
 */
export function useApiErrorToast(error?: ApiError | null) {
    const t = useTranslations('error')
    const lastShownSignature = useRef<string | null>(null)

    useEffect(() => {
        if (!error || error.statusCode >= 500) {
            lastShownSignature.current = null
            return
        }

        const signature = `${error.statusCode}:${error.message}`
        if (lastShownSignature.current === signature) return
        lastShownSignature.current = signature

        return createErrorToast(translateApiError(t, error))
    }, [error, t])
}

/**
 * Variante impérative pour les actions déclenchées par l'utilisateur (submit, delete...) :
 * affiche immédiatement un toast d'erreur à partir de ce que fetcher() a levé, quel que
 * soit le statut (contrairement à useApiErrorToast, une action ratée doit toujours prévenir
 * l'utilisateur, même sur une 500).
 */
export function useShowApiErrorToast() {
    const t = useTranslations('error')

    return useCallback(
        (error: unknown) => {
            const description = error instanceof ApiError ? translateApiError(t, error) : t('internalError')
            createErrorToast(description)
        },
        [t]
    )
}
