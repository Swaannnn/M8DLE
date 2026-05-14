'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button, CloseButton, Dialog, Portal, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import LoginDiscord from './LoginDiscord'
import { getPlayerOfTheDay } from '@/utils/playersUtils'

type DialogWinProps = {
    open: boolean
    setIsOpen: (open: boolean) => void
    nbPlayers: number
}

const DialogWin = ({ open, setIsOpen, nbPlayers }: DialogWinProps) => {
    const t = useTranslations('dialogWin')
    const { loading, loggedOut } = useAuth()

    const playerOfTheDay = getPlayerOfTheDay()
    const shareText = t('shareText', { nbPlayers })

    return (
        !loading && (
            <Dialog.Root
                size="lg"
                open={open}
                onOpenChange={() => {
                    setIsOpen(false)
                }}
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>{t('title')}</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body overflow="auto">
                                <VStack>
                                    <VStack>
                                        <Text>
                                            {t('winnerMessagePrefix')} <strong>{playerOfTheDay.name}</strong>{' '}
                                            {t('winnerMessageSuffix')}
                                        </Text>
                                        <Image
                                            src={playerOfTheDay.image}
                                            alt="player of the game image"
                                            height={120}
                                            width={120}
                                        />
                                        <Text>
                                            {t('attemptsMessage', { nbPlayers })}
                                        </Text>
                                    </VStack>
                                    <Text>{t('share')}</Text>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigator.clipboard.writeText(shareText)}
                                    >
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
                                {loggedOut && (
                                    <VStack pt="2rem">
                                        <LoginDiscord />
                                    </VStack>
                                )}
                            </Dialog.Body>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton
                                    onClick={() => setIsOpen(false)}
                                    size="sm"
                                />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        )
    )
}

export default DialogWin
