import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const TZ = 'Europe/Paris'

/**
 * Calcul et renvoi l'age d'une personne en y passant une date.
 */
export function getAge(date: string): number {
    const birthDate = new Date(date)
    if (isNaN(birthDate.getTime())) return -1

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()

    if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
        age--
    }

    return age
}

/**
 * Renvoi l'année d'une date.
 */
export function getYear(date: string): number {
    const birthDate = new Date(date)
    if (isNaN(birthDate.getTime())) return -1

    return birthDate.getFullYear()
}

/**
 * Renvoi la date de début du tirage actuel
 */
export function getGameDate(): Date {
    const now = dayjs().tz(TZ).hour(2).minute(0).second(0).millisecond(0)

    return now.toDate()
}

/**
 * Récupère la date du prochain tirage
 */
export function getNextGameDate(): Date {
    const current = dayjs().tz(TZ)
    const date = current.add(1, 'day').hour(2).minute(0).second(0).millisecond(0)

    return date.toDate()
}

/**
 * Récupère le temps restant entre une timestamp quelconque
 * et la date actuelle
 *
 * @param dateTime
 * @returns
 */
export function getTimeLeft(dateTime: number): number {
    return Math.max(0, dateTime - Date.now())
}

export function getDaysOfMonth(date: Date): number {
    return dayjs(date).daysInMonth()
}

export function getFirstDayOfMonth(date: Date): Date {
    const dateCopy = date
    dateCopy.setDate(1)
    return dateCopy
}
