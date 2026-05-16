'use client'

import { CloseButton, Dialog, HStack, IconButton, Portal, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { getPlayerOfTheDay } from '@/utils/playersUtils'
import LoginDiscord from './LoginDiscord'
import { useAuth } from '@/hooks/use-auth'
import TwitterIcon from './icons/TwitterIcon'
import CopyButton from './CopyButton'
import { Tooltip } from './ui/tooltip'
import constantsUrl from '@/constants/constantsUrl'

type DialogWinProps = {
    isOpen: boolean
    onClose: () => void
    nbPlayers: number
}

const DialogWin = ({ isOpen, onClose, nbPlayers }: DialogWinProps) => {
    const t = useTranslations('dialogWin')
    const { loggedOut } = useAuth()
    const playerOfTheDay = getPlayerOfTheDay()
    const shareText = t('shareText', { nbPlayers, m8dleUrl: constantsUrl.M8DLE_URL })

    if (!isOpen) return null

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
                                <Text fontSize="lg">
                                    {t('winnerMessagePrefix')} <strong>{playerOfTheDay.name}</strong>{' '}
                                    {t('winnerMessageSuffix')}
                                </Text>
                                <Image
                                    src={playerOfTheDay.image}
                                    alt="player"
                                    height={160}
                                    width={160}
                                />
                                <Text>{t('attemptsMessage', { nbPlayers })}</Text>

                                <VStack>
                                    <Text>{t('share')}</Text>
                                    <HStack>
                                        <CopyButton
                                            text={shareText}
                                            variant="icon"
                                        />
                                        <Tooltip content={t('shareOn') + ' X'}>
                                            <IconButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const url =
                                                        constantsUrl.TWITTER_SHARE_URL + encodeURIComponent(shareText)
                                                    window.open(url, '_blank')
                                                }}
                                            >
                                                <TwitterIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </HStack>
                                </VStack>
                            </VStack>
                            {loggedOut && (
                                <VStack pt="2rem">
                                    <LoginDiscord />
                                </VStack>
                            )}
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
