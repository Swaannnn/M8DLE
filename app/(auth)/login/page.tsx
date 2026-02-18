'use client'

import DiscordIcon from '@/components/icons/Discord'
import { useColorMode } from '@/components/ui/color-mode'
import { Button, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
    const router = useRouter()
    const { colorMode } = useColorMode()
    return (
        <VStack>
            <Text>Connexion</Text>
            <Text>Connectez-vous pour accéder à votre compte et faire vos prédictions.</Text>
            <Button onClick={() => router.push('/api/auth/login')}>
                <DiscordIcon color={colorMode === 'light' ? 'white' : 'black'} />
                Se connecter avec Discord
            </Button>
        </VStack>
    )
}

export default LoginPage
