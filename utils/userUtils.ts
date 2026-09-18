import constantsApi from '@/constants/constantsApi'
import defaultAvatar from '@/public/images/default_avatar.jpg'

export function getProfileAvatar({ discordId, avatar }: { discordId: string; avatar: string | null }): string {
    if (!avatar) return defaultAvatar.src

    return `${constantsApi.AVATAR}/${discordId}/${avatar}`
}
