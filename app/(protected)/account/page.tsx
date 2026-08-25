'use client'

import { useAuth } from '@/hooks/use-auth'
import { AbsoluteCenter, Button, HStack, Image, Separator, Spinner, Stack, Text, VStack } from '@chakra-ui/react'
import CurrentMonthCalendar from '@/components/CurrentMonthCalendar'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import { ApiError } from 'next/dist/server/api-utils'
import { ApiErrorContainer } from '@/components/ApiErrorContainer'
import { ApiErrorMessage } from '@/components/ApiErrorMessage'
import { useApiErrorToast } from '@/hooks/use-api-error-toast'
import { useEffect, useState } from 'react'
import { getProfileAvatar } from '@/utils/userUtils'
import { tuskerGrotesk } from '@/utils/fontUtils'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { IconButton } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { DailyM8DLEResultWithAttemptsCount } from '@/types/m8dleResults'
import { getMonthIndex } from '@/utils/dateUtils'

const AccountPage = () => {
    const { user, loading: userLoading, logout, loggedOut } = useAuth()
    const t = useTranslations('account')
    const locale = useLocale()
    const router = useRouter()
    const now = new Date()
    now.setDate(1)
    const [selectedDate, setSelectedDate] = useState(now);
    const { data, error, isLoading: resultsLoading } = useSWR<DailyM8DLEResultWithAttemptsCount[], ApiError>(
        !userLoading && !loggedOut
            ? `/api/users/me/results?date=${encodeURIComponent(selectedDate.toISOString())}`
            : null,
        fetcher)

    useApiErrorToast(error)

    const monthName = selectedDate.toLocaleString(locale, { month: 'long' })
    const year = selectedDate.getFullYear()

    const handleNav = (offset: number) => {
        setSelectedDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    }

    useEffect(() => {
        if (!userLoading && loggedOut) {
            router.push('/')
        }
    }, [userLoading, loggedOut, router])

    if (userLoading) {
        return (
            <AbsoluteCenter>
                <Spinner size="xl" />
            </AbsoluteCenter>
        )
    }

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
                {t('accountFullCaps')}
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
                        {t('memberSince')}{' '}
                        {new Date(user.createdAt).toLocaleDateString(locale, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>
                </VStack>
                <Separator />
                <VStack width="350px" height="350px" >
                    {error && <ApiErrorMessage error={error} />}
                    <HStack width="100%" justifyContent="space-between" >
                        <IconButton variant="ghost" disabled={getMonthIndex(selectedDate) <= getMonthIndex(new Date(user.createdAt))} onClick={() => handleNav(-1)}>
                            <LuChevronLeft/>
                        </IconButton>
                        <Text>
                            {t('myVictories')} {monthName} {year}
                        </Text>
                        <IconButton variant="ghost" disabled={getMonthIndex(selectedDate) >= getMonthIndex(now)} onClick={() => handleNav(1)}>
                            <LuChevronRight/>
                        </IconButton>
                    </HStack>
                    <CurrentMonthCalendar results={data ?? []} loading={resultsLoading} date={selectedDate} />
                </VStack>
            </Stack>

            <Button
                size="sm"
                onClick={logout}
                position={{ base: 'relative', md: 'absolute' }}
                right={{ md: '4rem' }}
            >
                {t('logout')}
            </Button>
        </VStack>
    )
}

export default AccountPage
