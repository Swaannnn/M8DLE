import { useState, useMemo } from 'react'
import { VStack, HStack, Input, Button, AbsoluteCenter, Spinner, Dialog, Portal, CloseButton, Stack, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { LuPlus } from 'react-icons/lu'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { PlayersTable } from '@/components/admin/players/PlayersTable'
import { PlayerForm } from '@/components/admin/players/PlayerForm'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import type { Player } from '@/types/player'

export function PlayersTab() {
    const t = useTranslations('admin')

    const { data: players, mutate, isLoading } = useSWR<Player[]>('/api/players', fetcher)
    const { data: games } = useSWR<{ id: string; name: string }[]>('/api/games', fetcher)

    const deletePlayer = async (playerId: string) => {
        await fetch(`/api/players?playerId=${playerId}`, { method: 'DELETE' })
        mutate()
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

                {isLoading || !players ? (
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

            <Dialog.Root
                open={isFormOpen}
                onOpenChange={(details) => !details.open && setIsFormOpen(false)}
                size="xl"
                scrollBehavior="inside"
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content bg="bg.panel" p="4">
                            <Dialog.Header>
                                <Dialog.Title fontSize="2xl">
                                    {editingPlayer ? t('editPlayer') : t('addPlayer')}
                                </Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body>
                                <PlayerForm
                                    player={editingPlayer}
                                    onSuccess={() => {
                                        setIsFormOpen(false)
                                        mutate()
                                    }}
                                />
                            </Dialog.Body>

                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
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
