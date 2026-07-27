'use client'

import { useState } from 'react'
import { Box, Button, VStack, Input, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { ImageUpload } from '@/components/admin/players/ImageUpload'
import type { Game } from '@prisma/client'

type GameFormProps = {
    game?: Game | null
    onSuccess: () => void
}

export function GameForm({ game, onSuccess }: GameFormProps) {
    const t = useTranslations('admin')
    const [name, setName] = useState(game?.name || '')
    const [imageUrl, setImageUrl] = useState(game?.imageUrl || '')
    const [loading, setLoading] = useState(false)

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

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (!res.ok) throw new Error('Failed')

            alert(game ? t('gameUpdated') : t('gameCreated'))
            onSuccess()
        } catch (error) {
            console.error(error)
            alert(t('error'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <VStack align="stretch" gap="1rem" maxW="600px">
                <Box>
                    <Text mb="0.5rem">{t('name')}</Text>
                    <Input required value={name} onChange={(e) => setName(e.target.value)} />
                </Box>

                <Box>
                    <Text mb="0.5rem">{t('imageUrl')}</Text>
                    <ImageUpload value={imageUrl} onChange={setImageUrl} />
                </Box>

                <Button type="submit" mt="2rem" disabled={loading || !name.trim() || !imageUrl}>
                    {game ? t('editGame') : t('addGame')}
                </Button>
            </VStack>
        </form>
    )
}
