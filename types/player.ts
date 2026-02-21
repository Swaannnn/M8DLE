export interface Player {
    name: string
    game: {
        name: string
        logo: string
    }
    nationality: string
    joinDate: string
    previousOrganization: {
        name: string
        logo: string | null
    }
    lastOrganization: {
        name: string
        logo: string | null
    }
    birthDate: string
    image: string
}
