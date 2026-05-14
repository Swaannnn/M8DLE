'use client'

import { tuskerGrotesk } from '@/utils/fontUtils'
import { Heading, List, Stack, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const Credits = () => {
    const t = useTranslations('credits')

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
            <Stack gap="2rem">
                <Stack>
                    <Heading size="lg">{t('developmentTitle')}</Heading>
                    <List.Root>
                        <List.Item>{t('developmentItem1')}</List.Item>
                        <List.Item>{t('developmentItem2')}</List.Item>
                        <List.Item>{t('developmentItem3')}</List.Item>
                        <List.Item>{t('developmentItem4')}</List.Item>
                    </List.Root>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('designTitle')}</Heading>
                    <List.Root>
                        <List.Item>{t('designItem1')}</List.Item>
                        <List.Item>
                            {t('iconsLabel')}{' '}
                            <Link
                                href="https://lucide.dev/icons/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t('lucideAriaLabel')}
                            >
                                Lucide
                            </Link>
                            .
                        </List.Item>
                    </List.Root>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('techTitle')}</Heading>
                    <List.Root>
                        <List.Item>{t('techItem1')}</List.Item>
                        <List.Item>{t('techItem2')}</List.Item>
                        <List.Item>{t('techItem3')}</List.Item>
                        <List.Item>{t('techItem4')}</List.Item>
                        <List.Item>{t('techItem5')}</List.Item>
                    </List.Root>
                </Stack>
            </Stack>
        </VStack>
    )
}

export default Credits
