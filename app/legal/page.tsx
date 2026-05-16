'use client'

import { tuskerGrotesk } from '@/utils/fontUtils'
import { Heading, Stack, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const Legal = () => {
    const t = useTranslations('legal')

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
                    <Heading size="lg">{t('editorTitle')}</Heading>
                    <Text>{t('editorName')}</Text>
                    <Text>{t('editorLocation')}</Text>
                    <Link
                        href="mailto:swanngille@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('contactAriaLabel')}
                    >
                        swanngille@gmail.com
                    </Link>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('hostTitle')}</Heading>
                    <Text>{t('hostName')}</Text>
                    <Text>
                        {t('websiteLabel')}{' '}
                        <Link
                            href="https://vercel.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t('vercelAriaLabel')}
                        >
                            https://vercel.com
                        </Link>
                    </Text>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('ipTitle')}</Heading>
                    <Text>{t('ipText1')}</Text>
                    <Text>
                        <strong>{t('importantLabel')}</strong>
                    </Text>
                    <Text>{t('ipText2')}</Text>
                    <Text>{t('ipText3')}</Text>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('dataTitle')}</Heading>
                    <Text>{t('dataText1')}</Text>
                    <Text>{t('dataText2')}</Text>
                    <Text>{t('dataText3')}</Text>
                    <Text>{t('dataText4')}</Text>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('liabilityTitle')}</Heading>
                    <Text>{t('liabilityText')}</Text>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('linksTitle')}</Heading>
                    <Text>{t('linksText')}</Text>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('lawTitle')}</Heading>
                    <Text>{t('lawText')}</Text>
                </Stack>
            </Stack>
        </VStack>
    )
}

export default Legal
