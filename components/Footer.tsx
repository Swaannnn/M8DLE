'use client'

import { HStack, Link, Text, useBreakpointValue } from '@chakra-ui/react'
import NextLink from 'next/link'

const Footer = () => {
    const isMobile = useBreakpointValue({ base: true, md: false })

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
                    <NextLink href="/credits">Crédits</NextLink>
                </Link>
                <Link asChild>
                    <NextLink href="/privacy">Politique de confidentialité</NextLink>
                </Link>
                <Link asChild>
                    <NextLink href="/legal">Mentions légales</NextLink>
                </Link>
            </HStack>
        )
    )
}

export default Footer
