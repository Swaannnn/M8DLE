import 'server-only'
import { createHash } from 'node:crypto'
import type { UploadedImage } from '@/types/storage'

const CLOUDINARY_API_BASE = 'https://api.cloudinary.com/v1_1'

/**
 * Limite Vercel sur le corps d'une requête serverless : 4.5 Mo. On reste en dessous
 * pour renvoyer une erreur explicite plutôt que de laisser la plateforme couper la requête.
 */
export const MAX_IMAGE_SIZE = 4 * 1024 * 1024

export const ALLOWED_IMAGE_MIME_TYPES: readonly string[] = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
]

type CloudinaryConfig = {
    cloudName: string
    apiKey: string
    apiSecret: string
}

function getConfig(): CloudinaryConfig {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error('Configuration Cloudinary incomplète (CLOUDINARY_CLOUD_NAME, _API_KEY, _API_SECRET).')
    }

    return { cloudName, apiKey, apiSecret }
}

/**
 * Signature d'un upload Cloudinary : les paramètres signés triés par clé, concaténés
 * en `cle=valeur` séparés par `&`, suffixés de l'api_secret, le tout en SHA-1.
 * Voir https://cloudinary.com/documentation/signatures
 */
function sign(params: Record<string, string>, apiSecret: string): string {
    const payload = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('&')

    return createHash('sha1')
        .update(payload + apiSecret)
        .digest('hex')
}

/**
 * Envoie une image sur Cloudinary via un upload signé. Contrairement à l'upload non signé
 * fait auparavant depuis le navigateur, l'api_secret ne quitte jamais le serveur et l'appelant
 * doit être authentifié (voir app/api/storage/route.ts).
 *
 * @param file Fichier à envoyer
 * @returns URL publique et public_id de l'image créée
 */
export async function uploadImage(file: File): Promise<UploadedImage> {
    const { cloudName, apiKey, apiSecret } = getConfig()

    const signedParams = {
        timestamp: Math.floor(Date.now() / 1000).toString(),
        use_filename_as_display_name: 'true',
    }

    const formData = new FormData()
    formData.append('file', file)
    for (const [key, value] of Object.entries(signedParams)) {
        formData.append(key, value)
    }
    formData.append('api_key', apiKey)
    formData.append('signature', sign(signedParams, apiSecret))

    const response = await fetch(`${CLOUDINARY_API_BASE}/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
    })

    const data = await response.json()

    if (!response.ok || !data.secure_url) {
        throw new Error(`Upload Cloudinary échoué : ${data?.error?.message ?? response.statusText}`)
    }

    return { url: data.secure_url, publicId: data.public_id }
}
