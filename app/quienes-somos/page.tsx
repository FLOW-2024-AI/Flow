'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import Navbar from '@/components/Navbar'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 1,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      {/* Hero Image with Parallax */}
      <div className="relative h-[60vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
          <Image
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&q=80"
            alt="Innovación y Tecnología"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-7xl md:text-8xl font-bold text-gray-900 dark:text-white text-center px-4"
          >
            Quiénes Somos
          </motion.h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-24 py-20"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center">
              <motion.p 
                variants={itemVariants}
                className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-4"
              >
                Nuestra Misión
              </motion.p>
              <motion.h2 
                variants={itemVariants}
                className="text-xl md:text-2xl md:text-3xl font-bold mb-6 leading-tight"
              >
                Pioneros en automatización
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  financiera empresarial
                </span>
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              >
                Transformamos la manera en que las empresas gestionan sus procesos contables y de tesorería mediante tecnología de vanguardia.
              </motion.p>
            </motion.div>

            {/* Introducción con imagen */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                variants={scaleVariants}
                className="relative h-[500px] rounded-3xl overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=1000&fit=crop&q=80"
                  alt="Análisis de datos financieros"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold mb-6">Nuestra Historia</h2>
                <div className="space-y-6">
                  <p className="text-lg text-gray-400 dark:text-gray-300 leading-relaxed">
                    Flow nació con una visión clara: <span className="text-gray-900 dark:text-white font-semibold">revolucionar la gestión financiera empresarial</span> mediante RPA + IA. No reemplazamos tu ERP, lo conectamos y potenciamos con automatización inteligente.
                  </p>
                  <p className="text-lg text-gray-400 dark:text-gray-300 leading-relaxed">
                    Identificamos que las PYMEs pierden <span className="text-blue-400 font-semibold">80% de su tiempo</span> en tareas manuales repetitivas. Nuestra plataforma conecta tu ERP, bancos y SUNAT para automatizar todo.
                  </p>
                  <div className="grid grid-cols-3 gap-6 pt-6">
                    <div>
                      <div className="text-lg font-bold text-blue-400 mb-2">20+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Empresas confiando</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-400 mb-2">450%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">ROI promedio</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-400 mb-2">80%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Automatización activa</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Misión y Visión - Apple Style */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div 
                variants={scaleVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-800/30 rounded-3xl p-10 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/50"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg className="w-8 h-8 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </motion.div>
                  <h2 className="text-lg font-bold mb-4">Nuestra Misión</h2>
                  <p className="text-lg text-gray-400 dark:text-gray-300 leading-relaxed">
                    Democratizar la automatización financiera para empresas de todos los tamaños, proporcionando herramientas inteligentes que eliminen las tareas manuales repetitivas y permitan a los equipos financieros enfocarse en la estrategia y el crecimiento empresarial.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                variants={scaleVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-800/30 rounded-3xl p-10 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700" />
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-purple-500/50"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg className="w-8 h-8 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </motion.div>
                  <h2 className="text-lg font-bold mb-4">Nuestra Visión</h2>
                  <p className="text-lg text-gray-400 dark:text-gray-300 leading-relaxed">
                    Ser la plataforma líder en automatización financiera en América Latina para 2027, transformando más de 10,000 empresas y estableciendo el nuevo estándar de eficiencia en la gestión financiera empresarial.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Valores - Con imagen de fondo */}
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&h=900&fit=crop&q=80"
                  alt="Equipo colaborativo"
                  fill
                  className="object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black" />
              </div>
              
              <motion.div variants={itemVariants} className="relative z-10 p-12">
                <h2 className="text-xl font-bold mb-12 text-center">Nuestros Valores</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div 
                    className="text-center group"
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <svg className="w-10 h-10 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </motion.div>
                    <h3 className="text-base font-bold mb-4 group-hover:text-green-400 transition-colors">Excelencia</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Nos comprometemos a entregar soluciones de la más alta calidad, superando las expectativas de nuestros clientes.
                    </p>
                  </motion.div>

                  <motion.div 
                    className="text-center group"
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/50"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <svg className="w-10 h-10 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </motion.div>
                    <h3 className="text-base font-bold mb-4 group-hover:text-orange-400 transition-colors">Innovación</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Adoptamos las últimas tecnologías para crear soluciones disruptivas que transformen la industria financiera.
                    </p>
                  </motion.div>

                  <motion.div 
                    className="text-center group"
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/50"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <svg className="w-10 h-10 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </motion.div>
                    <h3 className="text-base font-bold mb-4 group-hover:text-blue-400 transition-colors">Colaboración</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Trabajamos de la mano con nuestros clientes como socios estratégicos en su transformación digital.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Equipo - Apple Style */}
            <motion.div variants={itemVariants} className="relative">
              <div className="text-center mb-16">
                <motion.p 
                  variants={itemVariants}
                  className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-4"
                >
                  Liderazgo
                </motion.p>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Nuestro Equipo</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Expertos apasionados por transformar el futuro de las finanzas empresariales
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <motion.div 
                  className="group relative"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-950 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
                    <div className="relative z-10 text-center">
                      <motion.div 
                        className="w-32 h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/50"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-lg font-bold text-gray-900 dark:text-white">HC</span>
                      </motion.div>
                      <h3 className="text-base font-bold mb-2 group-hover:text-blue-400 transition-colors">Hugo Chávez</h3>
                      <p className="text-blue-400 font-semibold mb-4 text-sm tracking-wide">CEO & FUNDADOR</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Visionario fintech con <span className="text-gray-900 dark:text-white font-semibold">10+ años</span> liderando transformación financiera en corporaciones multinacionales. Arquitecto de ecosistemas de automatización que han procesado <span className="text-blue-400 font-semibold">+$500M</span> en transacciones.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="group relative"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-950 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all duration-700" />
                    <div className="relative z-10 text-center">
                      <motion.div 
                        className="w-32 h-32 bg-gradient-to-br from-green-500 via-emerald-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-lg font-bold text-gray-900 dark:text-white">MO</span>
                      </motion.div>
                      <h3 className="text-base font-bold mb-2 group-hover:text-green-400 transition-colors">Marcelo Olivera</h3>
                      <p className="text-green-400 font-semibold mb-4 text-sm tracking-wide">CCO & FUNDADOR</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Growth hacker con ADN comercial. Experto en <span className="text-gray-900 dark:text-white font-semibold">escalar operaciones B2B</span> y construir pipelines de alto impacto. Maestro en convertir insights de mercado en estrategias de <span className="text-green-400 font-semibold">revenue exponencial</span>.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="group relative"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-950 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700" />
                    <div className="relative z-10 text-center">
                      <motion.div 
                        className="w-32 h-32 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/50"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-lg font-bold text-gray-900 dark:text-white">NV</span>
                      </motion.div>
                      <h3 className="text-base font-bold mb-2 group-hover:text-purple-400 transition-colors">Nathan Villegas</h3>
                      <p className="text-purple-400 font-semibold mb-4 text-sm tracking-wide">CFO & FUNDADOR</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Ex-ingeniero de <span className="text-gray-900 dark:text-white font-semibold">Yape</span>, pionero en infraestructura fintech de alto volumen. Especialista en arquitectura financiera escalable y optimización de capital para <span className="text-purple-400 font-semibold">hypergrowth startups</span>.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* CTA - Apple Style */}
            <motion.div 
              variants={scaleVariants}
              className="relative overflow-hidden rounded-[3rem] mt-20"
            >
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&h=900&fit=crop&q=80"
                  alt="Transformación digital"
                  fill
                  className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-black/90" />
              </div>
              
              <div className="relative z-10 text-center p-16">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-2xl md:text-3xl md:text-2xl md:text-3xl font-bold mb-6 leading-tight"
                >
                  ¿Listo para transformar
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    tus finanzas?
                  </span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-sm text-gray-400 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
                >
                  Únete a las empresas que ya están revolucionando sus procesos financieros con Flow.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-6 justify-center"
                >
                  <Link href="/consulta">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white dark:bg-secondary-800 text-gray-900 dark:text-gray-100 px-10 py-5 rounded-2xl font-bold text-lg hover:opacity-90 transition-all duration-200 shadow-2xl inline-block cursor-pointer"
                    >
                      Agendar consulta gratis
                    </motion.div>
                  </Link>
                  <Link href="/login">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-200 shadow-2xl inline-block cursor-pointer border-2 border-blue-500"
                    >
                      Demo gratis aquí
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
