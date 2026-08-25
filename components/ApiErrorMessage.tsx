import { Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { ApiError } from 'next/dist/server/api-utils'

/**
 * Message d'erreur inline (texte rouge), pour les erreurs API non-5xx.
 * Contrairement à ApiErrorContainer, n'occupe pas tout l'écran : le reste
 * de la page reste affiché autour.
 */
export const ApiErrorMessage = ({ error }: { error: ApiError }) => {
    const t = useTranslations('error')
    const message = t.has(error.message) ? t(error.message) : error.message

    return (
        <Text
            color="red.500"
            role="alert"
        >
            {message}
        </Text>
    )
}
