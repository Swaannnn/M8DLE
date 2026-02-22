'use client'

import { useAuth } from '@/hooks/use-auth'
import {
    AbsoluteCenter,
    Button,
    HStack,
    Image,
    Separator,
    Spinner,
    Stack,
    StackSeparator,
    Text,
    useBreakpointValue,
    VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import defaultAvatar from '@/public/images/default_avatar.jpg'
import localFont from 'next/font/local'
import CurrentMonthCalendar from '@/components/CurrentMonthCalendar'
import useSWR from 'swr'
import { DailyResult } from '@/types/dailyResult'

const tuskerGrotesk = localFont({
    src: '../../fonts/TuskerGrotesk-4800Super.woff2',
})

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const AccountPage = () => {
    const { user, loading: userLoading, logout, loggedOut } = useAuth()
    const { data, isLoading } = useSWR('/api/users/me/results', fetcher)
    const router = useRouter()
    const isMobile = useBreakpointValue({ base: true, md: false })

    const datas: DailyResult[] = data?.results || []

    useEffect(() => {
        if (!userLoading && loggedOut) {
            router.push('/login')
        }
    }, [userLoading, loggedOut, router])

    if (userLoading || isLoading)
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
            gap="2rem"
        >
            <Text
                as="h1"
                fontSize={{ base: '2.5rem', md: '4rem' }}
                className={tuskerGrotesk.className}
            >
                MON COMPTE
            </Text>

            <Stack
                gap="2rem"
                direction={{ base: 'column', md: 'row' }}
                align="center"
            >
                <VStack>
                    <Image
                        src={avatarUrl}
                        alt="user avatar"
                        className="w-24 h-24 rounded-full"
                    />
                    <Text fontSize="lg">{user.username}</Text>
                    <Text fontSize="sm">
                        Membre depuis le{' '}
                        {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>
                </VStack>
                <Separator />
                <CurrentMonthCalendar datas={datas} />
            </Stack>

            <Button
                size="sm"
                onClick={logout}
                position={{ base: 'relative', md: 'absolute' }}
                right={{ md: '4rem' }}
            >
                Se déconnecter
            </Button>
        </VStack>
    )
}

export default AccountPage
