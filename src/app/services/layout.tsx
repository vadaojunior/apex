import Sidebar from '@/components/Sidebar'

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex bg-[#0a0a0a] min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}
