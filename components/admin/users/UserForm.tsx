'use client'

import { useState, useEffect } from 'react'
import { Box, Button, VStack, Input, Text, Dialog, Portal, CloseButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import type { User } from '@prisma/client'
import { toaster } from '@/components/ui/toaster'
import { fetcher } from '@/utils/fetcher'
import { useShowApiErrorToast } from '@/hooks/use-api-error-toast'

type UserFormProps = {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    user?: User | null
}

export function UserForm({ open, onClose, onSuccess, user }: UserFormProps) {
    const t = useTranslations('admin')
    const showApiErrorToast = useShowApiErrorToast()
    const [username, setUsername] = useState(user?.username || '')
    const [email, setEmail] = useState(user?.email || '')
    const [role, setRole] = useState<string>(user?.role || 'USER')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setUsername(user?.username || '')
            setEmail(user?.email || '')
            setRole(user?.role || 'USER')
        }
    }, [open, user])

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (!user) return
        setLoading(true)

        try {
            await fetcher('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    username,
                    email: email || null,
                    role,
                }),
            })

            toaster.create({
                description: t('userUpdated'),
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
                            <Dialog.Title fontSize="2xl">{t('editUser')}</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <form id="user-form" onSubmit={handleSubmit}>
                                <VStack align="stretch" gap="1rem" maxW="600px">
                                    <Box>
                                        <Text mb="0.5rem">{t('username')}</Text>
                                        <Input required value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </Box>

                                    <Box>
                                        <Text mb="0.5rem">{t('email')}</Text>
                                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
                                    </Box>

                                    <Box>
                                        <Text mb="0.5rem">{t('role')}</Text>
                                        <SearchableSelect
                                            value={role}
                                            onChange={(val) => setRole(val)}
                                            options={[
                                                { value: 'USER', label: 'USER' },
                                                { value: 'ADMIN', label: 'ADMIN' },
                                            ]}
                                            placeholder={t('select')}
                                        />
                                    </Box>
                                </VStack>
                            </form>
                        </Dialog.Body>

                        <Dialog.Footer mt="1rem">
                            <Button
                                variant="outline"
                                disabled={loading}
                                onClick={onClose}
                            >
                                {t('cancel')}
                            </Button>
                            <Button
                                type="submit"
                                form="user-form"
                                disabled={loading || !username.trim()}
                            >
                                {t('editUser')}
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
