import ApiErrorKey from '@/constants/apiErrorKeys'
import { getSession } from '@/lib/auth/session'
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE, uploadImage } from '@/lib/storage/cloudinary'
import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Upload d'une image sur Cloudinary. Attend un corps `multipart/form-data`
 * contenant le champ `file`, et renvoie `{ url, publicId }`.
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: ApiErrorKey.UNAUTHORIZED }, { status: 401 })
        }

        let formData: FormData
        try {
            formData = await req.formData()
        } catch {
            return NextResponse.json({ error: ApiErrorKey.BAD_REQUEST }, { status: 400 })
        }

        const file = formData.get('file')
        if (!(file instanceof File) || file.size === 0) {
            return NextResponse.json({ error: ApiErrorKey.MISSING_PARAMETER }, { status: 400 })
        }

        if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
            return NextResponse.json({ error: ApiErrorKey.INVALID_FILE_TYPE }, { status: 400 })
        }

        if (file.size > MAX_IMAGE_SIZE) {
            return NextResponse.json({ error: ApiErrorKey.FILE_TOO_LARGE }, { status: 413 })
        }

        const uploaded = await uploadImage(file)

        return NextResponse.json(uploaded, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.UPLOAD_FAILED }, { status: 500 })
    }
}
