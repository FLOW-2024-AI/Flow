'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
          <div className="text-center px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Global
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ha ocurrido un error crítico.
            </p>
            <button
              onClick={reset}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
