import { Box, HStack, Table, Text, IconButton } from '@chakra-ui/react'
import Image from 'next/image'
import ReactCountryFlag from 'react-country-flag'
import { LuPencil, LuTrash } from 'react-icons/lu'
import { useTranslations } from 'next-intl'
import { countries } from '@/utils/countries'
import type { Player } from '@/types/player'

type PlayersTableProps = {
    players: Player[]
    onEdit: (player: Player) => void
    onDelete: (playerId: string) => void
}

export function PlayersTable({ players, onEdit, onDelete }: PlayersTableProps) {
    const t = useTranslations('adminPlayers')

    return (
        <Box overflowX="auto" w="full" bg="bg" borderRadius="md" borderWidth="1px">
            <Table.Root size="md" variant="line" interactive minW="800px">
                <Table.Header>
                    <Table.Row bg="blackAlpha.300">
                        <Table.ColumnHeader p="2" textAlign="center" />
                        <Table.ColumnHeader p="2" textAlign="center">
                            <HStack justify="center" gap="1">{t('name')}</HStack>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader p="2" textAlign="center">
                            <HStack justify="center" gap="1">{t('game')}</HStack>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader p="2" textAlign="center">
                            <HStack justify="center" gap="1">{t('nationality')}</HStack>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader p="2" textAlign="center">
                            <HStack justify="center" gap="1">{t('currentTeam')}</HStack>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader p="2" textAlign="center">
                            <HStack justify="center" gap="1">{t('actions')}</HStack>
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {players.map((player) => {
                        const currentOrgPlayer = player.organizationPlayers?.find((op) => !op.end)
                        const org = currentOrgPlayer?.organization

                        return (
                            <Table.Row key={player.id} transition="background 0.2s">
                                <Table.Cell p="2" textAlign="center">
                                    <Box mx="auto" w="80px" h="80px" position="relative" overflow="hidden" borderRadius="md" bg="gray.800">
                                        {player.imageUrl && (
                                            <Image src={player.imageUrl} alt={player.name} fill style={{ objectFit: 'cover' }} />
                                        )}
                                    </Box>
                                </Table.Cell>
                                <Table.Cell p="2" textAlign="center">
                                    <Text fontWeight="bold">{player.name}</Text>
                                </Table.Cell>
                                <Table.Cell p="2" textAlign="center">
                                    {player.game?.imageUrl ? (
                                        <HStack justify="center">
                                            <Box w="30px" h="30px" position="relative">
                                                <Image src={player.game.imageUrl} alt={player.game.name} fill style={{ objectFit: 'contain' }} />
                                            </Box>
                                            <Text>{player.game.name}</Text>
                                        </HStack>
                                    ) : (
                                        <Text>{player.game?.name || '-'}</Text>
                                    )}
                                </Table.Cell>
                                <Table.Cell p="2" textAlign="center">
                                    {player.nationality ? (
                                        <HStack justify="center">
                                            <ReactCountryFlag svg countryCode={player.nationality} style={{ width: '2em', height: '2em' }} />
                                            <Text>{countries.find(c => c.value === player.nationality)?.label || player.nationality.toUpperCase()}</Text>
                                        </HStack>
                                    ) : (
                                        '-'
                                    )}
                                </Table.Cell>
                                <Table.Cell p="2" textAlign="center">
                                    {org ? (
                                        <HStack justify="center">
                                            {org.imageUrl && (
                                                <Box w="30px" h="30px" position="relative">
                                                    <Image src={org.imageUrl} alt={org.name} fill style={{ objectFit: 'contain' }} />
                                                </Box>
                                            )}
                                            <Text>{org.name}</Text>
                                        </HStack>
                                    ) : (
                                        <Text color="gray.500">{t('noneTeam')}</Text>
                                    )}
                                </Table.Cell>
                                <Table.Cell p="2" textAlign="center">
                                    <HStack justify="center">
                                        <IconButton variant='outline' onClick={() => onEdit(player)}>
                                            <LuPencil />
                                        </IconButton>
                                        <IconButton variant='outline' onClick={() => onDelete(player.id)}>
                                            <LuTrash />
                                        </IconButton>
                                    </HStack>
                                </Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table.Root>
        </Box>
    )
}
