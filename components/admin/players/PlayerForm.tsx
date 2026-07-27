'use client'

import { useState, useEffect } from 'react'
import { Box, Button, HStack, VStack, Input, Text, IconButton, Dialog, Portal, CloseButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import type { Player } from '@/types/player'
import { LuPlus, LuTrash } from 'react-icons/lu'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { CustomDatePicker } from '@/components/ui/DatePicker'
import { formatDateForInput } from '@/utils/dateUtils'
import { useCountries } from '@/utils/countries'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import { ImageUpload } from './ImageUpload'
import { toaster } from '@/components/ui/toaster'

type PlayerFormProps = {
    open: boolean
    onClose: () => void
    player?: Player | null
    onSuccess: () => void
}

type OrgPlayerForm = {
    organizationId: string
    start: string
    end: string | null
}

export function PlayerForm({ open, onClose, player, onSuccess }: PlayerFormProps) {
    const t = useTranslations('admin')
    const countries = useCountries()

    const { data: games } = useSWR<{ id: string; name: string }[]>('/api/games', fetcher)
    const { data: orgs } = useSWR<{ id: string; name: string }[]>('/api/organizations', fetcher)

    const [name, setName] = useState(player?.name || '')
    const [birthDate, setBirthDate] = useState(formatDateForInput(player?.birthDate))
    const [nationality, setNationality] = useState(player?.nationality || '')
    const [imageUrl, setImageUrl] = useState(player?.imageUrl || '')
    const [gameId, setGameId] = useState(player?.gameId || '')
    const [orgPlayers, setOrgPlayers] = useState<OrgPlayerForm[]>(
        player?.organizationPlayers?.map(op => ({
            organizationId: op.organizationId,
            start: formatDateForInput(op.start),
            end: formatDateForInput(op.end)
        })) || []
    )
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setName(player?.name || '')
            setBirthDate(formatDateForInput(player?.birthDate))
            setNationality(player?.nationality || '')
            setImageUrl(player?.imageUrl || '')
            setGameId(player?.gameId || '')
            setOrgPlayers(
                player?.organizationPlayers?.map(op => ({
                    organizationId: op.organizationId,
                    start: formatDateForInput(op.start),
                    end: formatDateForInput(op.end)
                })) || []
            )
        }
    }, [open, player])

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = '/api/players'
            const method = player ? 'PATCH' : 'POST'
            const body = {
                id: player?.id,
                name,
                birthDate: new Date(birthDate).toISOString(),
                nationality,
                imageUrl,
                gameId: gameId || null,
                organizationPlayers: orgPlayers.map(op => ({
                    organizationId: op.organizationId,
                    start: new Date(op.start).toISOString(),
                    end: op.end ? new Date(op.end).toISOString() : null
                }))
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (!res.ok) throw new Error('Failed')

            toaster.create({
                description: player ? t('playerUpdated') : t('playerCreated'),
                type: "info",
                closable: true,
            })
            onSuccess()
        } catch (error) {
            console.error(error)
            toaster.create({
                description: t('error'),
                type: "error",
                closable: true,
            })
        } finally {
            setLoading(false)
        }
    }

    const addOrg = () => {
        setOrgPlayers([...orgPlayers, { organizationId: '', start: '', end: null }])
    }

    const removeOrg = (index: number) => {
        setOrgPlayers(orgPlayers.filter((_, i) => i !== index))
    }

    const updateOrg = (index: number, field: keyof OrgPlayerForm, value: string | null) => {
        const newOrgs = [...orgPlayers]
        newOrgs[index] = { ...newOrgs[index], [field]: value }
        setOrgPlayers(newOrgs)
    }

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) => !details.open && onClose()}
            size="xl"
            scrollBehavior="inside"
            closeOnInteractOutside={false}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content bg="bg.panel" p="4">
                        <Dialog.Header>
                            <Dialog.Title fontSize="2xl">
                                {player ? t('editPlayer') : t('addPlayer')}
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <form id="player-form" onSubmit={handleSubmit}>
                                <VStack align="stretch" gap="1rem" maxW="800px">
                                    <Box>
                                        <Text mb="0.5rem">{t('name')}</Text>
                                        <Input required value={name} onChange={e => setName(e.target.value)} />
                                    </Box>

                                    <Box>
                                        <Text fontWeight="bold" mb="0.5rem">{t('birthDate')}</Text>
                                        <CustomDatePicker required value={birthDate} onChange={setBirthDate} />
                                    </Box>

                                    <Box>
                                        <Text mb="0.5rem">{t('nationalityInput')}</Text>
                                        <SearchableSelect
                                            value={nationality}
                                            onChange={setNationality}
                                            options={countries}
                                            placeholder={t('select')}
                                        />
                                    </Box>

                                    <Box>
                                        <Text mb="0.5rem">{t('imageUrl')}</Text>
                                        <ImageUpload
                                            value={imageUrl}
                                            onChange={setImageUrl}
                                        />
                                    </Box>

                                    <Box>
                                        <Text mb="0.5rem">{t('game')}</Text>
                                        <SearchableSelect
                                            value={gameId}
                                            onChange={setGameId}
                                            options={games?.map(g => ({ value: g.id, label: g.name })) || []}
                                            placeholder={t('none')}
                                        />
                                    </Box>

                                    <Box>
                                        <HStack justify="space-between" mb="1rem">
                                            <Text fontWeight="bold">{t('organizations')}</Text>
                                            <Button variant='outline' size="sm" onClick={addOrg}><LuPlus /> {t('addOrg')}</Button>
                                        </HStack>
                                        <VStack align="stretch" gap="1rem">
                                            {orgPlayers.map((op, i) => (
                                                <HStack key={i} p="1rem" borderWidth="1px" borderRadius="md" align="end" gap="0.75rem">
                                                    <VStack align="stretch" flex="1" minW="200px">
                                                        <Text fontSize="sm">{t('organizations')}</Text>
                                                        <SearchableSelect
                                                            value={op.organizationId}
                                                            onChange={(val) => updateOrg(i, 'organizationId', val)}
                                                            options={orgs?.map(o => ({ value: o.id, label: o.name })) || []}
                                                            placeholder={t('select')}
                                                        />
                                                    </VStack>
                                                    <VStack align="stretch" w="140px" flex="0 0 140px">
                                                        <Text fontSize="sm">{t('start')}</Text>
                                                        <CustomDatePicker required value={op.start} onChange={val => updateOrg(i, 'start', val || '')} />
                                                    </VStack>
                                                    <VStack align="stretch" w="140px" flex="0 0 140px">
                                                        <Text fontSize="sm">{t('end')}</Text>
                                                        <CustomDatePicker value={op.end || null} onChange={val => updateOrg(i, 'end', val)} />
                                                    </VStack>
                                                    <IconButton variant='outline' onClick={() => removeOrg(i)}>
                                                        <LuTrash />
                                                    </IconButton>
                                                </HStack>
                                            ))}
                                        </VStack>
                                    </Box>
                                </VStack>
                            </form>
                        </Dialog.Body>

                        <Dialog.Footer mt="1rem">
                            <Button variant="outline" disabled={loading} onClick={onClose}>
                                {t('cancel')}
                            </Button>
                            <Button type="submit" form="player-form" disabled={loading}>
                                {player ? t('editPlayer') : t('addPlayer')}
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
