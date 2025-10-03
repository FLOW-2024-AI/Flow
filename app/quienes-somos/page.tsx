'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-neutral-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo/finka-logo.jpg" 
                alt="Finka Finance" 
                width={250} 
                height={60}
                className="h-15 w-auto object-contain"
                style={{ height: '60px' }}
              />
            </Link>
            
            <Link 
              href="/" 
              className="text-neutral-300 hover:text-white transition-colors focus-ring rounded-md px-3 py-2"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center">
              <h1 className="text-5xl font-bold mb-6">Quiénes Somos</h1>
              <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
                Somos pioneros en la automatización financiera empresarial, transformando la manera en que las empresas gestionan sus procesos contables y de tesorería.
              </p>
            </motion.div>

            {/* Introducción */}
            <motion.div variants={itemVariants} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6">Nuestra Historia</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-neutral-300 mb-4">
                  Finka Finance nació en 2023 con una visión clara: revolucionar la gestión financiera empresarial mediante la automatización inteligente. Fundada por un equipo de expertos en fintech, contabilidad y tecnología, nuestra empresa surge de la necesidad de resolver los desafíos más complejos que enfrentan los departamentos financieros modernos.
                </p>
                <p className="text-lg text-neutral-300 mb-4">
                  Hemos identificado que las empresas pierden cientos de horas mensuales en tareas manuales repetitivas como conciliaciones bancarias, procesamiento de facturas y generación de reportes. Nuestra plataforma utiliza inteligencia artificial y automatización robótica de procesos (RPA) para eliminar estas ineficiencias.
                </p>
                <p className="text-lg text-neutral-300">
                  Desde nuestros inicios, hemos ayudado a más de 150 empresas a reducir sus tiempos de cierre contable de días a horas, mejorando la precisión y liberando talento humano para tareas estratégicas de mayor valor.
                </p>
              </div>
            </motion.div>

            {/* Misión y Visión */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/30 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold">Nuestra Misión</h2>
                </div>
                <p className="text-lg text-neutral-300">
                  Democratizar la automatización financiera para empresas de todos los tamaños, proporcionando herramientas inteligentes que eliminen las tareas manuales repetitivas y permitan a los equipos financieros enfocarse en la estrategia y el crecimiento empresarial.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-800/30 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold">Nuestra Visión</h2>
                </div>
                <p className="text-lg text-neutral-300">
                  Ser la plataforma líder en automatización financiera en América Latina para 2027, transformando más de 10,000 empresas y estableciendo el nuevo estándar de eficiencia en la gestión financiera empresarial.
                </p>
              </motion.div>
            </div>

            {/* Valores */}
            <motion.div variants={itemVariants} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-8 text-center">Nuestros Valores</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Excelencia</h3>
                  <p className="text-neutral-400">
                    Nos comprometemos a entregar soluciones de la más alta calidad, superando las expectativas de nuestros clientes.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Innovación</h3>
                  <p className="text-neutral-400">
                    Adoptamos las últimas tecnologías para crear soluciones disruptivas que transformen la industria financiera.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Colaboración</h3>
                  <p className="text-neutral-400">
                    Trabajamos de la mano con nuestros clientes como socios estratégicos en su transformación digital.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Equipo */}
            <motion.div variants={itemVariants} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-8 text-center">Nuestro Equipo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">CF</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Carlos Fernández</h3>
                  <p className="text-blue-400 mb-2">CEO & Fundador</p>
                  <p className="text-sm text-neutral-400">
                    15+ años en fintech y automatización empresarial. Ex-director de innovación en multinacional financiera.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">AM</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Ana Martínez</h3>
                  <p className="text-green-400 mb-2">CTO</p>
                  <p className="text-sm text-neutral-400">
                    Especialista en IA y RPA con 12+ años desarrollando soluciones de automatización para el sector financiero.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">LR</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Luis Rodríguez</h3>
                  <p className="text-purple-400 mb-2">CFO</p>
                  <p className="text-sm text-neutral-400">
                    CPA con 18+ años en consultoría financiera y transformación digital de procesos contables.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants} className="text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-4">¿Listo para transformar tus finanzas?</h2>
              <p className="text-xl text-neutral-400 mb-8">
                Únete a las empresas que ya están revolucionando sus procesos financieros con Finka Finance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/consulta" className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity focus-ring inline-block">
                  Agendar consulta gratis
                </Link>
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors focus-ring inline-block">
                  Demo gratis aquí
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
