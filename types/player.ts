export interface Player {
    name: string
    game: string
    nationality: string
    joinDate: string
    previousOrganization: {
        name: string
        logo: string
    }
    lastOrganization: {
        name: string
        logo: string
    }
    birthDate: string
    image: string
}
