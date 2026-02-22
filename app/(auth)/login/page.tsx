'use client'

import DiscordIcon from '@/components/icons/Discord'
import { useColorMode } from '@/components/ui/color-mode'
import { Button, Link, Text, VStack } from '@chakra-ui/react'
import localFont from 'next/font/local'
import NextLink from 'next/link'

const tuskerGrotesk = localFont({
    src: '../../fonts/TuskerGrotesk-4800Super.woff2',
})

const LoginPage = () => {
    const { colorMode } = useColorMode()
    return (
        <VStack gap="1rem">
            <Text
                as="h1"
                fontSize="4rem"
                className={tuskerGrotesk.className}
            >
                CONNEXION
            </Text>
            <Text>Connectez-vous pour accéder à votre compte et faire vos prédictions.</Text>
            <Button asChild>
                <NextLink href="/api/auth/login">
                    <DiscordIcon color={colorMode === 'light' ? 'white' : 'black'} />
                    Se connecter avec Discord
                </NextLink>
            </Button>
        </VStack>
    )
}

export default LoginPage
