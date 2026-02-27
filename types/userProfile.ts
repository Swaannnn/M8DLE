export type UserProfile = {
    id: string
    discordId: string
    username: string
    email: string | null
    avatar: string | null
    role: string
    createdAt: Date
    updatedAt: Date
}
