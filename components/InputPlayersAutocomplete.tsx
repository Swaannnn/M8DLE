'use client'

import { Box, Input, VStack } from '@chakra-ui/react'
import players from '@/data/players.json'
import type { Player } from '@/types/player'
import { useState } from 'react'
import { TABLE_PLAYERS_WIDTH } from '@/constants/sizes'

type InputPlayersAutocompleteProps = {
    onPlayerSelected: (player: Player) => void
    win: boolean
}

const InputPlayersAutocomplete = ({ onPlayerSelected, win = false }: InputPlayersAutocompleteProps) => {
    const [value, setValue] = useState('')

    const [availablePlayers, setAvailablePlayers] = useState(players)

    const availablePlayersFiltered = availablePlayers.filter((player) =>
        player.name.toLowerCase().includes(value.toLowerCase())
    )

    const selectPlayer = (player: Player) => {
        onPlayerSelected(player)
        const playersFiltered = availablePlayers.filter((p) => p.name !== player.name)
        setAvailablePlayers(playersFiltered)
        setValue('')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && value !== '') {
            if (availablePlayersFiltered.length > 0) {
                selectPlayer(availablePlayersFiltered[0])
                e.preventDefault()
            }
        }
    }

    return (
        <Box
            position="relative"
            gap="1rem"
            width="100%"
            maxWidth={TABLE_PLAYERS_WIDTH}
        >
            <Input
                placeholder="Tapez pour rechercher"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={win}
            />
            {value.length > 0 && (
                <VStack
                    position="absolute"
                    maxHeight="250px"
                    width="100%"
                    overflow="auto"
                    zIndex={20}
                    paddingTop="0.5rem"
                    bg="bg"
                    color="fg"
                >
                    {availablePlayersFiltered.length === 0 ? (
                        <Box
                            padding="0.5rem"
                            width="100%"
                            border="solid 1px #ccc"
                            borderRadius="0.2rem"
                            bg="bg"
                        >
                            Aucun joueur trouvé.
                        </Box>
                    ) : (
                        availablePlayersFiltered.map((player) => (
                            <Box
                                key={player.name}
                                onClick={() => selectPlayer(player)}
                                padding="0.5rem"
                                width="100%"
                                border="solid 1px #ccc"
                                borderRadius="0.2rem"
                                bg="bg"
                                cursor="pointer"
                            >
                                {player.name}
                            </Box>
                        ))
                    )}
                </VStack>
            )}
        </Box>
    )
}

export default InputPlayersAutocomplete
