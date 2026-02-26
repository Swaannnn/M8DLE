const getParisParts = (date: Date) => {
    const formatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })

    const parts = formatter.formatToParts(date)
    const values: Record<string, string> = {}
    parts.forEach((part) => {
        if (part.type !== 'literal') values[part.type] = part.value
    })

    return {
        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day),
        hour: Number(values.hour),
        minute: Number(values.minute),
    }
}

const getGameDayKey = (baseDate: Date = new Date()) => {
    const currentParts = getParisParts(baseDate)
    if (currentParts.hour < 2) {
        const previousDate = new Date(baseDate.getTime() - 24 * 60 * 60 * 1000)
        const previousParts = getParisParts(previousDate)
        return `${previousParts.year}-${String(previousParts.month).padStart(2, '0')}-${String(
            previousParts.day
        ).padStart(2, '0')}`
    }

    return `${currentParts.year}-${String(currentParts.month).padStart(2, '0')}-${String(currentParts.day).padStart(
        2,
        '0'
    )}`
}

const getAge = (date: string): number => {
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

const getYear = (date: string): number => {
    const birthDate = new Date(date)
    if (isNaN(birthDate.getTime())) return -1
    return birthDate.getFullYear()
}

const getGameDate = () => {
    const [year, month, day] = getGameDayKey().split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, day))
}

export { getAge, getYear, getGameDate, getGameDayKey }
