export type LeaderboardUser = {
    id: string
    username: string
    discordId: string
    avatar: string
    wins: number
    averageAttempts: number
}

export type LeaderboardData = {
    total: number
    users: LeaderboardUser[]
}
