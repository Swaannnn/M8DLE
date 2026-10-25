'use client'

import { Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { getNextGameDate, getTimeLeft } from '@/utils/dateUtils'

const pad = (value: number) => value.toString().padStart(2, '0')

/**
 * Compte à rebours jusqu'au prochain tirage. Isolé dans son propre composant : son état
 * change chaque seconde et ne doit faire re-rendre que lui, pas toute la page.
 */
const Countdown = () => {
    const t = useTranslations('home')
    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(getNextGameDate().getTime()))

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(getNextGameDate().getTime()))
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const totalSeconds = Math.max(0, Math.floor(timeLeft / 1000))
    const hours = pad(Math.floor(totalSeconds / 3600))
    const minutes = pad(Math.floor((totalSeconds % 3600) / 60))
    const seconds = pad(totalSeconds % 60)

    return (
        <Text>
            {t('nextDraw')}
            {` ${hours}:${minutes}:${seconds}`}
        </Text>
    )
}

export default Countdown
