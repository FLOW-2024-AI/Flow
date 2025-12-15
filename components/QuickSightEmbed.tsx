'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface QuickSightEmbedProps {
  dashboardUrl: string
  title?: string
  onLoad?: () => void
}

export default function QuickSightEmbed({
  dashboardUrl,
  title = 'QuickSight Dashboard',
  onLoad
}: QuickSightEmbedProps) {
  const [loading, setLoading] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg relative"
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/90 dark:bg-[#252525]/90 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Cargando dashboard...
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
              Esto puede tomar unos segundos
            </p>
          </div>
        </div>
      )}

      {/* QuickSight iFrame */}
        <iframe
          src={dashboardUrl}
          className="w-full transition-opacity duration-300"
          style={{
            height: 'calc(100vh - 300px)',
            minHeight: '800px',
            border: 'none',
            opacity: loading ? 0 : 1
          }}
          onLoad={() => {
            setLoading(false)
            onLoad?.()
          }}
          allowFullScreen
          title={title}
        />
    </motion.div>
  )
}
