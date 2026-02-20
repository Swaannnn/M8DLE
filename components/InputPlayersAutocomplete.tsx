'use client'

import { Box, Input, VStack } from '@chakra-ui/react'
import type { Player } from '@/types/player'
import { useState } from 'react'
import { TABLE_PLAYERS_WIDTH } from '@/constants/sizes'

type Props = {
    availablePlayers: Player[]
    onPlayerSelected: (player: Player) => void
    win: boolean
}

const InputPlayersAutocomplete = ({ availablePlayers, onPlayerSelected, win }: Props) => {
    const [value, setValue] = useState('')

    const filteredPlayers = availablePlayers.filter((p) => p.name.toLowerCase().includes(value.toLowerCase()))

    const selectPlayer = (player: Player) => {
        onPlayerSelected(player)
        setValue('')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && filteredPlayers.length > 0) {
            selectPlayer(filteredPlayers[0])
            e.preventDefault()
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
                    {filteredPlayers.length === 0 ? (
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
                        filteredPlayers.map((player) => (
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
