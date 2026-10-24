'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button, Drawer, HStack, Link, Portal, Text, useBreakpointValue, VStack } from '@chakra-ui/react'
import { ColorModeButton } from './ui/color-mode'
import NextLink from 'next/link'
import { LuMenu } from 'react-icons/lu'
import { useState } from 'react'
import LangSwitcher from './LangSwitcher'
import { useTranslations } from 'next-intl'
import { Role } from '@prisma/client'
import LoginDialog from './LoginDialog'

type NavItemProps = {
    href?: string
    label: string
    disabled?: boolean
    onClick?: () => void
}

const NavItem = ({ href, label, disabled, onClick }: NavItemProps) => {
    if (disabled) {
        return (
            <Text
                color="fg.muted"
                cursor="not-allowed"
                aria-disabled="true"
            >
                {label}
            </Text>
        )
    }

    if (href) {
        return (
            <Link
                onClick={onClick}
                asChild
            >
                <NextLink href={href}>{label}</NextLink>
            </Link>
        )
    }

    return (
        <Link
            onClick={onClick}
            cursor="pointer"
        >
            {label}
        </Link>
    )
}

const NavBar = ({ maintenance = false }: { maintenance?: boolean }) => {
    const { user, loading } = useAuth()
    const isMobile = useBreakpointValue({ base: true, md: false })
    const t = useTranslations('header')

    const [open, setOpen] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)

    const handleClose = () => setOpen(false)

    if (loading) {
        return null
    }

    return (
        <>
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
                        <NextLink href="/">{t('home')}</NextLink>
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
                                                    <HStack>
                                                        <LangSwitcher />
                                                        <ColorModeButton />
                                                    </HStack>
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
                                                    <NavItem
                                                        href="/"
                                                        label={t('home')}
                                                        onClick={handleClose}
                                                    />
                                                    <NavItem
                                                        href="/leaderboard"
                                                        label={t('leaderboard')}
                                                        disabled={maintenance}
                                                        onClick={handleClose}
                                                    />
                                                    {user ? (
                                                        <>
                                                            {user.role === Role.ADMIN && (
                                                                <NavItem
                                                                    href="/admin"
                                                                    label={t('admin')}
                                                                    disabled={maintenance}
                                                                    onClick={handleClose}
                                                                />
                                                            )}
                                                            <NavItem
                                                                href="/account"
                                                                label={t('myAccount')}
                                                                disabled={maintenance}
                                                                onClick={handleClose}
                                                            />
                                                        </>
                                                    ) : (
                                                        <NavItem
                                                            label={t('login')}
                                                            disabled={maintenance}
                                                            onClick={() => {
                                                                handleClose()
                                                                setLoginOpen(true)
                                                            }}
                                                        />
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
                                                <NavItem
                                                    href="/credits"
                                                    label={t('credits')}
                                                />
                                                <NavItem
                                                    href="/privacy"
                                                    label={t('privacyPolicy')}
                                                />
                                                <NavItem
                                                    href="/legal"
                                                    label={t('legalNotice')}
                                                />
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
                        <NavItem
                            href="/leaderboard"
                            label={t('leaderboard')}
                            disabled={maintenance}
                        />
                        {user ? (
                            <>
                                {user.role === Role.ADMIN && (
                                    <NavItem
                                        href="/admin"
                                        label={t('admin')}
                                        disabled={maintenance}
                                    />
                                )}
                                <NavItem
                                    href="/account"
                                    label={t('myAccount')}
                                    disabled={maintenance}
                                />
                            </>
                        ) : (
                            <NavItem
                                label={t('login')}
                                disabled={maintenance}
                                onClick={() => setLoginOpen(true)}
                            />
                        )}
                        <LangSwitcher />
                        <ColorModeButton />
                    </HStack>
                )}
            </HStack>
            <LoginDialog
                open={loginOpen && !maintenance}
                onClose={() => setLoginOpen(false)}
            />
        </>
    )
}

export default NavBar
