'use client'

import { Box, Button, CloseButton, Dialog, Heading, HStack, Portal, Stack, Text } from '@chakra-ui/react'
import { grey, lightGrey, pink } from '@/constants/colors'
import { LuChevronsDown, LuChevronsUp } from 'react-icons/lu'
import { useColorMode } from './ui/color-mode'
import { useTranslations } from 'next-intl'

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
    const t = useTranslations('precisions')

    const invalidGrey = colorMode === 'light' ? lightGrey : grey
    const arrowColor = colorMode === 'light' ? grey : lightGrey

    return (
        <Dialog.Root size="lg">
            <Dialog.Trigger asChild>
                <Button variant="outline">{t('precisions')}</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content height="80vh">
                        <Dialog.Header>
                            <Dialog.Title>{t('precisions')}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body overflow="auto">
                            <Stack gap="2rem">
                                <Stack>
                                    <Heading size="md">{t('responseIndicatorsTitle')}</Heading>
                                    <Text>{t('responseIndicatorsContent')}</Text>

                                    <Stack gap="1rem">
                                        <HStack justifyContent="center">
                                            <FeedbackBox bg={pink}>
                                                <Text
                                                    zIndex="10"
                                                    fontSize="md"
                                                    fontWeight="bold"
                                                    textAlign="center"
                                                >
                                                    {t('correct')}
                                                </Text>
                                            </FeedbackBox>
                                            <FeedbackBox bg={invalidGrey}>
                                                <Text
                                                    zIndex="10"
                                                    fontSize="md"
                                                    fontWeight="bold"
                                                    textAlign="center"
                                                >
                                                    {t('incorrect')}
                                                </Text>
                                            </FeedbackBox>
                                        </HStack>
                                        <Text textAlign="center">
                                            {t.rich('pinkBox', {
                                                strong: (chunks) => <strong>{chunks}</strong>,
                                            })}
                                            <br />
                                            {t.rich('greyBox', {
                                                strong: (chunks) => <strong>{chunks}</strong>,
                                            })}
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
                                            {t.rich('upArrows', {
                                                strong: (chunks) => <strong>{chunks}</strong>,
                                            })}
                                            <br />
                                            {t.rich('downArrows', {
                                                strong: (chunks) => <strong>{chunks}</strong>,
                                            })}
                                        </Text>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Heading size="md">{t('dataUpdateTitle')}</Heading>
                                    <Text>{t('dataUpdateContent')}</Text>
                                </Stack>
                                <Stack>
                                    <Heading size="md">{t('displayingTeamsTitle')}</Heading>
                                    <Text>{t('displayingTeamsContent')}</Text>
                                </Stack>
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button size="sm">{t('close')}</Button>
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
