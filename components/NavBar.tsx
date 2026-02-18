'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button, HStack } from '@chakra-ui/react'
import { ColorModeButton } from './ui/color-mode'
import { useRouter } from 'next/navigation'

const NavBar = () => {
    const { user, loading } = useAuth()
    const router = useRouter()

    return (
        !loading && (
            <HStack justify="space-between" padding="1rem 2rem">
                <HStack gap="1rem">
                    <Button variant="ghost" onClick={() => router.push('/')}>
                        Accueil
                    </Button>
                </HStack>
                <HStack gap="1rem">
                    {user ? (
                        <Button variant="ghost" onClick={() => router.push('/account')}>
                            Mon Compte
                        </Button>
                    ) : (
                        <Button variant="ghost" onClick={() => router.push('/login')}>
                            Se connecter
                        </Button>
                    )}
                    <ColorModeButton />
                </HStack>
            </HStack>
        )
    )
}

export default NavBar
