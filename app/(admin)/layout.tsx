import { getCurrentAdmin } from '@/lib/auth/currentUser'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    if (!(await getCurrentAdmin())) {
        redirect('/')
    }

    return <>{children}</>
}
