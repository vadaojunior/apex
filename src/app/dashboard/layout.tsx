import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex bg-[#0a0a0a] min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/10 via-[#0a0a0a] to-[#0a0a0a]">
                {children}
            </main>
        </div>
    )
}
