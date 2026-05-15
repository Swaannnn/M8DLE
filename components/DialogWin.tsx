'use client'

import { Button, CloseButton, Dialog, Portal, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { getPlayerOfTheDay } from '@/utils/playersUtils'

type DialogWinProps = {
    isOpen: boolean
    onClose: () => void
    nbPlayers: number
}

const DialogWin = ({ isOpen, onClose, nbPlayers }: DialogWinProps) => {
    const t = useTranslations('dialogWin')
    const playerOfTheDay = getPlayerOfTheDay()
    const shareText = t('shareText', { nbPlayers })

    // On ne rend rien si ce n'est pas ouvert (optimisation)
    if (!isOpen) return null;

    return (
        <Dialog.Root 
            open={isOpen} 
            onOpenChange={(details) => !details.open && onClose()}
            size="lg"
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{t('title')}</Dialog.Title>
                        </Dialog.Header>
                        
                        <Dialog.Body>
                            <VStack gap="4">
                                <Text>
                                    {t('winnerMessagePrefix')} <strong>{playerOfTheDay.name}</strong> {t('winnerMessageSuffix')}
                                </Text>
                                <Image src={playerOfTheDay.image} alt="player" height={120} width={120} />
                                <Text>{t('attemptsMessage', { nbPlayers })}</Text>
                                
                                <Button variant="outline" onClick={() => navigator.clipboard.writeText(shareText)}>
                                    {t('copyText')}
                                </Button>
                                <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const text = shareText
                                            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
                                            window.open(url, '_blank')
                                        }}
                                    >
                                    {t('shareOnX')}
                                </Button>
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

export default DialogWin