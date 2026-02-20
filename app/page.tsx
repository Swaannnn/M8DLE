'use client'

import {
    AbsoluteCenter,
    Button,
    CloseButton,
    Dialog,
    Heading,
    Portal,
    Spinner,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react'
import localFont from 'next/font/local'
import InputPlayersAutocomplete from '@/components/InputPlayersAutocomplete'
import TablePlayers from '@/components/TablePlayers'
import { getPlayerOfTheDay } from '@/utils/getPlayerOfTheDay'
import { useM8dleStatus } from '@/hooks/use-m8dle-status'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'

const tuskerGrotesk = localFont({ src: './fonts/TuskerGrotesk-4800Super.woff2' })

const Home = () => {
    const { loading } = useAuth()
    const { selectedPlayers, availablePlayers, win, addAttempt } = useM8dleStatus()

    const [dailyWinners, setDailyWinners] = useState(0)

    const playerOfTheDay = getPlayerOfTheDay()

    useEffect(() => {
        const fetchDailyWinners = async () => {
            const res = await fetch('/api/m8dle/dailywinners')
            const data = await res.json()
            setDailyWinners(data.successCount)
        }
        fetchDailyWinners()
    }, [win])

    if (loading) {
        return (
            <AbsoluteCenter>
                <Spinner size="xl" />
            </AbsoluteCenter>
        )
    }

    const dailyWinnerText =
        dailyWinners === 0
            ? "Personne n'a encore trouvé le joueur du jour."
            : dailyWinners === 1
              ? '1 personne a déjà trouvé le joueur du jour.'
              : `${dailyWinners} personnes ont déjà trouvé le joueur du jour.`
    return (
        <VStack
            width="90vw"
            mx="auto"
            gap="1rem"
        >
            <Text
                fontSize="7.5rem"
                className={tuskerGrotesk.className}
            >
                M8DLE
            </Text>

            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <Button variant="outline">Précisions</Button>
                </Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Précisions</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Stack gap="2rem">
                                    <Stack>
                                        <Heading size="md">1. Mise à jour des données</Heading>
                                        <Text>
                                            La dernière mise à jour des données a été effectuée le 20 février 2026. Nous
                                            vous invitons à nous faire part de tout retour si vous constatez une
                                            information erronée ou incohérente, afin que nous puissions la corriger dans
                                            les plus brefs délais.
                                        </Text>
                                    </Stack>
                                    <Stack>
                                        <Heading size="md">2. Affichage des équipes</Heading>
                                        <Text>
                                            Les équipes affichées correspondent aux structures principales. Par exemple,
                                            G2 Minnesota, Twisted Minds Orchid ou Karmine Corp Blue seront
                                            respectivement présentées sous les noms G2 Esports, Twisted Minds et Karmine
                                            Corp.
                                        </Text>
                                    </Stack>
                                    <Stack>
                                        <Heading size="md">3. A vous de jouer !</Heading>
                                        <Text>
                                            Entrez le nom d&apos;un joueur et laissez chaque erreur vous rapprocher de
                                            la bonne réponse.
                                        </Text>
                                    </Stack>
                                </Stack>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button size="sm">Fermer</Button>
                                </Dialog.ActionTrigger>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

            {win ? (
                <Text
                    fontSize="2xl"
                    textAlign="center"
                >
                    Bravo ! Revenez demain pour le prochain joueur.
                </Text>
            ) : (
                <InputPlayersAutocomplete
                    onPlayerSelected={addAttempt}
                    availablePlayers={availablePlayers}
                />
            )}

            <Text>{dailyWinnerText}</Text>

            <TablePlayers
                playerOfTheDay={playerOfTheDay}
                players={selectedPlayers}
            />
        </VStack>
    )
}

export default Home
