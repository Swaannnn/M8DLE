'use client'

import { tuskerGrotesk } from '@/lib/fonts'
import { Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

const MaintenancePage = () => {
    const t = useTranslations('maintenance')

    return (
        <VStack
            w={{ base: '90vw', md: '50vw' }}
            mx="auto"
            gap="1rem"
        >
            <Text
                as="h1"
                fontSize={{ base: '2.5rem', md: '4rem' }}
                className={tuskerGrotesk.className}
                textAlign="center"
            >
                {t('title')}
            </Text>
            <Text textAlign="center">{t('message')}</Text>
        </VStack>
    )
}

export default MaintenancePage
