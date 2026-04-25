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
                                <Dialog.Title>Bravo !</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body overflow="auto">
                                <VStack>
                                    <VStack>
                                        <Text>
                                            Bravo ! Le joueur du jour était <strong>{playerOfTheDay.name}</strong> !
                                        </Text>
                                        <Image
                                            src={playerOfTheDay.image}
                                            alt="player of the game image"
                                            height={120}
                                            width={120}
                                        />
                                        <Text>
                                            tu l&apos;as trouvé en <strong>{nbPlayers} essais.</strong>
                                        </Text>
                                    </VStack>
                                    <Text>Partager :</Text>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                `J'ai trouvé le joueur du jour en ${nbPlayers} essais sur M8DLE (https://m8dle.com) ! #M8WIN #M8DLE`
                                            )
                                        }
                                    >
                                        copier le texte
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const text =
                                                "J'ai trouvé le joueur du jour en 5 essais sur M8DLE (https://m8dle.com) ! #M8WIN #M8DLE"
                                            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
                                            window.open(url, '_blank')
                                        }}
                                    >
                                        poster sur X
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
