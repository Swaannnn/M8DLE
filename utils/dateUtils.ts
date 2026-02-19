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
    const now = new Date()
    now.setHours(now.getHours() - 2) // décalage 2h
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export { getAge, getYear, getGameDate }
