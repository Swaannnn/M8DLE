'use client'

import { useState } from 'react'
import { Box, Button, HStack, VStack, Input, Text, IconButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import type { Player } from '@/types/player'
import { LuPlus, LuTrash } from 'react-icons/lu'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { CustomDatePicker } from '@/components/ui/DatePicker'
import { formatDateForInput } from '@/utils/dateUtils'
import { countries } from '@/utils/countries'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'

type PlayerFormProps = {
    player?: Player | null
    onSuccess: () => void
}

type OrgPlayerForm = {
    organizationId: string
    start: string
    end: string | null
}

export function PlayerForm({ player, onSuccess }: PlayerFormProps) {
    const t = useTranslations('adminPlayers')

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

            alert(player ? t('playerUpdated') : t('playerCreated'))
            onSuccess()
        } catch (error) {
            console.error(error)
            alert(t('error'))
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
        <form onSubmit={handleSubmit}>
            <VStack align="stretch" gap="1rem" maxW="600px">
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
                    <Input required value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
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
                            <HStack key={i} p="1rem" borderWidth="1px" borderRadius="md" align="end">
                                <VStack align="start" flex="1">
                                    <Text fontSize="sm">{t('organizations')}</Text>
                                    <SearchableSelect
                                        value={op.organizationId}
                                        onChange={(val) => updateOrg(i, 'organizationId', val)}
                                        options={orgs?.map(o => ({ value: o.id, label: o.name })) || []}
                                        placeholder={t('select')}
                                    />
                                </VStack>
                                <VStack align="start">
                                    <Text fontSize="sm">{t('start')}</Text>
                                    <CustomDatePicker required value={op.start} onChange={val => updateOrg(i, 'start', val || '')} />
                                </VStack>
                                <VStack align="start">
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

                <Button type="submit" mt="2rem" disabled={loading}>
                    {player ? t('editPlayer') : t('addPlayer')}
                </Button>
            </VStack>
        </form>
    )
}
