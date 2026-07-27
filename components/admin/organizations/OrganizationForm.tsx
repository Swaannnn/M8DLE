'use client'

import { useState, useEffect } from 'react'
import { Box, Button, VStack, Input, Text, Dialog, Portal, CloseButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { ImageUpload } from '@/components/admin/players/ImageUpload'
import type { Organization } from '@prisma/client'
import { toaster } from '@/components/ui/toaster'

type OrganizationFormProps = {
    open: boolean
    onClose: () => void
    organization?: Organization | null
    onSuccess: () => void
}

export function OrganizationForm({ open, onClose, organization, onSuccess }: OrganizationFormProps) {
    const t = useTranslations('admin')
    const [name, setName] = useState(organization?.name || '')
    const [imageUrl, setImageUrl] = useState(organization?.imageUrl || '')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setName(organization?.name || '')
            setImageUrl(organization?.imageUrl || '')
        }
    }, [open, organization])

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

            toaster.create({
                description: organization ? t('organizationUpdated') : t('organizationCreated'),
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
                            <Dialog.Title fontSize="2xl">
                                {organization ? t('editOrganization') : t('addOrganization')}
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <form id="organization-form" onSubmit={handleSubmit}>
                                <VStack align="stretch" gap="1rem" maxW="600px">
                                    <Box>
                                        <Text mb="0.5rem">{t('name')}</Text>
                                        <Input required value={name} onChange={(e) => setName(e.target.value)} />
                                    </Box>

                                    <Box>
                                        <Text mb="0.5rem">{t('imageUrl')}</Text>
                                        <ImageUpload value={imageUrl} onChange={setImageUrl} />
                                    </Box>
                                </VStack>
                            </form>
                        </Dialog.Body>

                        <Dialog.Footer mt="1rem">
                            <Button variant="outline" disabled={loading} onClick={onClose}>
                                {t('cancel')}
                            </Button>
                            <Button type="submit" form="organization-form" disabled={loading || !name.trim() || !imageUrl}>
                                {organization ? t('editOrganization') : t('addOrganization')}
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
