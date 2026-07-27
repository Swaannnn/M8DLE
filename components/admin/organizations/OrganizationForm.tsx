'use client'

import { useState } from 'react'
import { Box, Button, VStack, Input, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { ImageUpload } from '@/components/admin/players/ImageUpload'
import type { Organization } from '@prisma/client'

type OrganizationFormProps = {
    organization?: Organization | null
    onSuccess: () => void
}

export function OrganizationForm({ organization, onSuccess }: OrganizationFormProps) {
    const t = useTranslations('admin')
    const [name, setName] = useState(organization?.name || '')
    const [imageUrl, setImageUrl] = useState(organization?.imageUrl || '')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = '/api/organizations'
            const method = organization ? 'PATCH' : 'POST'
            const body = {
                id: organization?.id,
                name,
                imageUrl,
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (!res.ok) throw new Error('Failed')

            alert(organization ? t('organizationUpdated') : t('organizationCreated'))
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
                    {organization ? t('editOrganization') : t('addOrganization')}
                </Button>
            </VStack>
        </form>
    )
}
