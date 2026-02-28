'use client'

import { AbsoluteCenter, Spinner, Text, VStack } from '@chakra-ui/react'
import localFont from 'next/font/local'
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
import { useTranslations } from 'next-intl'

const tuskerGrotesk = localFont({ src: './fonts/TuskerGrotesk-4800Super.woff2' })

const DesirableCalligraphy = localFont({
    src: './fonts/DesirableCalligraphyRegular.woff2',
})

const Home = () => {
    const { loading } = useAuth()
    const { selectedPlayers, availablePlayers, win, addAttempt, statusLoading } = useM8dleStatus()
    const { data, error, isLoading } = useSWR<{ successCount: number }, ApiError>('/api/m8dle/dailywinners', fetcher)
    const t = useTranslations('home')

    const playerOfTheDay = getPlayerOfTheDay()

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
                top="13rem"
                fontSize={{ base: '4rem', md: '4.5rem' }}
                className={DesirableCalligraphy.className}
                color={pink}
            >
                M8dle
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
        </VStack>
    )
}

export default Home
