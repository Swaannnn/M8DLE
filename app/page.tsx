'use client'

import { Text, VStack } from '@chakra-ui/react'
import localFont from 'next/font/local'
import InputPlayersAutocomplete from '@/components/InputPlayersAutocomplete'
import TablePlayers from '@/components/TablePlayers'
import { getPlayerOfTheDay } from '@/utils/getPlayerOfTheDay'
import { useM8dleStatus } from '@/hooks/use-m8dle-status'
import { useAuth } from '@/hooks/use-auth'

const tuskerGrotesk = localFont({ src: './fonts/TuskerGrotesk-4800Super.woff2' })

const Home = () => {
    const { loading } = useAuth()
    const playerOfTheDay = getPlayerOfTheDay()
    const { selectedPlayers, availablePlayers, win, addAttempt } = useM8dleStatus()

    if (loading) {
        return (
            <VStack>
                <Text>Loading...</Text>
            </VStack>
        )
    }

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

            <Text>
                <strong>78</strong> personnes ont déjà trouvé
            </Text>

            <TablePlayers
                playerOfTheDay={playerOfTheDay}
                players={selectedPlayers}
            />
        </VStack>
    )
}

export default Home
