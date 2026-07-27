import { Box, HStack, Table, Text, IconButton, Badge } from '@chakra-ui/react'
import Image from 'next/image'
import { LuPencil, LuTrash } from 'react-icons/lu'
import { useTranslations } from 'next-intl'
import { getProfileAvatar } from '@/utils/userUtils'
import type { User } from '@prisma/client'

type UsersTableProps = {
    users: User[]
    onEdit: (user: User) => void
    onDelete: (userId: string) => void
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
    const t = useTranslations('admin')

    return (
        <Box overflowX="auto" w="full" bg="bg" borderRadius="md" borderWidth="1px">
            <Table.Root size="md" variant="line" interactive minW="800px">
                <Table.Header>
                    <Table.Row bg="blackAlpha.300">
                        <Table.ColumnHeader p="2" textAlign="center" w="80px" />
                        <Table.ColumnHeader p="2" textAlign="center">
                            <HStack justify="center" gap="1">{t('username')}</HStack>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader p="2" textAlign="center">
                            <HStack justify="center" gap="1">{t('discordId')}</HStack>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader p="2" textAlign="center">
                            <HStack justify="center" gap="1">{t('email')}</HStack>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader p="2" textAlign="center">
                            <HStack justify="center" gap="1">{t('role')}</HStack>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader p="2" textAlign="center" w="150px">
                            <HStack justify="center" gap="1">{t('actions')}</HStack>
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {users.map((user) => (
                        <Table.Row key={user.id} transition="background 0.2s">
                            <Table.Cell p="2" textAlign="center">
                                <Box mx="auto" w="45px" h="45px" position="relative" overflow="hidden" borderRadius="full" bg="gray.700">
                                    {user.avatar ? (
                                        <Image src={getProfileAvatar({ discordId: user.discordId, avatar: user.avatar })} alt={user.username} fill style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <Text lineHeight="45px" fontWeight="bold" color="gray.300">
                                            {user.username.charAt(0).toUpperCase()}
                                        </Text>
                                    )}
                                </Box>
                            </Table.Cell>
                            <Table.Cell p="2" textAlign="center">
                                <Text fontWeight="bold">{user.username}</Text>
                            </Table.Cell>
                            <Table.Cell p="2" textAlign="center">
                                <Text color="gray.400" fontSize="sm">{user.discordId}</Text>
                            </Table.Cell>
                            <Table.Cell p="2" textAlign="center">
                                <Text fontSize="sm">{user.email || '-'}</Text>
                            </Table.Cell>
                            <Table.Cell p="2" textAlign="center">
                                <Badge colorPalette={user.role === 'ADMIN' ? 'purple' : 'gray'} variant="solid">
                                    {user.role}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell p="2" textAlign="center">
                                <HStack justify="center">
                                    <IconButton variant='outline' onClick={() => onEdit(user)}>
                                        <LuPencil />
                                    </IconButton>
                                    <IconButton variant='outline' onClick={() => onDelete(user.id)}>
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
