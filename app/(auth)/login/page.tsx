'use client'

import LoginDiscord from '@/components/LoginDiscord'
import { tuskerGrotesk } from '@/utils/fontUtils'
import { Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

const LoginPage = () => {
    const t = useTranslations('login')

    return (
        <VStack
            gap="1rem"
            w="90vw"
            mx="auto"
        >
            <Text
                as="h1"
                fontSize={{ base: '2.5rem', md: '4rem' }}
                className={tuskerGrotesk.className}
            >
                {t('loginFullCaps')}
            </Text>
            <LoginDiscord />
        </VStack>
    )
}

export default LoginPage
