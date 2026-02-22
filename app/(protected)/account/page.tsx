'use client'

import { useAuth } from '@/hooks/use-auth'
import { AbsoluteCenter, Button, Image, Spinner, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import defaultAvatar from '@/public/images/default_avatar.jpg'
import localFont from 'next/font/local'

const tuskerGrotesk = localFont({
    src: '../../fonts/TuskerGrotesk-4800Super.woff2',
})

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

    const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
        : defaultAvatar.src

    return (
        <VStack
            w="90vw"
            mx="auto"
        >
            <Text
                as="h1"
                fontSize={{ base: '2.5rem', md: '4rem' }}
                className={tuskerGrotesk.className}
            >
                MON COMPTE
            </Text>
            <Text>
                Membre depuis le{' '}
                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </Text>
            <Image
                src={avatarUrl}
                alt="user avatar"
                className="w-24 h-24 rounded-full"
            />
            <Text>{user.username}</Text>
            <Button onClick={logout}>Se déconnecter</Button>
            <div style={{ height: '200vh' }}></div>
        </VStack>
    )
}

export default AccountPage
