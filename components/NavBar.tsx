'use client'

import { useAuth } from '@/hooks/use-auth'
import { HStack, Link } from '@chakra-ui/react'
import { ColorModeButton } from './ui/color-mode'
import { useRouter } from 'next/navigation'

const NavBar = () => {
    const { user, loading } = useAuth()
    const router = useRouter()

    return (
        !loading && (
            <HStack
                width="100%"
                position="fixed"
                top="0"
                justify="space-between"
                bg="bg"
                padding="1rem 2rem"
                borderBottomWidth="1px"
                borderColor="fg"
                zIndex="100"
            >
                <HStack gap="1rem">
                    <Link onClick={() => router.push('/')}>Accueil</Link>
                </HStack>
                <HStack gap="1rem">
                    <Link onClick={() => router.push('/leaderboard')}>Classement</Link>
                    {user ? (
                        <Link onClick={() => router.push('/account')}>Mon Compte</Link>
                    ) : (
                        <Link onClick={() => router.push('/login')}>Se connecter</Link>
                    )}
                    <ColorModeButton />
                </HStack>
            </HStack>
        )
    )
}

export default NavBar
