'use client'

import LoginDiscord from '@/components/LoginDiscord'
import { tuskerGrotesk } from '@/utils/fontUtils'
import { CloseButton, Dialog, Portal, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

type LoginDialogProps = {
    open: boolean
    onClose: () => void
}

const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
    const t = useTranslations('login')

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) => !details.open && onClose()}
            size="md"
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content p="4" bg="bg.panel">
                        <Dialog.Body>
                            <VStack
                                mx="auto"
                                gap="1rem"
                            >
                                <Text
                                    as="h1"
                                    fontSize={{ base: '2rem', md: '2.5rem' }}
                                    className={tuskerGrotesk.className}
                                    paddingBottom="3rem"
                                >
                                    {t('loginFullCaps')}
                                </Text>
                            </VStack>
                            <VStack gap="1.5rem" py="1rem" textAlign="center">
                                <LoginDiscord />
                            </VStack>
                        </Dialog.Body>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default LoginDialog
