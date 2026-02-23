'use client'

import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import type { Player } from '@/types/player'
import { getAge, getYear } from '@/utils/dateUtils'
import ReactCountryFlag from 'react-country-flag'
import Image from 'next/image'
import { LuChevronsDown, LuChevronsUp } from 'react-icons/lu'
import { motion, type Variants } from 'framer-motion'
import { TABLE_PLAYERS_WIDTH } from '@/constants/sizes'
import { useColorMode } from './ui/color-mode'
import { grey, lightGrey, pink } from '@/constants/colors'

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
}

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 5,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
}

const MotionDiv = motion.div

const MOTION_DIV_STYLE: React.CSSProperties = {
    width: '120px',
    height: '120px',
    color: '#34242e',
    borderRadius: '0.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
}

const HeaderItem = ({ children }: { children: React.ReactNode }) => {
    return (
        <Text
            fontWeight="bold"
            width="120px"
            textAlign="center"
            borderBottom="2px solid #f4baea"
        >
            {children}
        </Text>
    )
}

type RowNumberProps = {
    isValid?: boolean
    isMore?: boolean
    isLess?: boolean
    children: React.ReactNode
}

const RowNumber = ({ isValid = false, isMore, isLess, children }: RowNumberProps) => {
    const { colorMode } = useColorMode()
    const invalidGrey = colorMode === 'light' ? lightGrey : grey
    const arrowColor = colorMode === 'light' ? grey : lightGrey

    return (
        <MotionDiv
            variants={itemVariants}
            style={{
                ...MOTION_DIV_STYLE,
                backgroundColor: isValid ? pink : invalidGrey,
                position: 'relative',
            }}
        >
            {isMore && (
                <LuChevronsUp
                    style={{
                        position: 'absolute',
                        fontSize: '6rem',
                        zIndex: 0,
                        color: arrowColor,
                    }}
                />
            )}
            <Text
                zIndex="10"
                fontSize="3xl"
                fontWeight="bold"
            >
                {children}
            </Text>
            {isLess && (
                <LuChevronsDown
                    style={{
                        position: 'absolute',
                        fontSize: '6rem',
                        zIndex: 0,
                        color: arrowColor,
                    }}
                />
            )}
        </MotionDiv>
    )
}

type RowItemProps = {
    isValid?: boolean
    children: React.ReactNode
}

const RowItem = ({ isValid = false, children }: RowItemProps) => {
    const { colorMode } = useColorMode()
    const invalidGrey = colorMode === 'light' ? lightGrey : grey
    return (
        <MotionDiv
            variants={itemVariants}
            style={{
                ...MOTION_DIV_STYLE,
                backgroundColor: isValid ? pink : invalidGrey,
            }}
        >
            {children}
        </MotionDiv>
    )
}

type TablePlayersProps = {
    playerOfTheDay: Player
    players: Player[]
}

const TablePlayers = ({ playerOfTheDay, players }: TablePlayersProps) => {
    return (
        <Box
            width="100%"
            overflowX="auto"
            overflowY="hidden"
        >
            <VStack minWidth={TABLE_PLAYERS_WIDTH}>
                <HStack>
                    <HeaderItem>Joueur</HeaderItem>
                    <HeaderItem>Jeu</HeaderItem>
                    <HeaderItem>Nationalité</HeaderItem>
                    <HeaderItem>Arrivée</HeaderItem>
                    <HeaderItem>Avant M8</HeaderItem>
                    <HeaderItem>Club actuel</HeaderItem>
                    <HeaderItem>Age</HeaderItem>
                </HStack>
                {[...players].reverse().map((player) => {
                    const joinDatePlayer = getYear(player.joinDate)
                    const joinDatePlayerOfTheDay = getYear(playerOfTheDay.joinDate)

                    const agePlayer = getAge(player.birthDate)
                    const agePlayerOfTheDay = getAge(playerOfTheDay.birthDate)

                    return (
                        <MotionDiv
                            key={player.name}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <HStack key={player.name}>
                                {/* <RowItem isValid={playerOfTheDay.name === player.name}>{player.name}</RowItem> */}
                                <RowItem isValid={playerOfTheDay.name === player.name}>
                                    <Image
                                        src={player.image}
                                        alt={player.name}
                                        width={120}
                                        height={120}
                                    />
                                </RowItem>
                                <RowItem isValid={playerOfTheDay.game.name === player.game.name}>
                                    <Image
                                        src={player.game.logo}
                                        alt={player.game.name}
                                        width={80}
                                        height={80}
                                    />
                                </RowItem>
                                <RowItem isValid={playerOfTheDay.nationality === player.nationality}>
                                    <ReactCountryFlag
                                        svg
                                        style={{
                                            width: '80%',
                                            height: '80%',
                                        }}
                                        countryCode={player.nationality}
                                    />
                                </RowItem>
                                <RowNumber
                                    isLess={joinDatePlayer > joinDatePlayerOfTheDay}
                                    isMore={joinDatePlayer < joinDatePlayerOfTheDay}
                                    isValid={joinDatePlayer === joinDatePlayerOfTheDay}
                                >
                                    {joinDatePlayer}
                                </RowNumber>
                                <RowItem
                                    isValid={
                                        playerOfTheDay.previousOrganization.name === player.previousOrganization.name
                                    }
                                >
                                    {player.previousOrganization.logo ? (
                                        <Image
                                            src={player.previousOrganization.logo}
                                            alt={player.previousOrganization.name}
                                            width={80}
                                            height={80}
                                        />
                                    ) : (
                                        <Text>{player.previousOrganization.name}</Text>
                                    )}
                                </RowItem>
                                <RowItem
                                    isValid={playerOfTheDay.lastOrganization.name === player.lastOrganization.name}
                                >
                                    {player.lastOrganization.logo ? (
                                        <Image
                                            src={player.lastOrganization.logo}
                                            alt={player.lastOrganization.name}
                                            width={80}
                                            height={80}
                                        />
                                    ) : (
                                        <Text>{player.lastOrganization.name}</Text>
                                    )}
                                </RowItem>
                                <RowNumber
                                    isLess={agePlayer > agePlayerOfTheDay}
                                    isMore={agePlayer < agePlayerOfTheDay}
                                    isValid={agePlayer === agePlayerOfTheDay}
                                >
                                    {agePlayer}
                                </RowNumber>
                            </HStack>
                        </MotionDiv>
                    )
                })}
            </VStack>
        </Box>
    )
}

export default TablePlayers
