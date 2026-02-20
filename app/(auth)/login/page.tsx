'use client'

import DiscordIcon from '@/components/icons/Discord'
import { useColorMode } from '@/components/ui/color-mode'
import { Button, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import localFont from 'next/font/local'

const tuskerGrotesk = localFont({
    src: '../../fonts/TuskerGrotesk-4800Super.woff2',
})

const LoginPage = () => {
    const router = useRouter()
    const { colorMode } = useColorMode()
    return (
        <VStack gap="1rem">
            <Text
                fontSize="4rem"
                className={tuskerGrotesk.className}
            >
                CONNEXION
            </Text>
            <Text>Connectez-vous pour accéder à votre compte et faire vos prédictions.</Text>
            <Button onClick={() => router.push('/api/auth/login')}>
                <DiscordIcon color={colorMode === 'light' ? 'white' : 'black'} />
                Se connecter avec Discord
            </Button>
        </VStack>
    )
}

export default LoginPage
