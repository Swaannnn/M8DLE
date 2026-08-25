'use client'

import { useState, useEffect } from 'react'
import { Box, Button, VStack, Input, Text, Dialog, Portal, CloseButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { ImageUpload } from '@/components/admin/players/ImageUpload'
import type { Game } from '@prisma/client'
import { toaster } from '@/components/ui/toaster'
import { fetcher } from '@/utils/fetcher'
import { useShowApiErrorToast } from '@/hooks/use-api-error-toast'

type GameFormProps = {
    open: boolean
    onClose: () => void
    game?: Game | null
    onSuccess: () => void
}

export function GameForm({ open, onClose, game, onSuccess }: GameFormProps) {
    const t = useTranslations('admin')
    const showApiErrorToast = useShowApiErrorToast()
    const [name, setName] = useState(game?.name || '')
    const [imageUrl, setImageUrl] = useState(game?.imageUrl || '')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setName(game?.name || '')
            setImageUrl(game?.imageUrl || '')
        }
    }, [open, game])

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = '/api/games'
            const method = game ? 'PATCH' : 'POST'
            const body = {
                id: game?.id,
                name,
                imageUrl,
            }

            await fetcher(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            toaster.create({
                description: game ? t('gameUpdated') : t('gameCreated'),
                type: "info",
                closable: true,
            })
            onSuccess()
        } catch (error) {
            showApiErrorToast(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) => !details.open && onClose()}
            size="lg"
            scrollBehavior="inside"
            closeOnInteractOutside={false}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content bg="bg.panel" p="4">
                        <Dialog.Header>
                            <Dialog.Title fontSize="2xl">
                                {game ? t('editGame') : t('addGame')}
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <form id="game-form" onSubmit={handleSubmit}>
                                <VStack align="stretch" gap="1rem" maxW="600px">
                                    <Box>
                                        <Text mb="0.5rem">{t('name')}</Text>
                                        <Input required value={name} onChange={(e) => setName(e.target.value)} />
                                    </Box>

                                    <Box>
                                        <Text mb="0.5rem">{t('imageUrl')}</Text>
                                        <ImageUpload value={imageUrl} onChange={setImageUrl} />
                                    </Box>
                                </VStack>
                            </form>
                        </Dialog.Body>

                        <Dialog.Footer mt="1rem">
                            <Button variant="outline" disabled={loading} onClick={onClose}>
                                {t('cancel')}
                            </Button>
                            <Button type="submit" form="game-form" disabled={loading || !name.trim() || !imageUrl}>
                                {game ? t('editGame') : t('addGame')}
                            </Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
