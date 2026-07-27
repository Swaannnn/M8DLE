import { Box, HStack, Table, Text, IconButton } from '@chakra-ui/react'
import Image from 'next/image'
import { LuPencil, LuTrash } from 'react-icons/lu'
import { useTranslations } from 'next-intl'
import type { Game } from '@prisma/client'

type GamesTableProps = {
    games: Game[]
    onEdit: (game: Game) => void
    onDelete: (gameId: string) => void
}

export function GamesTable({ games, onEdit, onDelete }: GamesTableProps) {
    const t = useTranslations('admin')

    return (
        <Box overflowX="auto" w="full" bg="bg" borderRadius="md" borderWidth="1px">
            <Table.Root size="md" variant="line" interactive minW="600px">
                <Table.Header>
                    <Table.Row bg="blackAlpha.300">
                        <Table.ColumnHeader p="2" textAlign="center" w="120px" />
                        <Table.ColumnHeader p="2" textAlign="center">
                            <HStack justify="center" gap="1">{t('name')}</HStack>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader p="2" textAlign="center" w="150px">
                            <HStack justify="center" gap="1">{t('actions')}</HStack>
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {games.map((game) => (
                        <Table.Row key={game.id} transition="background 0.2s">
                            <Table.Cell p="2" textAlign="center">
                                <Box mx="auto" w="80px" h="80px" position="relative" overflow="hidden" borderRadius="md" bg="gray.800">
                                    {game.imageUrl && (
                                        <Image src={game.imageUrl} alt={game.name} fill style={{ objectFit: 'contain', padding: '4px' }} />
                                    )}
                                </Box>
                            </Table.Cell>
                            <Table.Cell p="2" textAlign="center">
                                <Text fontWeight="bold">{game.name}</Text>
                            </Table.Cell>
                            <Table.Cell p="2" textAlign="center">
                                <HStack justify="center">
                                    <IconButton variant='outline' onClick={() => onEdit(game)}>
                                        <LuPencil />
                                    </IconButton>
                                    <IconButton variant='outline' onClick={() => onDelete(game.id)}>
                                        <LuTrash />
                                    </IconButton>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    )
}
