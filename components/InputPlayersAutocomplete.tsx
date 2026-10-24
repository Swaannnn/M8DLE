'use client'

import { Box, Input, VStack } from '@chakra-ui/react'
import type { Player } from '@/types/player'
import { useMemo, useState } from 'react'
import { TABLE_PLAYERS_WIDTH } from '@/constants/sizes'
import { useTranslations } from 'next-intl'

type Props = {
    availablePlayers: Player[]
    onPlayerSelected: (player: Player) => void
    /** Essai en cours d'envoi : la saisie reste possible, mais pas la sélection. */
    disabled?: boolean
}

const InputPlayersAutocomplete = ({ availablePlayers, onPlayerSelected, disabled = false }: Props) => {
    const t = useTranslations('input')

    const [value, setValue] = useState('')

    const filteredPlayers = useMemo(() => {
        const search = value.toLowerCase()
        return availablePlayers.filter((p) => p.name.toLowerCase().includes(search))
    }, [availablePlayers, value])

    const selectPlayer = (player: Player) => {
        if (disabled) return
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
                placeholder={t('playersPlaceholder')}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
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
                            {t('noPlayerFound')}
                        </Box>
                    ) : (
                        filteredPlayers.map((player) => (
                            <Box
                                key={player.id}
                                onClick={() => selectPlayer(player)}
                                padding="0.5rem"
                                width="100%"
                                border="solid 1px #ccc"
                                borderRadius="0.2rem"
                                bg="bg"
                                cursor={disabled ? 'progress' : 'pointer'}
                                opacity={disabled ? 0.5 : 1}
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
