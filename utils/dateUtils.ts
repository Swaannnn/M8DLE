import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const TZ = 'Europe/Paris'

/** Heure (dans `TZ`) à laquelle le tirage du jour bascule. */
const GAME_CUTOFF_HOUR = 2

/** Bascule du tirage pour le jour de `now`. */
const getCutoff = (now: dayjs.Dayjs) => now.hour(GAME_CUTOFF_HOUR).minute(0).second(0).millisecond(0)

/**
 * Calcul et renvoi l'age d'une personne en y passant une date.
 *
 * La date de naissance est lue en UTC (c'est ainsi qu'elle est stockée) et « aujourd'hui »
 * dans le fuseau de jeu. Sans cela le résultat dépendrait du fuseau de la machine : le
 * serveur, qui compare les âges, pourrait ne pas tomber d'accord avec le navigateur, qui
 * les affiche.
 */
export function getAge(date: string): number {
    const birthDate = dayjs.utc(date)
    if (!birthDate.isValid()) return -1

    const today = dayjs().tz(TZ)
    let age = today.year() - birthDate.year()

    if (today.month() < birthDate.month() || (today.month() === birthDate.month() && today.date() < birthDate.date())) {
        age--
    }

    return age
}

/**
 * Renvoi l'année d'une date, lue en UTC pour la même raison que `getAge`.
 */
export function getYear(date: string): number {
    const parsed = dayjs.utc(date)

    return parsed.isValid() ? parsed.year() : -1
}

/**
 * Renvoi la date de début du tirage actuel
 */
export function getGameDate(): Date {
    const now = dayjs().tz(TZ)
    const cutoff = getCutoff(now)

    return (now.isBefore(cutoff) ? cutoff.subtract(1, 'day') : cutoff).toDate()
}

/**
 * Récupère la date du prochain tirage.
 *
 * Entre minuit et la bascule, le prochain tirage est celui du jour même : ajouter un jour
 * sans distinction ferait afficher un compte à rebours d'environ 25 h au lieu de moins de 2 h.
 */
export function getNextGameDate(): Date {
    const now = dayjs().tz(TZ)
    const cutoff = getCutoff(now)

    return (now.isBefore(cutoff) ? cutoff : cutoff.add(1, 'day')).toDate()
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

/**
 * Renvoi un index comparable année+mois (ex: 2026-01 < 2026-02 < 2027-01),
 * pour comparer deux dates par mois sans tenir compte du jour.
 */
export function getMonthIndex(date: Date): number {
    return date.getFullYear() * 12 + date.getMonth()
}

/** Renvoie une nouvelle date au 1er du mois : l'argument n'est jamais modifié. */
export function getFirstDayOfMonth(date: Date): Date {
    const firstDay = new Date(date)
    firstDay.setDate(1)
    return firstDay
}

/**
 * Formate une date (chaîne ISO ou objet Date) dans un format adapté pour <input type="date" /> (YYYY-MM-DD)
 * @param date - La date à formater
 * @returns La chaîne de date formatée, ou une chaîne vide si invalide/nulle
 */
export function formatDateForInput(date: string | Date | null | undefined): string {
    if (!date) return ''
    try {
        if (typeof date === 'string') {
            return date.split('T')[0]
        }
        return date.toISOString().split('T')[0]
    } catch {
        return ''
    }
}
