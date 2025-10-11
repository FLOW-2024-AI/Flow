'use client'

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      {children}
    </div>
  )
}
