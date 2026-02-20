'use client'

import { Text, VStack } from '@chakra-ui/react'
import localFont from 'next/font/local'
import InputPlayersAutocomplete from '@/components/InputPlayersAutocomplete'
import TablePlayers from '@/components/TablePlayers'
import { getPlayerOfTheDay } from '@/utils/getPlayerOfTheDay'
import { useM8dleStatus } from '@/hooks/use-m8dle-status'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'

const tuskerGrotesk = localFont({ src: './fonts/TuskerGrotesk-4800Super.woff2' })

const Home = () => {
    const { loading } = useAuth()
    const { selectedPlayers, availablePlayers, win, addAttempt } = useM8dleStatus()

    const [dailyWinners, setDailyWinners] = useState(0)
    const [dailyWinnersLoading, setDailyWinnersLoading] = useState(false)

    const playerOfTheDay = getPlayerOfTheDay()

    useEffect(() => {
        const fetchDailyWinners = async () => {
            setDailyWinnersLoading(true)
            const res = await fetch('/api/m8dle/dailywinners')
            const data = await res.json()
            setDailyWinners(data.successCount)
            setDailyWinnersLoading(false)
        }
        fetchDailyWinners()
    }, [])

    if (loading || dailyWinnersLoading) {
        return (
            <VStack>
                <Text>Loading...</Text>
            </VStack>
        )
    }

    const dailyWinnerText =
        dailyWinners === 0
            ? "Personne n'a encore trouvé le joueur du jour."
            : dailyWinners === 1
              ? '1 personne a déjà trouvé le joueur du jour.'
              : `${dailyWinners} personnes ont déjà trouvé le joueur du jour.`
    return (
        <VStack
            width="90vw"
            mx="auto"
            gap="1rem"
        >
            <Text
                fontSize="7.5rem"
                className={tuskerGrotesk.className}
            >
                M8DLE
            </Text>
            <Text>Devine le joueur de Gentle Mates du jour !</Text>

            <InputPlayersAutocomplete
                onPlayerSelected={addAttempt}
                win={win}
                availablePlayers={availablePlayers}
            />

            <Text>{dailyWinnerText}</Text>

            <TablePlayers
                playerOfTheDay={playerOfTheDay}
                players={selectedPlayers}
            />
        </VStack>
    )
}

export default Home
