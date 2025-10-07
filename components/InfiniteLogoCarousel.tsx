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
  // Duplicar logos para efecto infinito
  const duplicatedLogos = [...logos, ...logos, ...logos]

  return (
    <div className="relative overflow-hidden py-12">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
      
      <motion.div
        className="flex gap-16"
        animate={{
          x: [0, -1920],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-8 py-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl min-w-[140px] hover:border-neutral-700 transition-colors"
          >
            <span className="text-neutral-400 font-semibold text-sm whitespace-nowrap">
              {logo.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
