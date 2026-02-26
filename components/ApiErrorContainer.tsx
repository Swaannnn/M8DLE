import { Text, VStack } from '@chakra-ui/react'
import { ApiError } from 'next/dist/server/api-utils'
import localFont from 'next/font/local'

export const ApiErrorContainer = ({ error }: { error: ApiError }) => {
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
                {error.statusCode} - {error.message}
            </Text>
        </VStack>
    )
}
