import { useState, useMemo } from 'react'
import { VStack, Stack, Input, Button, AbsoluteCenter, Spinner, Dialog, Portal, CloseButton, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { LuPlus } from 'react-icons/lu'
import { GamesTable } from './GamesTable'
import { GameForm } from './GameForm'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import type { Game } from '@prisma/client'

export function GamesTab() {
    const t = useTranslations('admin')

    const { data: games, mutate, isLoading } = useSWR<Game[]>('/api/games', fetcher)

    const deleteGame = async (gameId: string) => {
        await fetch(`/api/games?gameId=${gameId}`, { method: 'DELETE' })
        mutate()
    }

    const [searchName, setSearchName] = useState('')
    const [editingGame, setEditingGame] = useState<Game | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [gameToDelete, setGameToDelete] = useState<string | null>(null)

    const filteredGames = useMemo(() => {
        if (!games) return []
        return games.filter((game) => game.name.toLowerCase().includes(searchName.toLowerCase()))
    }, [games, searchName])

    const confirmDelete = async () => {
        if (!gameToDelete) return
        await deleteGame(gameToDelete)
        setGameToDelete(null)
    }

    const requestDelete = (gameId: string) => {
        setGameToDelete(gameId)
    }

    const openCreateForm = () => {
        setEditingGame(null)
        setIsFormOpen(true)
    }

    const openEditForm = (game: Game) => {
        setEditingGame(game)
        setIsFormOpen(true)
    }

    return (
        <>
            <VStack align="stretch" gap="1rem">
                <Stack direction={{ base: 'column', lg: 'row' }} justify="space-between" mb="1rem" gap="1rem">
                    <Input
                        placeholder={t('searchGame')}
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        maxW={{ base: 'full', lg: '400px' }}
                    />
                    <Button variant="outline" onClick={openCreateForm} w={{ base: 'full', lg: 'auto' }}>
                        <LuPlus /> {t('addGame')}
                    </Button>
                </Stack>

                {isLoading || !games ? (
                    <AbsoluteCenter>
                        <Spinner marginTop="3rem" size="xl" />
                    </AbsoluteCenter>
                ) : (
                    <GamesTable
                        games={filteredGames}
                        onEdit={openEditForm}
                        onDelete={requestDelete}
                    />
                )}
            </VStack>

            <Dialog.Root
                open={isFormOpen}
                onOpenChange={(details) => !details.open && setIsFormOpen(false)}
                size="lg"
                scrollBehavior="inside"
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content bg="bg.panel" p="4">
                            <Dialog.Header>
                                <Dialog.Title fontSize="2xl">
                                    {editingGame ? t('editGame') : t('addGame')}
                                </Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body>
                                <GameForm
                                    game={editingGame}
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
                open={!!gameToDelete}
                onOpenChange={(details) => !details.open && setGameToDelete(null)}
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content bg="bg.panel">
                            <Dialog.Header>
                                <Dialog.Title fontSize="xl">{t('deleteConfirmGameTitle')}</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Text>{t('deleteConfirmGameText')}</Text>
                            </Dialog.Body>
                            <Dialog.Footer mt="1rem">
                                <Button variant="outline" onClick={() => setGameToDelete(null)}>
                                    {t('cancel')}
                                </Button>
                                <Button colorPalette="red" onClick={confirmDelete}>
                                    {t('deleteGame')}
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    )
}
