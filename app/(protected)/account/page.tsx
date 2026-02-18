'use client'

import { useAuth } from '@/hooks/use-auth'
import { AbsoluteCenter, Button, Image, Spinner, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import defaultAvatar from '@/public/images/default_avatar.jpg'

const AccountPage = () => {
    const { user, loading, logout, loggedOut } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && loggedOut) {
            router.push('/login')
        }
    }, [loading, loggedOut, router])

    if (loading)
        return (
            <AbsoluteCenter>
                <Spinner size="xl" />
            </AbsoluteCenter>
        )
    if (!user) return null

    return (
        <VStack>
            <Text>Mon Compte</Text>
            <Text>
                Compte créé le{' '}
                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </Text>
            <Image src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png` : defaultAvatar.src} alt="user avatar" className="w-24 h-24 rounded-full" />
            <Text>{user.username}</Text>
            <Button onClick={logout}>Se déconnecter</Button>
        </VStack>
    )
}

export default AccountPage
