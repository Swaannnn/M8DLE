export enum UploadFolder {
    PLAYERS = 'players',
    TEAMS = 'teams',
    GAMES = 'games',
}

/** Réponse de POST /api/storage. */
export type UploadedImage = {
    url: string
    publicId: string
}
