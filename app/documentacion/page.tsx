'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function DocumentacionPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentación</h1>
            <p className="text-xl text-neutral-300">
              Guías completas para aprovechar al máximo Flow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-3">Guía de Inicio</h3>
              <p className="text-neutral-400 mb-4">
                Aprende los conceptos básicos y configura tu cuenta en minutos.
              </p>
              <Link href="/consulta" className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                Comenzar →
              </Link>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 hover:border-green-500/50 transition-all">
              <div className="text-4xl mb-4">🔌</div>
              <h3 className="text-xl font-bold mb-3">Integraciones</h3>
              <p className="text-neutral-400 mb-4">
                Conecta Flow con tu ERP, bancos y SUNAT paso a paso.
              </p>
              <Link href="/integraciones" className="text-green-400 hover:text-green-300 text-sm font-semibold">
                Ver guías →
              </Link>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3">Automatizaciones</h3>
              <p className="text-neutral-400 mb-4">
                Configura RPA y automatiza tus procesos financieros.
              </p>
              <Link href="/consulta" className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
                Explorar →
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-2xl p-12 text-center">
            <h3 className="text-2xl font-bold mb-4">¿Necesitas ayuda personalizada?</h3>
            <p className="text-neutral-300 mb-6">
              Nuestro equipo está disponible para ayudarte con la implementación
            </p>
            <Link
              href="/consulta"
              className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Contactar soporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
