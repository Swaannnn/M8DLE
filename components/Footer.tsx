'use client'

import { HStack, Link, Text, useBreakpointValue } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

const Footer = () => {
    const isMobile = useBreakpointValue({ base: true, md: false })
    const t = useTranslations('header')

    return (
        !isMobile && (
            <HStack
                width="100%"
                padding="1rem 10vw"
                justifyContent="space-between"
                position="fixed"
                bottom="0"
                bg="bg"
                zIndex="100"
                borderTopWidth="1px"
                borderColor="fg"
            >
                <Text>© 2026 M8DLE</Text>
                <Link asChild>
                    <NextLink href="/credits">{t('credits')}</NextLink>
                </Link>
                <Link asChild>
                    <NextLink href="/privacy">{t('privacyPolicy')}</NextLink>
                </Link>
                <Link asChild>
                    <NextLink href="/legal">{t('legalNotice')}</NextLink>
                </Link>
            </HStack>
        )
    )
}

export default Footer
