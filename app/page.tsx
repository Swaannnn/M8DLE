'use client'

import { AbsoluteCenter, Spinner, Text, VStack } from '@chakra-ui/react'
import InputPlayersAutocomplete from '@/components/InputPlayersAutocomplete'
import TablePlayers from '@/components/TablePlayers'
import { useM8dleStatus } from '@/hooks/use-m8dle-status'
import { useAuth } from '@/hooks/use-auth'
import PrecisionDialog from '@/components/PrecisionDialog'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import { pink } from '@/constants/colors'
import { ApiError } from '@/utils/apiError'
import { ApiErrorContainer } from '@/components/ApiErrorContainer'
import { ApiErrorMessage } from '@/components/ApiErrorMessage'
import { useApiErrorToast } from '@/hooks/use-api-error-toast'
import { desirableCalligraphy, tuskerGrotesk } from '@/utils/fontUtils'
import { useTranslations } from 'next-intl'
import DialogWin from '@/components/DialogWin'
import { useEffect, useState } from 'react'
import { getNextGameDate, getTimeLeft } from '@/utils/dateUtils'
import { useWinDialog } from '@/hooks/use-win-dialog'
import { toEmojiRow } from '@/utils/playerCompareUtils'

const Home = () => {
    const { loading } = useAuth()
    const { allPlayers, playersError, attempts, availablePlayers, win, playerOfTheDay, addAttempt, statusLoading } =
        useM8dleStatus()
    const { data, error, isLoading, mutate } = useSWR<{ successCount: number }, ApiError>(
        '/api/m8dle/dailywinners',
        fetcher
    )
    const t = useTranslations('home')
    const nextGameDateTime = getNextGameDate().getTime()
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(nextGameDateTime))
    const { isOpen, closeDialog } = useWinDialog(win)

    useApiErrorToast(error)

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

    const fatalError = [playersError, error].find((candidate) => candidate && candidate.statusCode >= 500)
    if (fatalError) {
        return <ApiErrorContainer error={fatalError} />
    }

    // Chargement terminé mais aucun joueur à proposer : catalogue vide ou /api/players en
    // échec. On l'affiche explicitement plutôt que de laisser tourner un spinner sans fin.
    if (allPlayers.length === 0) {
        return (
            <AbsoluteCenter>
                <VStack gap="1rem">
                    {playersError && <ApiErrorMessage error={playersError} />}
                    <Text>{t('unavailable')}</Text>
                </VStack>
            </AbsoluteCenter>
        )
    }

    const dailyWinners = data?.successCount ?? 0
    const dailyWinnerText = dailyWinners === 0 ? t('count0') : t('count', { count: dailyWinners })

    const result = attempts
        .map((attempt) => attempt.comparison)
        // si plus que 12 essais, couper le début pour la limite des posts de twitter
        .slice(-12)
        .reverse()
        .map(toEmojiRow)
        .join('\n')

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
                top={{ base: '9rem', md: '13rem' }}
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

            {error && <ApiErrorMessage error={error} />}

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

            <TablePlayers attempts={attempts} />

            <DialogWin
                isOpen={isOpen}
                onClose={closeDialog}
                nbPlayers={attempts.length}
                result={result}
                playerOfTheDay={playerOfTheDay}
            />
        </VStack>
    )
}

export default Home
