'use client'

import { useAuth } from '@/hooks/use-auth'
import { Text, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import type { Player } from '@/types/player'
import { getPlayerOfTheDay } from '@/utils/getPlayerOfTheDay'
import InputPlayersAutocomplete from '@/components/InputPlayersAutocomplete'
import TablePlayers from '@/components/TablePlayers'

const Home = () => {
    const { loading } = useAuth()
    const playerOfTheDay = getPlayerOfTheDay()

    const [win, setWin] = useState(false)
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])

    const handleAddPlayer = (player: Player) => {
        setSelectedPlayers((prev) => [...prev, player])
        if (player.name === playerOfTheDay.name) {
            setWin(true)
        }
    }

    if (loading) {
        return (
            <VStack>
                <Text>Loading...</Text>
            </VStack>
        )
    }

    return (
        <VStack>
            <Text fontSize="6xl">M8DLE</Text>
            <Text>Devine le joueur de Gentle Mates du jour !</Text>

            <InputPlayersAutocomplete
                onPlayerSelected={handleAddPlayer}
                win={win}
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
