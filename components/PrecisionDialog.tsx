'use client'

import { Box, Button, CloseButton, Dialog, Heading, HStack, Portal, Stack, Text } from '@chakra-ui/react'
import { grey, lightGrey, pink } from '@/constants/colors'
import { LuChevronsDown, LuChevronsUp } from 'react-icons/lu'
import { useColorMode } from './ui/color-mode'

const FeedbackBox = ({ children, bg }: { children: React.ReactNode; bg: string }) => (
    <Box
        style={{
            width: '80px',
            height: '80px',
            color: '#34242e',
            borderRadius: '0.2rem',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: bg,
            position: 'relative',
        }}
    >
        {children}
    </Box>
)

const PrecisionDialog = () => {
    const { colorMode } = useColorMode()

    const invalidGrey = colorMode === 'light' ? lightGrey : grey
    const arrowColor = colorMode === 'light' ? grey : lightGrey

    return (
        <Dialog.Root size="lg">
            <Dialog.Trigger asChild>
                <Button variant="outline">Précisions</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content height="80vh">
                        <Dialog.Header>
                            <Dialog.Title>Précisions</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body overflow="auto">
                            <Stack gap="2rem">
                                <Stack>
                                    <Heading size="md">1. Indicateurs de réponses</Heading>
                                    <Text>
                                        Après chaque tentative, des indicateurs apparaissent pour vous aider à vous
                                        rapprocher du joueur du jour.
                                    </Text>

                                    <Stack gap="1rem">
                                        <HStack justifyContent="center">
                                            <FeedbackBox bg={pink}>
                                                <Text
                                                    zIndex="10"
                                                    fontSize="md"
                                                    fontWeight="bold"
                                                    textAlign="center"
                                                >
                                                    Correct
                                                </Text>
                                            </FeedbackBox>
                                            <FeedbackBox bg={invalidGrey}>
                                                <Text
                                                    zIndex="10"
                                                    fontSize="md"
                                                    fontWeight="bold"
                                                    textAlign="center"
                                                >
                                                    Incorrect
                                                </Text>
                                            </FeedbackBox>
                                        </HStack>
                                        <Text textAlign="center">
                                            <strong>Case rose :</strong> l&apos;information est correcte.
                                            <br />
                                            <strong>Case grise :</strong> l&apos;information est incorrecte.
                                        </Text>
                                    </Stack>

                                    <Stack gap="1rem">
                                        <HStack justifyContent="center">
                                            <FeedbackBox bg={invalidGrey}>
                                                <LuChevronsUp
                                                    style={{
                                                        position: 'absolute',
                                                        fontSize: '4rem',
                                                        zIndex: 0,
                                                        color: arrowColor,
                                                    }}
                                                />
                                                <Text
                                                    zIndex="10"
                                                    fontSize="md"
                                                    fontWeight="bold"
                                                    textAlign="center"
                                                >
                                                    2025
                                                </Text>
                                            </FeedbackBox>
                                            <FeedbackBox bg={invalidGrey}>
                                                <Text
                                                    zIndex="10"
                                                    fontSize="md"
                                                    fontWeight="bold"
                                                    textAlign="center"
                                                >
                                                    21
                                                </Text>
                                                <LuChevronsDown
                                                    style={{
                                                        position: 'absolute',
                                                        fontSize: '4rem',
                                                        zIndex: 0,
                                                        color: arrowColor,
                                                    }}
                                                />
                                            </FeedbackBox>
                                        </HStack>
                                        <Text textAlign="center">
                                            <strong>Flèches vers le haut :</strong> la valeur recherchée est supérieure
                                            à celle proposée.
                                            <br />
                                            <strong>Flèches vers le bas :</strong> la valeur recherchée est inférieure à
                                            celle proposée.
                                        </Text>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Heading size="md">2. Mise à jour des données</Heading>
                                    <Text>
                                        La dernière mise à jour des données a été effectuée le 20 février 2026. Nous
                                        vous invitons à nous faire part de tout retour si vous constatez une information
                                        erronée ou incohérente, afin que nous puissions la corriger dans les plus brefs
                                        délais.
                                    </Text>
                                </Stack>
                                <Stack>
                                    <Heading size="md">3. Affichage des équipes</Heading>
                                    <Text>
                                        Les équipes affichées correspondent aux structures principales. Par exemple, G2
                                        Minnesota, Twisted Minds Orchid ou Karmine Corp Blue seront respectivement
                                        présentées sous les noms G2 Esports, Twisted Minds et Karmine Corp.
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
    )
}

export default PrecisionDialog
