'use client'

import { useState } from 'react'
import { Box, Button, VStack, Input, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import type { User } from '@prisma/client'
import { Toaster, toaster } from '@/components/ui/toaster'

type UserFormProps = {
    user: User
    onSuccess: () => void
}

export function UserForm({ user, onSuccess }: UserFormProps) {
    const t = useTranslations('admin')
    const [username, setUsername] = useState(user.username || '')
    const [email, setEmail] = useState(user.email || '')
    const [role, setRole] = useState<string>(user.role)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    username,
                    email: email || null,
                    role,
                }),
            })

            if (!res.ok) throw new Error('Failed')

            toaster.create({
                description: t('userUpdated'),
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

    return (
        <form onSubmit={handleSubmit}>
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

                <Button type="submit" mt="2rem" disabled={loading || !username.trim()}>
                    {t('editUser')}
                </Button>
            </VStack>
        </form>
    )
}
