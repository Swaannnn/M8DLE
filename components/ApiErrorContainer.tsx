import { Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { ApiError, translateApiError } from '@/utils/apiError'

export const ApiErrorContainer = ({ error }: { error: ApiError }) => {
    const t = useTranslations('error')
    const message = translateApiError(t, error)

    return (
        <VStack
            w="90vw"
            maxW="1200px"
            mx="auto"
            gap="1rem"
        >
            <Text
                as="h1"
                fontSize={{ base: '2.5rem', md: '4rem' }}
            >
                {error.statusCode} - {message}
            </Text>
        </VStack>
    )
}
