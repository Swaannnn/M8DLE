import { useState, useMemo } from 'react'
import { VStack, Input, Button, AbsoluteCenter, Spinner, Dialog, Portal, Stack, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { LuPlus } from 'react-icons/lu'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { PlayersTable } from '@/components/admin/players/PlayersTable'
import { PlayerForm } from '@/components/admin/players/PlayerForm'
import { ApiErrorMessage } from '@/components/ApiErrorMessage'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import type { Player } from '@/types/player'
import type { ApiError } from 'next/dist/server/api-utils'
import { useApiErrorToast, useShowApiErrorToast } from '@/hooks/use-api-error-toast'

export function PlayersTab() {
    const t = useTranslations('admin')
    const showApiErrorToast = useShowApiErrorToast()

    const { data: players, error, mutate, isLoading } = useSWR<Player[], ApiError>('/api/players', fetcher)
    const { data: games } = useSWR<{ id: string; name: string }[]>('/api/games', fetcher)

    useApiErrorToast(error)

    const deletePlayer = async (playerId: string) => {
        try {
            await fetcher(`/api/players?playerId=${playerId}`, { method: 'DELETE' })
            mutate()
        } catch (err) {
            showApiErrorToast(err)
        }
    }

    const [searchName, setSearchName] = useState('')
    const [selectedGame, setSelectedGame] = useState('')

    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [playerToDelete, setPlayerToDelete] = useState<string | null>(null)

    const filteredPlayers = useMemo(() => {
        if (!players) return []
        return players.filter(player => {
            const matchesName = player.name.toLowerCase().includes(searchName.toLowerCase())
            const matchesGame = selectedGame ? player.gameId === selectedGame || player.game?.id === selectedGame : true
            return matchesName && matchesGame
        })
    }, [players, searchName, selectedGame])

    const confirmDelete = async () => {
        if (!playerToDelete) return
        await deletePlayer(playerToDelete)
        setPlayerToDelete(null)
    }

    const requestDelete = (playerId: string) => {
        setPlayerToDelete(playerId)
    }

    const openCreateForm = () => {
        setEditingPlayer(null)
        setIsFormOpen(true)
    }

    const openEditForm = (player: Player) => {
        setEditingPlayer(player)
        setIsFormOpen(true)
    }

    return (
        <>
            <VStack align="stretch" gap="1rem">
                <Stack direction={{ base: 'column', lg: 'row' }} justify="space-between" mb="1rem" gap="1rem">
                    <Stack direction={{ base: 'column', md: 'row' }} gap="0.5rem" flex="1" maxW={{ base: 'full', lg: '600px' }}>
                        <Input
                            placeholder={t('searchPlayer')}
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                        <SearchableSelect
                            width={{ base: 'full', md: '350px' }}
                            value={selectedGame}
                            onChange={setSelectedGame}
                            options={games?.map(g => ({ value: g.id, label: g.name })) || []}
                            placeholder={t('allGames')}
                        />
                    </Stack>
                    <Button variant="outline" onClick={openCreateForm} w={{ base: 'full', lg: 'auto' }}>
                        <LuPlus /> {t('addPlayer')}
                    </Button>
                </Stack>

                {error ? (
                    <ApiErrorMessage error={error} />
                ) : isLoading || !players ? (
                    <AbsoluteCenter>
                        <Spinner marginTop="3rem" size="xl" />
                    </AbsoluteCenter>
                ) : (
                    <PlayersTable
                        players={filteredPlayers}
                        onEdit={openEditForm}
                        onDelete={requestDelete}
                    />
                )}
            </VStack>

            <PlayerForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                player={editingPlayer}
                onSuccess={() => {
                    setIsFormOpen(false)
                    mutate()
                }}
            />
            <Dialog.Root
                open={!!playerToDelete}
                onOpenChange={(details) => !details.open && setPlayerToDelete(null)}
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content bg="bg.panel">
                            <Dialog.Header>
                                <Dialog.Title fontSize="xl">{t('deleteConfirmTitle')}</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Text>{t('deleteConfirmText')}</Text>
                            </Dialog.Body>
                            <Dialog.Footer mt="1rem">
                                <Button variant="outline" onClick={() => setPlayerToDelete(null)}>
                                    {t('cancel')}
                                </Button>
                                <Button colorPalette="red" onClick={confirmDelete}>
                                    {t('deletePlayer')}
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    )
}
