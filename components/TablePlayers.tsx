'use client'

import { HStack, Text, VStack } from '@chakra-ui/react'
import type { Player } from '@/types/player'
import { getAge, getYear } from '@/utils/dateUtils'
import ReactCountryFlag from 'react-country-flag'
import Image from 'next/image'
import { LuChevronsDown, LuChevronsUp } from 'react-icons/lu'
import { motion, type Variants } from 'framer-motion'

const INVALID_GREY = '#7f848e'
const ARROW_GREY = '#a1a7b4'
const VALID_PINK = '#efa0e1'

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
        y: 1,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
}

const MotionDiv = motion.div

const HeaderItem = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            style={{
                fontWeight: 'bold',
                width: '120px',
                textAlign: 'center',
                borderBottom: '2px solid #f4baea',
            }}
        >
            {children}
        </div>
    )
}

type RowNumberProps = {
    isValid?: boolean
    isMore?: boolean
    isLess?: boolean
    children: React.ReactNode
}

const ARROW_STYLE: React.CSSProperties = {
    position: 'absolute',
    color: ARROW_GREY,
    fontSize: '6rem',
    zIndex: 0,
}

const RowNumber = ({ isValid = false, isMore, isLess, children }: RowNumberProps) => {
    return (
        <MotionDiv
            variants={itemVariants}
            style={{
                width: '120px',
                height: '120px',
                backgroundColor: isValid ? VALID_PINK : INVALID_GREY,
                color: '#34242e',
                borderRadius: '0.2rem',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {isMore && <LuChevronsUp style={ARROW_STYLE} />}
            <Text
                zIndex="10"
                fontSize="3xl"
                fontWeight="bold"
            >
                {children}
            </Text>
            {isLess && <LuChevronsDown style={ARROW_STYLE} />}
        </MotionDiv>
    )
}

type RowItemProps = {
    isValid?: boolean
    children: React.ReactNode
}

const RowItem = ({ isValid = false, children }: RowItemProps) => {
    return (
        <MotionDiv
            variants={itemVariants}
            style={{
                width: '120px',
                height: '120px',
                backgroundColor: isValid ? VALID_PINK : INVALID_GREY,
                color: '#34242e',
                borderRadius: '0.2rem',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
        <VStack>
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
                return (
                    <MotionDiv
                        key={player.name}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <HStack key={player.name}>
                            <RowItem isValid={playerOfTheDay.name === player.name}>{player.name}</RowItem>
                            <RowItem isValid={playerOfTheDay.game === player.game}>{player.game}</RowItem>
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
                                isValid={playerOfTheDay.previousOrganization.name === player.previousOrganization.name}
                            >
                                <Image
                                    src={player.previousOrganization.logo}
                                    alt={player.previousOrganization.name}
                                    width={80}
                                    height={80}
                                />
                            </RowItem>
                            <RowItem isValid={playerOfTheDay.lastOrganization.name === player.lastOrganization.name}>
                                <Image
                                    src={player.lastOrganization.logo}
                                    alt={player.lastOrganization.name}
                                    width={80}
                                    height={80}
                                />
                            </RowItem>
                            <RowNumber
                                isLess={player.birthDate < playerOfTheDay.birthDate}
                                isMore={player.birthDate > playerOfTheDay.birthDate}
                                isValid={playerOfTheDay.birthDate === player.birthDate}
                            >
                                {getAge(player.birthDate)}
                            </RowNumber>
                        </HStack>
                    </MotionDiv>
                )
            })}
        </VStack>
    )
}

export default TablePlayers
