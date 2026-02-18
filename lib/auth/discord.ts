import 'server-only'

const CLIENT_ID = process.env.DISCORD_CLIENT_ID!
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'

export async function exchangeCodeForToken(code: string) {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
    })

    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to exchange code: ${error}`)
    }

    return response.json() as Promise<{
        access_token: string
        token_type: string
        expires_in: number
        refresh_token: string
        scope: string
    }>
}

export async function getDiscordUser(accessToken: string) {
    const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch user from Discord')
    }

    return response.json() as Promise<{
        id: string
        username: string
        discriminator: string
        avatar: string | null
        email?: string
    }>
}

export function getAuthorizationUrl() {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'identify email',
    })

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`
}
