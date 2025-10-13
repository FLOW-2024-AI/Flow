'use client'

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#191919]">
      {children}
    </div>
  )
}
