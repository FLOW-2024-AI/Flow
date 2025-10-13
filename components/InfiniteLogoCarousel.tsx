'use client'

import { motion } from 'framer-motion'

const logos = [
  { name: 'IBJ Soluciones', width: 120 },
  { name: 'Miranda Partners', width: 140 },
  { name: 'Latam Autos', width: 130 },
  { name: 'Premium Brands', width: 150 },
  { name: 'Landing', width: 110 },
  { name: 'Trim', width: 100 },
  { name: 'Yive', width: 90 },
]

export default function InfiniteLogoCarousel() {
  // Duplicar logos para efecto infinito suave
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos]

  return (
    <div className="relative overflow-hidden py-8">
      {/* Máscaras de desvanecimiento sutiles y adaptativas */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-[#191919] via-white/80 dark:via-[#191919]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-[#191919] via-white/80 dark:via-[#191919]/80 to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-8 items-center"
        animate={{
          x: [0, -1600],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          },
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-br from-white to-neutral-50 dark:from-[#252525] dark:to-[#252525] border-2 border-neutral-200 dark:border-neutral-800 rounded-xl min-w-[160px] shadow-sm hover:shadow-md hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all duration-200 cursor-pointer"
          >
            <span className="text-neutral-700 dark:text-neutral-300 font-semibold text-sm whitespace-nowrap">
              {logo.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
