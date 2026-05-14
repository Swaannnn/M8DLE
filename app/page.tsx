'use client'

import { AbsoluteCenter, Spinner, Text, VStack } from '@chakra-ui/react'
import InputPlayersAutocomplete from '@/components/InputPlayersAutocomplete'
import TablePlayers from '@/components/TablePlayers'
import { getPlayerOfTheDay } from '@/utils/playersUtils'
import { useM8dleStatus } from '@/hooks/use-m8dle-status'
import { useAuth } from '@/hooks/use-auth'
import PrecisionDialog from '@/components/PrecisionDialog'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import { pink } from '@/constants/colors'
import { ApiError } from 'next/dist/server/api-utils'
import { ApiErrorContainer } from '@/components/ApiErrorContainer'
import { desirableCalligraphy, tuskerGrotesk } from '@/utils/fontUtils'
import { useTranslations } from 'next-intl'
import DialogWin from '@/components/DialogWin'
import { useEffect, useState } from 'react'
import { getNextGameDate, getTimeLeft } from '@/utils/dateUtils'

const Home = () => {
    const { loading } = useAuth()
    const { selectedPlayers, availablePlayers, win, addAttempt, statusLoading } = useM8dleStatus()
    const { data, error, isLoading, mutate } = useSWR<{ successCount: number }, ApiError>('/api/m8dle/dailywinners', fetcher)
    const t = useTranslations('home')
    const nextGameDateTime = getNextGameDate().getTime()

    const [openWin, setOpenWin] = useState(false)
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(nextGameDateTime))

    const playerOfTheDay = getPlayerOfTheDay()

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(nextGameDateTime))
        }, 1000)

        return () => clearInterval(interval)
    }, [nextGameDateTime])

    const timer = new Date(timeLeft)
    const hours = timer.getUTCHours().toString().padStart(2, '0')
    const minutes = timer.getUTCMinutes().toString().padStart(2, '0')
    const seconds = timer.getUTCSeconds().toString().padStart(2, '0')

    useEffect(() => {
        setOpenWin(win)
    }, [win])

    useEffect(() => {
        if (win) {
            mutate()
        }
    }, [win, mutate])

    if (loading || statusLoading || isLoading) {
        return (
            <AbsoluteCenter>
                <Spinner size="xl" />
            </AbsoluteCenter>
        )
    }

    if (error) {
        return <ApiErrorContainer error={error} />
    }

    const dailyWinners = data?.successCount ?? 0

    const dailyWinnerText = dailyWinners === 0 ? t('count0') : t('count', { count: dailyWinners })

    return (
        <VStack
            width="90vw"
            mx="auto"
            gap="1rem"
        >
            <Text
                as="h1"
                fontSize={{ base: '4rem', md: '7.5rem' }}
                className={tuskerGrotesk.className}
                paddingBottom="3rem"
            >
                M8DLE
            </Text>
            <Text
                position="absolute"
                top={{ base: '9rem', md: "13rem" }}
                fontSize={{ base: '4rem', md: '4.5rem' }}
                className={desirableCalligraphy.className}
                color={pink}
                userSelect="none"
            >
                M8dle
            </Text>

            <Text>
                {t('nextDraw')}
                {` ${hours}:${minutes}:${seconds}`}
            </Text>

            <PrecisionDialog />

            {win ? (
                <Text
                    fontSize="2xl"
                    textAlign="center"
                >
                    {t('findedMessage')}
                </Text>
            ) : (
                <InputPlayersAutocomplete
                    onPlayerSelected={addAttempt}
                    availablePlayers={availablePlayers}
                />
            )}

            <Text>{dailyWinnerText}</Text>

            <TablePlayers
                playerOfTheDay={playerOfTheDay}
                players={selectedPlayers}
            />

            <DialogWin
                open={openWin}
                setIsOpen={setOpenWin}
                nbPlayers={selectedPlayers.length}
            />
        </VStack>
    )
}

export default Home
