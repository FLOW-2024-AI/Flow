'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Keyboard, Search, Mail, Clock, X, Bot, Zap, CheckCircle, RefreshCw, Timer, Target } from 'lucide-react'

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100))
    setSliderPosition(percent)
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div
        className="relative h-[500px] rounded-3xl overflow-hidden cursor-col-resize select-none border-2 border-neutral-300 dark:border-neutral-800 shadow-lg"
        onMouseMove={handleMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        {/* Antes - Proceso Manual */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-300 via-red-200 to-red-100 dark:from-red-950/40 dark:to-neutral-950">
          <div className="p-12 h-full flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-8 text-red-700 dark:text-red-400">Proceso Manual</h3>
            <div className="space-y-4">
              {[
                { IconComponent: ClipboardList, text: 'Recopilación manual de facturas' },
                { IconComponent: Keyboard, text: 'Entrada de datos en Excel' },
                { IconComponent: Search, text: 'Revisión manual de errores' },
                { IconComponent: Mail, text: 'Emails de ida y vuelta' },
                { IconComponent: Clock, text: '8+ horas de trabajo repetitivo' },
                { IconComponent: X, text: 'Alto riesgo de errores humanos' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 text-gray-800 dark:text-gray-300 font-medium"
                >
                  <item.IconComponent className="w-6 h-6 text-red-600 dark:text-red-400" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Después - Con Flow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-300 via-green-200 to-emerald-200 dark:from-green-950/95 dark:to-black"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <div className="p-12 h-full flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-8 text-green-700 dark:text-green-400">Con Flow</h3>
            <div className="space-y-4">
              {[
                { IconComponent: Bot, text: 'Captura automática de facturas' },
                { IconComponent: Zap, text: 'Procesamiento instantáneo con IA' },
                { IconComponent: CheckCircle, text: 'Validación automática de datos' },
                { IconComponent: RefreshCw, text: 'Sincronización en tiempo real' },
                { IconComponent: Timer, text: '30 minutos de supervisión' },
                { IconComponent: Target, text: '99.9% de precisión garantizada' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 text-gray-800 dark:text-gray-300 font-medium"
                >
                  <item.IconComponent className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6 text-sm text-neutral-600 dark:text-neutral-400 font-medium">
        <span>← Arrastra para comparar →</span>
        <span>Ahorra hasta 90% del tiempo</span>
      </div>
    </div>
  )
}
