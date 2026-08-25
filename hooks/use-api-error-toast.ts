'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ApiError } from 'next/dist/server/api-utils'
import { toaster } from '@/components/ui/toaster'

/**
 * error.message est censé être un code (voir constants/apiErrorCodes.ts). Si ce n'est pas
 * une clé connue (route non migrée, erreur réseau...), on retombe sur le message brut.
 */
function translateApiError(t: ReturnType<typeof useTranslations<'error'>>, error: ApiError): string {
    return t.has(error.message) ? t(error.message) : error.message
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

        toaster.create({
            description: translateApiError(t, error),
            type: 'error',
            closable: true,
        })
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

            toaster.create({
                description,
                type: 'error',
                closable: true,
            })
        },
        [t]
    )
}
