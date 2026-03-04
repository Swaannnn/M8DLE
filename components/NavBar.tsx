'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button, Drawer, HStack, Link, Portal, Text, useBreakpointValue, VStack } from '@chakra-ui/react'
import { ColorModeButton } from './ui/color-mode'
import NextLink from 'next/link'
import { LuMenu } from 'react-icons/lu'
import { useState } from 'react'
import LangSwitcher from './LangSwitcher'

const NavBar = () => {
    const { user, loading } = useAuth()
    const isMobile = useBreakpointValue({ base: true, md: false })

    const [open, setOpen] = useState(false)

    const handleClose = () => setOpen(false)

    if (loading) {
        return null
    }

    return (
        <HStack
            width="100%"
            position="fixed"
            top="0"
            justify="space-between"
            bg="bg"
            padding="1rem 2rem"
            borderBottomWidth="1px"
            borderColor="fg"
            zIndex="100"
        >
            <HStack gap="1rem">
                <Link
                    onClick={handleClose}
                    asChild
                >
                    <NextLink href="/">Accueil</NextLink>
                </Link>
            </HStack>
            {isMobile ? (
                <Drawer.Root
                    open={open}
                    onOpenChange={(details) => setOpen(details.open)}
                >
                    <Drawer.Trigger asChild>
                        <Button
                            variant="ghost"
                            onClick={() => setOpen(true)}
                            aria-label="Ouvrir le menu"
                        >
                            <LuMenu />
                        </Button>
                    </Drawer.Trigger>
                    <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                            <Drawer.Content>
                                <Drawer.Body>
                                    <VStack
                                        paddingTop="1rem"
                                        align="start"
                                        justifyContent="space-between"
                                        h="100%"
                                        w="100%"
                                    >
                                        <VStack
                                            w="100%"
                                            gap="1rem"
                                        >
                                            <HStack
                                                width="100%"
                                                alignItems="start"
                                                justifyContent="space-between"
                                                borderBottomWidth="1px"
                                                paddingBottom="1rem"
                                            >
                                                <ColorModeButton />
                                                <Button
                                                    variant="ghost"
                                                    onClick={handleClose}
                                                >
                                                    <LuMenu />
                                                </Button>
                                            </HStack>
                                            <VStack
                                                align="start"
                                                w="100%"
                                            >
                                                <Link
                                                    onClick={handleClose}
                                                    asChild
                                                >
                                                    <NextLink href="/">Accueil</NextLink>
                                                </Link>
                                                <Link
                                                    onClick={handleClose}
                                                    asChild
                                                >
                                                    <NextLink href="/leaderboard">Classement</NextLink>
                                                </Link>
                                                {user ? (
                                                    <Link
                                                        onClick={handleClose}
                                                        asChild
                                                    >
                                                        <NextLink href="/account">Mon Compte</NextLink>
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        onClick={handleClose}
                                                        asChild
                                                    >
                                                        <NextLink href="/login">Se connecter</NextLink>
                                                    </Link>
                                                )}
                                            </VStack>
                                        </VStack>
                                        <VStack
                                            align="start"
                                            gap="0.5rem"
                                            pt="1rem"
                                            borderTopWidth="1px"
                                            w="100%"
                                        >
                                            <Link
                                                onClick={handleClose}
                                                asChild
                                            >
                                                <NextLink href="/credits">Crédits</NextLink>
                                            </Link>
                                            <Link
                                                onClick={handleClose}
                                                asChild
                                            >
                                                <NextLink href="/privacy">Politique de confidentialité</NextLink>
                                            </Link>
                                            <Link
                                                onClick={handleClose}
                                                asChild
                                            >
                                                <NextLink href="/legal">Mentions légales</NextLink>
                                            </Link>
                                            <Text p="1rem 0">© 2026 M8DLE</Text>
                                        </VStack>
                                    </VStack>
                                </Drawer.Body>
                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal>
                </Drawer.Root>
            ) : (
                <HStack gap="1rem">
                    <Link asChild>
                        <NextLink href="/leaderboard">Classement</NextLink>
                    </Link>
                    {user ? (
                        <Link asChild>
                            <NextLink href="/account">Mon Compte</NextLink>
                        </Link>
                    ) : (
                        <Link asChild>
                            <NextLink href="/login">Se connecter</NextLink>
                        </Link>
                    )}
                    <LangSwitcher />
                    <ColorModeButton />
                </HStack>
            )}
        </HStack>
    )
}

export default NavBar
