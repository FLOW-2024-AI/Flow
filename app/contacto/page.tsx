'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function ContactoPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contáctanos</h1>
            <p className="text-xl text-neutral-300">
              Estamos aquí para ayudarte
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Email</h3>
                    <p className="text-neutral-300">hola@flow.finance</p>
                    <p className="text-neutral-400 text-sm mt-1">Respuesta en 24 horas</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
                    <p className="text-neutral-300">+51 999 999 999</p>
                    <p className="text-neutral-400 text-sm mt-1">Lun - Vie: 9am - 6pm</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Oficina</h3>
                    <p className="text-neutral-300">Lima, Perú</p>
                    <p className="text-neutral-400 text-sm mt-1">Visitas con cita previa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">¿Necesitas ayuda rápida?</h3>
                <div className="space-y-4">
                  <Link
                    href="/consulta"
                    className="block p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-blue-500/50 transition-colors"
                  >
                    <h4 className="font-semibold mb-1">Agendar Demo</h4>
                    <p className="text-sm text-neutral-400">Consulta gratuita de 30 minutos</p>
                  </Link>
                  <Link
                    href="/faq"
                    className="block p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-blue-500/50 transition-colors"
                  >
                    <h4 className="font-semibold mb-1">Preguntas Frecuentes</h4>
                    <p className="text-sm text-neutral-400">Respuestas a dudas comunes</p>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-blue-500/50 transition-colors"
                  >
                    <h4 className="font-semibold mb-1">Soporte Técnico</h4>
                    <p className="text-sm text-neutral-400">Para clientes actuales</p>
                  </Link>
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4">Síguenos</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <span className="text-sm">𝕏</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <span className="text-sm">in</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <span className="text-sm">f</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
