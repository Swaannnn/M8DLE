import type { ImageLoader } from 'next/image'

/** URL de livraison Cloudinary : https://res.cloudinary.com/<cloud>/image/upload/<version>/<id> */
const CLOUDINARY_UPLOAD_URL = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/

/**
 * Laisse Cloudinary redimensionner et convertir l'image (format et qualité automatiques, sans
 * agrandissement), servie par son CDN. Évite à Vercel de télécharger l'original pour le transformer.
 */
export const cloudinaryLoader: ImageLoader = ({ src, width, quality }) =>
    src.replace(CLOUDINARY_UPLOAD_URL, `$1f_auto,q_${quality ?? 'auto'},w_${width},c_limit/$2`)

/** Loader adapté à la source, ou `undefined` pour garder l'optimiseur de Next (images locales, Discord...). */
export const getImageLoader = (src: string): ImageLoader | undefined =>
    CLOUDINARY_UPLOAD_URL.test(src) ? cloudinaryLoader : undefined
