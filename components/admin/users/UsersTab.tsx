import { useState, useMemo } from 'react'
import { VStack, Stack, Input, AbsoluteCenter, Spinner, Dialog, Portal, Text, Button } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { UsersTable } from './UsersTable'
import { UserForm } from './UserForm'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import type { User } from '@prisma/client'
import type { ApiError } from '@/utils/apiError'
import { ApiErrorMessage } from '@/components/ApiErrorMessage'
import { useApiErrorToast, useShowApiErrorToast } from '@/hooks/use-api-error-toast'

export function UsersTab() {
    const t = useTranslations('admin')
    const showApiErrorToast = useShowApiErrorToast()

    const { data: users, error, mutate, isLoading } = useSWR<User[], ApiError>('/api/users', fetcher)

    useApiErrorToast(error)

    const deleteUser = async (userId: string) => {
        try {
            await fetcher(`/api/users?userId=${userId}`, { method: 'DELETE' })
            mutate()
        } catch (err) {
            showApiErrorToast(err)
        }
    }

    const [searchQuery, setSearchQuery] = useState('')
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<string | null>(null)

    const filteredUsers = useMemo(() => {
        if (!users) return []
        const q = searchQuery.toLowerCase()
        return users.filter(
            (u) =>
                u.username.toLowerCase().includes(q) ||
                u.discordId.toLowerCase().includes(q) ||
                (u.email && u.email.toLowerCase().includes(q))
        )
    }, [users, searchQuery])

    const confirmDelete = async () => {
        if (!userToDelete) return
        await deleteUser(userToDelete)
        setUserToDelete(null)
    }

    const requestDelete = (userId: string) => {
        setUserToDelete(userId)
    }

    const openEditForm = (user: User) => {
        setEditingUser(user)
        setIsFormOpen(true)
    }

    return (
        <>
            <VStack align="stretch" gap="1rem">
                <Stack direction={{ base: 'column', lg: 'row' }} justify="space-between" mb="1rem" gap="1rem">
                    <Input
                        placeholder={t('searchUser')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        maxW={{ base: 'full', lg: '400px' }}
                    />
                </Stack>

                {error ? (
                    <ApiErrorMessage error={error} />
                ) : isLoading || !users ? (
                    <AbsoluteCenter>
                        <Spinner marginTop="3rem" size="xl" />
                    </AbsoluteCenter>
                ) : (
                    <UsersTable
                        users={filteredUsers}
                        onEdit={openEditForm}
                        onDelete={requestDelete}
                    />
                )}
            </VStack>

            <UserForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={() => {
                    setIsFormOpen(false)
                    mutate()
                }}
                user={editingUser}
            />

            <Dialog.Root
                open={!!userToDelete}
                onOpenChange={(details) => !details.open && setUserToDelete(null)}
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content bg="bg.panel">
                            <Dialog.Header>
                                <Dialog.Title fontSize="xl">{t('deleteConfirmUserTitle')}</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Text>{t('deleteConfirmUserText')}</Text>
                            </Dialog.Body>
                            <Dialog.Footer mt="1rem">
                                <Button variant="outline" onClick={() => setUserToDelete(null)}>
                                    {t('cancel')}
                                </Button>
                                <Button colorPalette="red" onClick={confirmDelete}>
                                    {t('deleteUser')}
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    )
}
