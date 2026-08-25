import { useState, useMemo } from 'react'
import { VStack, Stack, Input, Button, AbsoluteCenter, Spinner, Dialog, Portal, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { LuPlus } from 'react-icons/lu'
import { OrganizationsTable } from './OrganizationsTable'
import { OrganizationForm } from './OrganizationForm'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import type { Organization } from '@prisma/client'
import type { ApiError } from 'next/dist/server/api-utils'
import { ApiErrorMessage } from '@/components/ApiErrorMessage'
import { useApiErrorToast, useShowApiErrorToast } from '@/hooks/use-api-error-toast'

export function OrganizationsTab() {
    const t = useTranslations('admin')
    const showApiErrorToast = useShowApiErrorToast()

    const { data: organizations, error, mutate, isLoading } = useSWR<Organization[], ApiError>(
        '/api/organizations',
        fetcher
    )

    useApiErrorToast(error)

    const deleteOrganization = async (orgId: string) => {
        try {
            await fetcher(`/api/organizations?organizationId=${orgId}`, { method: 'DELETE' })
            mutate()
        } catch (err) {
            showApiErrorToast(err)
        }
    }

    const [searchName, setSearchName] = useState('')
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [orgToDelete, setOrgToDelete] = useState<string | null>(null)

    const filteredOrganizations = useMemo(() => {
        if (!organizations) return []
        return organizations.filter((org) => org.name.toLowerCase().includes(searchName.toLowerCase()))
    }, [organizations, searchName])

    const confirmDelete = async () => {
        if (!orgToDelete) return
        await deleteOrganization(orgToDelete)
        setOrgToDelete(null)
    }

    const requestDelete = (orgId: string) => {
        setOrgToDelete(orgId)
    }

    const openCreateForm = () => {
        setEditingOrg(null)
        setIsFormOpen(true)
    }

    const openEditForm = (org: Organization) => {
        setEditingOrg(org)
        setIsFormOpen(true)
    }

    return (
        <>
            <VStack align="stretch" gap="1rem">
                <Stack direction={{ base: 'column', lg: 'row' }} justify="space-between" mb="1rem" gap="1rem">
                    <Input
                        placeholder={t('searchOrganization')}
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        maxW={{ base: 'full', lg: '400px' }}
                    />
                    <Button variant="outline" onClick={openCreateForm} w={{ base: 'full', lg: 'auto' }}>
                        <LuPlus /> {t('addOrganization')}
                    </Button>
                </Stack>

                {error ? (
                    <ApiErrorMessage error={error} />
                ) : isLoading || !organizations ? (
                    <AbsoluteCenter>
                        <Spinner marginTop="3rem" size="xl" />
                    </AbsoluteCenter>
                ) : (
                    <OrganizationsTable
                        organizations={filteredOrganizations}
                        onEdit={openEditForm}
                        onDelete={requestDelete}
                    />
                )}
            </VStack>

            <OrganizationForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                organization={editingOrg}
                onSuccess={() => {
                    setIsFormOpen(false)
                    mutate()
                }}
            />

            <Dialog.Root
                open={!!orgToDelete}
                onOpenChange={(details) => !details.open && setOrgToDelete(null)}
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content bg="bg.panel">
                            <Dialog.Header>
                                <Dialog.Title fontSize="xl">{t('deleteConfirmOrgTitle')}</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Text>{t('deleteConfirmOrgText')}</Text>
                            </Dialog.Body>
                            <Dialog.Footer mt="1rem">
                                <Button variant="outline" onClick={() => setOrgToDelete(null)}>
                                    {t('cancel')}
                                </Button>
                                <Button colorPalette="red" onClick={confirmDelete}>
                                    {t('deleteOrganization')}
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    )
}
