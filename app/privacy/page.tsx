'use client'

import { tuskerGrotesk } from '@/utils/fontUtils'
import { Heading, List, Stack, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const Privacy = () => {
    const t = useTranslations('privacy')

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
                    <Heading size="lg">{t('dataCollectedTitle')}</Heading>
                    <Text>{t('dataCollectedIntro')}</Text>
                    <List.Root>
                        <List.Item>
                            <strong>{t('identityLabel')}</strong> {t('identityText')}
                        </List.Item>
                        <List.Item>
                            <strong>{t('gameDataLabel')}</strong> {t('gameDataText')}
                        </List.Item>
                        <List.Item>
                            <strong>{t('analyticsLabel')}</strong> {t('analyticsText')}
                        </List.Item>
                    </List.Root>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('purposeTitle')}</Heading>
                    <Text>{t('purposeIntro')}</Text>
                    <List.Root>
                        <List.Item>{t('purposeItem1')}</List.Item>
                        <List.Item>{t('purposeItem2')}</List.Item>
                        <List.Item>{t('purposeItem3')}</List.Item>
                    </List.Root>
                    <Text>{t('purposeOutro')}</Text>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('sharingTitle')}</Heading>
                    <List.Root>
                        <List.Item>{t('sharingItem1')}</List.Item>
                        <List.Item>{t('sharingItem2')}</List.Item>
                    </List.Root>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('cookiesTitle')}</Heading>
                    <List.Root>
                        <List.Item>{t('cookiesItem1')}</List.Item>
                        <List.Item>{t('cookiesItem2')}</List.Item>
                        <List.Item>{t('cookiesItem3')}</List.Item>
                    </List.Root>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('rightsTitle')}</Heading>
                    <Text>{t('rightsIntro')}</Text>
                    <List.Root>
                        <List.Item>
                            <strong>{t('accessLabel')}</strong> {t('accessText')}
                        </List.Item>
                        <List.Item>
                            <strong>{t('rectifyLabel')}</strong> {t('rectifyText')}
                        </List.Item>
                        <List.Item>
                            <strong>{t('deleteLabel')}</strong> {t('deleteText')}
                        </List.Item>
                        <List.Item>
                            <strong>{t('portabilityLabel')}</strong> {t('portabilityText')}
                        </List.Item>
                    </List.Root>
                    <Text>
                        {t('contactPrefix')}{' '}
                        <Link
                            href="mailto:swanngille@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t('contactAriaLabel')}
                        >
                            swanngille@gmail.com
                        </Link>
                    </Text>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('securityTitle')}</Heading>
                    <List.Root>
                        <List.Item>{t('securityItem1')}</List.Item>
                        <List.Item>{t('securityItem2')}</List.Item>
                    </List.Root>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('minorsTitle')}</Heading>
                    <List.Root>
                        <List.Item>{t('minorsItem1')}</List.Item>
                        <List.Item>{t('minorsItem2')}</List.Item>
                    </List.Root>
                </Stack>
                <Stack>
                    <Heading size="lg">{t('changesTitle')}</Heading>
                    <List.Root>
                        <List.Item>{t('changesItem1')}</List.Item>
                        <List.Item>{t('changesItem2')}</List.Item>
                        <List.Item>{t('changesItem3')}</List.Item>
                    </List.Root>
                </Stack>
            </Stack>
        </VStack>
    )
}

export default Privacy
