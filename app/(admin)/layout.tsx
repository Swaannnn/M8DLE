import { getSession } from '@/lib/auth/session'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession()

    if (!session || session.role !== Role.ADMIN) {
        redirect('/')
    }

    return <>{children}</>
}
