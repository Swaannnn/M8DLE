'use client'

import { useAuth } from '@/hooks/use-auth'
import { AbsoluteCenter, Button, Image, Separator, Spinner, Stack, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import localFont from 'next/font/local'
import CurrentMonthCalendar from '@/components/CurrentMonthCalendar'
import useSWR from 'swr'
import { DailyResult } from '@/types/dailyResult'
import { fetcher } from '@/utils/fetcher'
import { ApiError } from 'next/dist/server/api-utils'
import { ApiErrorContainer } from '@/components/ApiErrorContainer'
import { useEffect } from 'react'
import { getProfileAvatar } from '@/utils/userUtils'

const tuskerGrotesk = localFont({
    src: '../../fonts/TuskerGrotesk-4800Super.woff2',
})

const AccountPage = () => {
    const { user, loading: userLoading, logout, loggedOut } = useAuth()
    const { data, error, isLoading } = useSWR<any, ApiError>(
        !userLoading && !loggedOut ? '/api/users/me/results' : null,
        fetcher
    )
    const router = useRouter()

    useEffect(() => {
        if (!userLoading && loggedOut) {
            router.push('/login')
        }
    }, [userLoading, loggedOut, router])

    if (userLoading || isLoading) {
        return (
            <AbsoluteCenter>
                <Spinner size="xl" />
            </AbsoluteCenter>
        )
    }

    const datas: DailyResult[] = data?.results || []

    if (error && error.statusCode >= 500) {
        return <ApiErrorContainer error={error} />
    }

    if (!user || loggedOut) return null
    
    const avatarUrl = getProfileAvatar(user)
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
