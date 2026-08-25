import { useState, useMemo } from 'react'
import { VStack, Stack, Input, Button, AbsoluteCenter, Spinner, Dialog, Portal, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { LuPlus } from 'react-icons/lu'
import { GamesTable } from './GamesTable'
import { GameForm } from './GameForm'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import type { Game } from '@prisma/client'
import type { ApiError } from 'next/dist/server/api-utils'
import { ApiErrorMessage } from '@/components/ApiErrorMessage'
import { useApiErrorToast, useShowApiErrorToast } from '@/hooks/use-api-error-toast'

export function GamesTab() {
    const t = useTranslations('admin')
    const showApiErrorToast = useShowApiErrorToast()

    const { data: games, error, mutate, isLoading } = useSWR<Game[], ApiError>('/api/games', fetcher)

    useApiErrorToast(error)

    const deleteGame = async (gameId: string) => {
        try {
            await fetcher(`/api/games?gameId=${gameId}`, { method: 'DELETE' })
            mutate()
        } catch (err) {
            showApiErrorToast(err)
        }
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

                {error ? (
                    <ApiErrorMessage error={error} />
                ) : isLoading || !games ? (
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

            <GameForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                game={editingGame}
                onSuccess={() => {
                    setIsFormOpen(false)
                    mutate()
                }}
            />

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
