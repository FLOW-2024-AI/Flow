'use client'

import { motion } from 'framer-motion'
import CTAForm from '@/components/CTAForm'
import Link from 'next/link'
import Image from 'next/image'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      duration: 0.6
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

export default function Home() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-neutral-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <Image 
                src="/images/logo/finka-logo.jpg" 
                alt="Finka Finance" 
                width={250} 
                height={60}
                className="h-15 w-auto object-contain"
                style={{ height: '60px' }}
              />
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/quienes-somos" className="text-neutral-300 hover:text-white transition-colors focus-ring rounded-md px-2 py-1">
                Quiénes somos
              </Link>
              
              {/* Dropdown Sobre nosotros */}
              <div className="relative group">
                <button className="text-neutral-300 hover:text-white transition-colors focus-ring rounded-md px-2 py-1 flex items-center space-x-1">
                  <span>Sobre nosotros</span>
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <a href="#soluciones" className="block px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                      Soluciones
                    </a>
                    <a href="#como-funciona" className="block px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                      Cómo funciona
                    </a>
                    <a href="#testimonios" className="block px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                      Casos de éxito
                    </a>
                    <a href="#preguntas" className="block px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                      FAQ
                    </a>
                  </div>
                </div>
              </div>
              
              <Link href="/precios" className="text-neutral-300 hover:text-white transition-colors focus-ring rounded-md px-2 py-1">
                Precios
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-neutral-300 hover:text-white transition-colors focus-ring rounded-md px-2 py-1">
                Iniciar sesión
              </Link>
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors focus-ring inline-block">
                Demo gratis aquí
              </Link>
              <Link href="/consulta" className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity focus-ring inline-block">
                Agendar consulta
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold leading-tight">
              Automatiza finanzas con IA
              <br />
              <span className="text-neutral-300">Ahorra horas cada día</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
              Herramientas inteligentes que automatizan lo repetitivo en Finanzas, Tesorería y Contabilidad. 
              Conectamos tus sistemas y eliminamos el trabajo manual.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/consulta" className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity focus-ring inline-block">
                Agendar consulta gratis
              </Link>
              <a href="#testimonios" className="border border-neutral-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-neutral-600 transition-colors focus-ring inline-block">
                Ver casos de éxito
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">15h+</div>
                <div className="text-neutral-400">Ahorro semanal</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">2x</div>
                <div className="text-neutral-400">Cierre más rápido</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">90%</div>
                <div className="text-neutral-400">Menos errores</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Los procesos anticuados te frenan</h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Automatizamos el caos financiero para que tu equipo no tenga que hacerlo.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Problema */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-red-400 mb-2">Problema</h3>
                <p className="text-neutral-400">Proceso manual y propenso a errores</p>
              </div>
              
              <div className="space-y-4">
                {[
                  'Captura y procesamiento manual de datos',
                  'Datos dispersos en distintas apps',
                  'Reportes creados manualmente en hojas de cálculo',
                  'ERP inutilizable: no te muestra lo que quieres ver'
                ].map((problem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-4 bg-red-950/20 border border-red-800/30 rounded-xl"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                    <span className="text-neutral-300">{problem}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Solución */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-green-400 mb-2">Solución</h3>
                <p className="text-neutral-400">Rápido, automatizado y fácil de usar</p>
              </div>
              
              <div className="space-y-4">
                {[
                  'Agentes de IA procesan datos en segundo plano',
                  'Sistemas totalmente conectados y sincronizados',
                  'Reportes generados automáticamente mediante flujos',
                  'Dashboards unificados con visibilidad en tiempo real'
                ].map((solution, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-4 bg-green-950/20 border border-green-800/30 rounded-xl"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span className="text-neutral-300">{solution}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Target Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Hecho para los equipos que sostienen el negocio</h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Herramientas inteligentes para Finanzas, Operaciones, Administración y RRHH que buscan escalar sin fricción.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 transition-transform duration-200"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-blue-400 rounded-sm"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Departamentos financieros</h3>
              <p className="text-neutral-300 leading-relaxed">
                Automatiza cuentas por cobrar y por pagar, ingresos y compras - y enfócate en la estrategia.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 transition-transform duration-200"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-green-400 rounded-sm"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Equipos de RRHH</h3>
              <p className="text-neutral-300 leading-relaxed">
                Agiliza las tareas tediosas involucradas en altas, reclutamiento y nómina.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 transition-transform duration-200"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-purple-400 rounded-sm"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Operaciones</h3>
              <p className="text-neutral-300 leading-relaxed">
                Elimina el trabajo manual, sincroniza tus sistemas y evita que se pierda información.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="soluciones" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Herramientas de IA que hacen el trabajo que tu equipo odia</h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Soluciones personalizadas que automatizan lo repetitivo en Finanzas, RRHH, Operaciones y Administración.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-black border border-neutral-800 rounded-2xl p-8 transition-transform duration-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-white rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Agentes de IA para tareas</h3>
              <p className="text-neutral-300 leading-relaxed mb-4">
                Gestionan datos, aprobaciones y actualizaciones - para que tu equipo no lo haga.
              </p>
              <div className="text-sm text-neutral-400">
                Automatización inteligente de procesos
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-black border border-neutral-800 rounded-2xl p-8 transition-transform duration-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-white rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Herramientas internas</h3>
              <p className="text-neutral-300 leading-relaxed mb-4">
                Dashboards, portales y flujos adaptados a cómo ya trabaja tu equipo cada día.
              </p>
              <div className="text-sm text-neutral-400">
                Interfaces personalizadas y amigables
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-black border border-neutral-800 rounded-2xl p-8 transition-transform duration-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-white rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Automatización de flujos</h3>
              <p className="text-neutral-300 leading-relaxed mb-4">
                Flujos que conectan tus herramientas y gestionan el trabajo entre ellas - sin perder nada.
              </p>
              <div className="text-sm text-neutral-400">
                Integración perfecta entre sistemas
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Creamos las herramientas ideales para tu equipo</h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Diseñadas para reducir el trabajo repetitivo, acelerar tus flujos de trabajo y realmente ser adoptados por tu equipo.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-green-400 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Listas en semanas, no meses</h3>
              <p className="text-neutral-300 text-sm">
                La mayoría están listas en menos de 3 semanas. Sin esperas. Sin desarrollos eternos.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-blue-400 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sin cambiar tus sistemas</h3>
              <p className="text-neutral-300 text-sm">
                Se conectan con lo que ya usas: ERP, hojas de cálculo y bases de datos.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-purple-400 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sin equipo de desarrollo</h3>
              <p className="text-neutral-300 text-sm">
                Nosotros lo diseñamos, lo montamos y damos soporte. No necesitas ingenieros.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-orange-400 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">ROI rápido, resultados reales</h3>
              <p className="text-neutral-300 text-sm">
                Desde el primer día se ahorra tiempo y esfuerzo - sin promesas vacías.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Lo dicen nuestros clientes</h2>
            <p className="text-xl text-neutral-300">
              Empresas que ya automatizan sus finanzas con Finka
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Patricio Isassi",
                role: "CEO @ IBJ Soluciones",
                quote: "En IBJ integramos Finka como nuestro ERP financiero y los resultados han sido excelentes. Nos da transparencia operativa y control estratégico en todas las áreas financieras.",
                metrics: [{ value: "5h+", label: "Ahorro semanal" }, { value: "3+", label: "Procesos automatizados" }]
              },
              {
                name: "Damián Fraser",
                role: "CEO @ Miranda Partners",
                quote: "Desde que usamos Finka, mejoró mucho la productividad de nuestros equipos contables y administrativos. Sus herramientas nos ayudaron a optimizar flujos de forma increíble.",
                metrics: [{ value: "10h+", label: "Ahorro semanal" }, { value: "2x", label: "Cierre más rápido" }]
              },
              {
                name: "Jairo Ante",
                role: "Director Financiero @ Latam Autos",
                quote: "Antes de Finka, tener datos bancarios consolidados en tiempo real parecía imposible. Con su herramienta automatizada optimizamos procesos y redujimos errores.",
                metrics: [{ value: "50%", label: "Menos errores" }, { value: "60%", label: "Tareas automatizadas" }]
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-black border border-neutral-800 rounded-2xl p-8 transition-transform duration-200"
              >
                <div className="flex gap-4 mb-6">
                  {testimonial.metrics.map((metric, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-bold text-white">{metric.value}</div>
                      <div className="text-xs text-neutral-400">{metric.label}</div>
                    </div>
                  ))}
                </div>
                
                <p className="text-neutral-300 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-neutral-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Empezar es fácil</h2>
            <p className="text-xl text-neutral-300">
              De la idea a la automatización activa - en solo 3 pasos.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Descubrimiento</h3>
                <p className="text-neutral-300 text-lg">
                  Llamada rápida para mapear tus procesos y elegir qué automatizar.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Desarrollo</h3>
                <p className="text-neutral-300 text-lg">
                  Construimos rápido. Tú revisas y ajustamos si hace falta.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Lanzamiento y mejora</h3>
                <p className="text-neutral-300 text-lg">
                  Se pone en marcha. Damos soporte y seguimos mejorando contigo.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="preguntas" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Todo lo que necesitas saber</h2>
            <p className="text-xl text-neutral-300">
              ¿Dudas? Tenemos respuestas. Aquí tienes todo lo que debes saber antes de empezar.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "¿Con qué herramientas se integra?",
                answer: "Finka se conecta con ERPs (SAP, Oracle, Dynamics), bancos (APIs bancarias), hojas de cálculo (Excel, Google Sheets), bases de datos (MySQL, PostgreSQL), y herramientas como Airtable, n8n, y Zapier."
              },
              {
                question: "¿Necesito un equipo de desarrollo?",
                answer: "No. Nosotros nos encargamos de todo el desarrollo, implementación y soporte. Tú solo necesitas definir qué procesos quieres automatizar y nosotros lo construimos."
              },
              {
                question: "¿Qué tipo de tareas puede automatizar Finka?",
                answer: "Automatizamos conciliaciones bancarias, procesamiento de facturas, reportes financieros, flujos de aprobación, actualización de datos entre sistemas, alertas de tesorería y muchísimo más."
              },
              {
                question: "¿Y si no veo mi caso específico?",
                answer: "Cada implementación es personalizada. Si tienes un proceso repetitivo que consume tiempo, probablemente podamos automatizarlo. Agenda una consulta y evaluamos tu caso específico."
              },
              {
                question: "¿Cuánto tarda la implementación?",
                answer: "La mayoría de automatizaciones están listas en 2-4 semanas. Proyectos más complejos pueden tomar hasta 8 semanas. Siempre con entregas incrementales para que veas resultados rápido."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-black border border-neutral-800 rounded-2xl p-8"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">{faq.question}</h3>
                <p className="text-neutral-300 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-5xl font-bold mb-6">¿Listo para mejorar la eficiencia de tu equipo?</h2>
            <p className="text-xl text-neutral-300 mb-8">
              Descubre cómo la automatización puede reducir tu carga manual y acelerar tus procesos financieros.
            </p>
            
            <Link href="/consulta">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-12 py-6 rounded-2xl font-bold text-xl hover:opacity-90 transition-all duration-200 shadow-2xl inline-block cursor-pointer"
              >
                Agendar consulta gratis
              </motion.div>
            </Link>
            
            <p className="text-sm text-neutral-400 mt-6">
              Sin compromiso. Evaluamos tu caso y te mostramos el potencial de automatización.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              © {currentYear} Finka Finance. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm focus-ring rounded px-2 py-1">
                Términos
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm focus-ring rounded px-2 py-1">
                Privacidad
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm focus-ring rounded px-2 py-1">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
