'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import CTAForm from '@/components/CTAForm'
import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import CounterAnimation from '@/components/CounterAnimation'
import InfiniteLogoCarousel from '@/components/InfiniteLogoCarousel'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'
import ROICalculator from '@/components/ROICalculator'
import StickyCTA from '@/components/StickyCTA'
import Testimonials from '@/components/Testimonials'
import Analytics from '@/components/Analytics'
import ExitIntent from '@/components/ExitIntent'
import TrustBadges from '@/components/TrustBadges'
import LiveStats from '@/components/LiveStats'
import ChatWidget from '@/components/ChatWidget'
import Navbar from '@/components/Navbar'

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
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      {/* Hero Section - Mejorado estilo Khipu */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/10 dark:bg-primary-600/5 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-block">
              <div className="bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 rounded-full px-6 py-2 text-sm font-semibold text-primary-700 dark:text-primary-400 mb-6">
                +20 empresas ya confían en nosotros
              </div>
            </motion.div>

            <motion.h1 
              variants={itemVariants} 
              className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight"
            >
              RPA + IA para tu Ecosistema Financiero
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 animate-gradient">
                No reemplazamos tu ERP. Lo potenciamos.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Flow conecta tu ERP, Bancos, SUNAT y más. Automatiza con RPA, analiza con IA y accede a financiamiento. 
              Tu CFO Digital + Ecosistema Financiero en una plataforma.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/consulta">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-600 hover:bg-primary-700 text-gray-900 dark:text-white px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 inline-block cursor-pointer"
                >
                  Agendar consulta gratis
                </motion.div>
              </Link>
              <a href="#testimonios">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-full font-medium text-sm hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-neutral-100 transition-all duration-200 inline-block cursor-pointer"
                >
                  Ver casos de éxito
                </motion.div>
              </a>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto"
            >
              {[
                { value: 450, suffix: '%', label: 'ROI Promedio', color: 'from-blue-500 to-blue-600' },
                { value: 80, suffix: '%', label: 'Menos tiempo manual', color: 'from-secondary-500 to-secondary-600' },
                { value: 100, suffix: '%', label: 'Visibilidad tiempo real', color: 'from-green-500 to-green-600' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 hover:border-gray-300 dark:border-gray-600 transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-all duration-300`} />
                  <div className="relative z-10">
                    <div className={`text-2xl font-semibold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                      <CounterAnimation end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Integrations Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-4">
              🔌 INTEGRACIONES
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Conecta todo tu ecosistema
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Flow se integra con tus sistemas existentes. No reemplazamos nada, lo conectamos todo.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { category: 'ERP & Contabilidad', items: ['QuickBooks', 'Siigo', 'Concar', 'Y más...'], icon: '📊', color: 'blue' },
              { category: 'Bancos', items: ['BCP', 'BBVA', 'Interbank', 'Y más...'], icon: '🏦', color: 'green' },
              { category: 'SUNAT', items: ['SOL', 'PLAME', 'PLE', 'SIRE'], icon: '🏛️', color: 'purple' },
              { category: 'Pagos', items: ['Mercado Pago', 'Niubiz', 'Culqi', 'Y más...'], icon: '💳', color: 'orange' }
            ].map((integration, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className={`bg-white dark:bg-neutral-950 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-${integration.color}-500/40 transition-all`}
              >
                <div className="text-4xl mb-3">{integration.icon}</div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">{integration.category}</h3>
                <div className="space-y-2">
                  {integration.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-2 h-2 bg-${integration.color}-400 rounded-full`}></div>
                      <span className={`text-sm ${item === 'Y más...' ? 'text-gray-500 dark:text-gray-400 italic' : 'text-gray-600 dark:text-gray-400'}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-secondary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-secondary-500/30 rounded-2xl p-8 text-center transition-colors duration-200"
          >
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Conecta todo tu ecosistema</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sincroniza automáticamente con RPA. Integraciones con ERPs, bancos y SUNAT.
            </p>
            <div className="flex justify-center gap-8">
              <div>
                <p className="text-3xl font-bold text-green-500 dark:text-green-400">Auto</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sincronización continua</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-500 dark:text-blue-400">80%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Menos tiempo manual</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary-500 dark:text-secondary-400">450%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">ROI promedio</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Trusted By Section - Logo Carousel */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase">
              Empresas que confían en F.L.O.W.
            </p>
          </motion.div>
          <InfiniteLogoCarousel />
        </div>
      </section>

      {/* Live Stats */}
      <LiveStats />

      {/* Product in Action - Screenshots Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-4">
              Producto en acción
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Dashboard intuitivo y poderoso
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Visualiza todo tu ecosistema financiero en tiempo real desde una sola plataforma
            </p>
          </motion.div>

          {/* Main Product Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative max-w-6xl mx-auto mb-16"
          >
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl shadow-blue-500/20 animate-glow">
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop&q=90"
                alt="F.L.O.W. Dashboard"
                width={1600}
                height={900}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-950/80 via-transparent to-transparent" />
            </div>
            
            {/* Floating Feature Cards */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -left-4 top-1/4 bg-white dark:bg-neutral-900 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-6 max-w-xs shadow-2xl animate-float"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    <CounterAnimation end={95} suffix="%" />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Automatización</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -right-4 bottom-1/4 bg-white dark:bg-neutral-900 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-6 max-w-xs shadow-2xl"
              style={{ animationDelay: '2s' }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    <CounterAnimation end={24} suffix="/7" />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Monitoreo activo</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: '📊', title: 'Analytics en tiempo real', desc: 'KPIs actualizados al segundo' },
              { icon: '🔔', title: 'Alertas inteligentes', desc: 'Notificaciones proactivas de anomalías' },
              { icon: '📱', title: 'Mobile-first', desc: 'Acceso desde cualquier dispositivo' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-gray-300 dark:border-gray-600 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Comparison Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-4">
              Transformación real
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Antes vs Después
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Compara cómo era tu proceso financiero y cómo será con F.L.O.W.
            </p>
          </motion.div>

          <BeforeAfterSlider />
        </div>
      </section>

      {/* Problem/Solution Section - Estilo Khipu */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-4">El caos financiero no debería ser normal</p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Dirigir un negocio no debería ser así</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Perder horas en hojas de cálculo, conciliaciones o reportes atrasados no es necesario. Flow elimina el trabajo manual.
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
                <p className="text-gray-600 dark:text-gray-400">Proceso manual y propenso a errores</p>
              </div>
              
              <div className="space-y-4">
                {[
                  'Horas perdidas en hojas de cálculo',
                  'Conciliaciones bancarias manuales',
                  'Reportes financieros atrasados',
                  'Información dispersa y desactualizada'
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
                    <span className="text-gray-400 dark:text-gray-300">{problem}</span>
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
                <p className="text-gray-600 dark:text-gray-400">Rápido, automatizado y fácil de usar</p>
              </div>
              
              <div className="space-y-4">
                {[
                  'IA lee y procesa facturas automáticamente',
                  'Dashboards dinámicos actualizados al instante',
                  'Copiloto conversacional responde tus preguntas',
                  'Predicciones precisas y control en tiempo real'
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
                    <span className="text-gray-400 dark:text-gray-300">{solution}</span>
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
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
              className="bg-gradient-to-br from-secondary-900 to-secondary-800 border border-primary-700/30 rounded-2xl p-8 transition-transform duration-200 shadow-lg"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-blue-400 rounded-sm"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Departamentos financieros</h3>
              <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                Automatiza cuentas por cobrar y por pagar, ingresos y compras - y enfócate en la estrategia.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-secondary-900 to-secondary-800 border border-primary-700/30 rounded-2xl p-8 transition-transform duration-200 shadow-lg"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-green-400 rounded-sm"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Equipos de RRHH</h3>
              <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                Agiliza las tareas tediosas involucradas en altas, reclutamiento y nómina.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-secondary-900 to-secondary-800 border border-primary-700/30 rounded-2xl p-8 transition-transform duration-200 shadow-lg"
            >
              <div className="w-12 h-12 bg-secondary-500/20 rounded-xl flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-secondary-400 rounded-sm"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Operaciones</h3>
              <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                Elimina el trabajo manual, sincroniza tus sistemas y evita que se pierda información.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section - Con imágenes estilo Khipu */}
      <section id="soluciones" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-4">Conoce Flow</p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">RPA + IA + CFO Digital + Ecosistema Financiero</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              No somos un ERP. Somos la capa inteligente que conecta, automatiza y potencia todo tu ecosistema financiero. 
              Integraciones + Automatización + Inteligencia + Financiamiento en una sola plataforma.
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
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white dark:bg-neutral-950 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 transition-all duration-300 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-500" />
              <div className="relative z-10">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-blue-500 to-secondary-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className="w-10 h-10 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-blue-400 transition-colors">RPA + IA: Automatización Total</h3>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed mb-4">
                  Conecta tu ERP, bancos y SUNAT. Flow sincroniza, clasifica y concilia automáticamente. 
                  Ahorra 48 horas al mes eliminando trabajo manual.
                </p>
                <div className="text-sm text-blue-400 font-medium">
                  Automatización inteligente →
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white dark:bg-neutral-950 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 transition-all duration-300 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-all duration-500" />
              <div className="relative z-10">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-green-500/20"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className="w-10 h-10 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-green-400 transition-colors">CFO Digital: Dashboard Ejecutivo</h3>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed mb-4">
                  Score de salud financiera, ratios, predicciones con IA y alertas proactivas. 
                  Todo lo que un CFO necesita en tiempo real.
                </p>
                <div className="text-sm text-green-400 font-medium">
                  Inteligencia financiera →
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white dark:bg-neutral-950 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 transition-all duration-300 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all duration-500" />
              <div className="relative z-10">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-orange-500/20"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className="w-10 h-10 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-orange-400 transition-colors">Ecosistema Financiero</h3>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed mb-4">
                  Accede a Confirming, Factoring y líneas de crédito Flash desde la plataforma. 
                  Financiamiento inteligente cuando lo necesitas.
                </p>
                <div className="text-sm text-orange-400 font-medium">
                  Financiamiento integrado →
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-4">
              Tecnología de vanguardia
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Construido con las mejores herramientas
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Infraestructura robusta y escalable que garantiza seguridad y rendimiento
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: 'IA & Machine Learning', icon: '🤖', desc: 'Procesamiento inteligente de datos' },
              { name: 'Cloud Infrastructure', icon: '☁️', desc: 'AWS & Azure para máxima disponibilidad' },
              { name: 'Seguridad Empresarial', icon: '🔒', desc: 'Encriptación end-to-end' },
              { name: 'APIs RESTful', icon: '🔌', desc: 'Integración con cualquier sistema' },
              { name: 'Real-time Sync', icon: '⚡', desc: 'Datos actualizados al instante' },
              { name: 'Backup Automático', icon: '💾', desc: 'Respaldos cada 6 horas' },
              { name: 'Compliance', icon: '✅', desc: 'SOC 2, GDPR, ISO 27001' },
              { name: 'Uptime 99.9%', icon: '📈', desc: 'Disponibilidad garantizada' }
            ].map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-all group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {tech.icon}
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                  {tech.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tech.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Tech Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-gray-200 dark:border-gray-700 rounded-3xl p-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8 text-center">Arquitectura de Flow</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📥</span>
                    </div>
                    <h4 className="font-semibold mb-2">Ingesta de Datos</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Captura automática desde múltiples fuentes
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">⚙️</span>
                    </div>
                    <h4 className="font-semibold mb-2">Procesamiento IA</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Validación y clasificación inteligente
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📊</span>
                    </div>
                    <h4 className="font-semibold mb-2">Visualización</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Dashboards y reportes en tiempo real
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Creamos las herramientas ideales para tu equipo</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
              <p className="text-gray-400 dark:text-gray-300 text-sm">
                La mayoría están listas en menos de 3 semanas. Sin esperas. Sin desarrollos eternos.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-blue-400 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sin cambiar tus sistemas</h3>
              <p className="text-gray-400 dark:text-gray-300 text-sm">
                Se conectan con lo que ya usas: ERP, hojas de cálculo y bases de datos.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 bg-secondary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-secondary-400 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sin equipo de desarrollo</h3>
              <p className="text-gray-400 dark:text-gray-300 text-sm">
                Nosotros lo diseñamos, lo montamos y damos soporte. No necesitas ingenieros.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-orange-400 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">ROI rápido, resultados reales</h3>
              <p className="text-gray-400 dark:text-gray-300 text-sm">
                Desde el primer día se ahorra tiempo y esfuerzo - sin promesas vacías.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Lo dicen nuestros clientes</h2>
            <p className="text-xl text-gray-400 dark:text-gray-300">
              Empresas que ya automatizan sus finanzas con Flow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Patricio Isassi",
                role: "CEO @ IBJ Soluciones",
                quote: "En IBJ integramos Flow como nuestro ERP financiero y los resultados han sido excelentes. Nos da transparencia operativa y control estratégico en todas las áreas financieras.",
                metrics: [{ value: "5h+", label: "Ahorro semanal" }, { value: "3+", label: "Procesos automatizados" }]
              },
              {
                name: "Damián Fraser",
                role: "CEO @ Miranda Partners",
                quote: "Desde que usamos Flow, mejoró mucho la productividad de nuestros equipos contables y administrativos. Sus herramientas nos ayudaron a optimizar flujos de forma increíble.",
                metrics: [{ value: "10h+", label: "Ahorro semanal" }, { value: "2x", label: "Cierre más rápido" }]
              },
              {
                name: "Jairo Ante",
                role: "Director Financiero @ Latam Autos",
                quote: "Antes de Flow, tener datos bancarios consolidados en tiempo real parecía imposible. Con su herramienta automatizada optimizamos procesos y redujimos errores.",
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
                className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 transition-transform duration-200"
              >
                <div className="flex gap-4 mb-6">
                  {testimonial.metrics.map((metric, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{metric.label}</div>
                    </div>
                  ))}
                </div>
                
                <p className="text-gray-400 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-secondary-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-gray-900 dark:text-white font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ERP Integration Section - Estilo Khipu */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-4">Integración perfecta</p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Se integra con tus herramientas favoritas</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Flow funciona con Odoo, SAP, Oracle, QuickBooks y más. Tu información se sincroniza automáticamente y de forma segura.
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Animation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[350px] rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-950 to-neutral-900 border border-gray-200 dark:border-gray-700/50"
            >
              {/* Sophisticated Minimal Animation */}
              
              {/* Floating Grid Pattern */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-px h-px bg-white"
                    style={{
                      left: `${10 + (i % 5) * 20}%`,
                      top: `${20 + Math.floor(i / 5) * 20}%`,
                    }}
                    animate={{
                      opacity: [0.1, 0.3, 0.1],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Center - Logo with Orbit */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {/* Orbiting dots */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white dark:bg-neutral-900 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 2.67,
                    }}
                  >
                    <div 
                      className="w-1 h-1 bg-white dark:bg-neutral-900 rounded-full"
                      style={{
                        transform: 'translate(-50%, -80px)',
                      }}
                    />
                  </motion.div>
                ))}
                
                {/* Logo */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative w-28 h-28 bg-gray-50 dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center p-4"
                >
                  <Image 
                    src="/images/logo/flow-logo.jpg" 
                    alt="Flow" 
                    width={90} 
                    height={90}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>

              {/* Connecting Nodes */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Left node */}
                <motion.circle
                  cx="20%"
                  cy="50%"
                  r="3"
                  fill="white"
                  opacity="0.4"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Right nodes */}
                {[30, 40, 50, 60, 70].map((y, i) => (
                  <motion.circle
                    key={i}
                    cx="80%"
                    cy={`${y}%`}
                    r="2"
                    fill="white"
                    opacity="0.3"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3
                    }}
                  />
                ))}
                
                {/* Subtle connecting lines */}
                <motion.line
                  x1="20%"
                  y1="50%"
                  x2="50%"
                  y2="50%"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.1"
                  strokeDasharray="4 4"
                  animate={{
                    strokeDashoffset: [0, -8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {[30, 40, 50, 60, 70].map((y, i) => (
                  <motion.line
                    key={i}
                    x1="50%"
                    y1="50%"
                    x2="80%"
                    y2={`${y}%`}
                    stroke="white"
                    strokeWidth="0.5"
                    opacity="0.08"
                    strokeDasharray="4 4"
                    animate={{
                      strokeDashoffset: [0, -8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.2
                    }}
                  />
                ))}
              </svg>

              {/* Subtle Labels */}
              <div className="absolute left-[20%] top-1/2 -translate-y-1/2 -translate-x-16">
                <p className="text-white/40 text-xs font-medium">Source</p>
              </div>
              
              <div className="absolute right-[20%] top-[30%] translate-x-8">
                <p className="text-white/40 text-xs font-medium">Systems</p>
              </div>
            </motion.div>

            {/* Right - Features Text */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {[
                { 
                  icon: '🔄', 
                  title: 'Sincronización bidireccional', 
                  desc: 'Datos actualizados en tiempo real entre Flow y tu ERP' 
                },
                { 
                  icon: '⚡', 
                  title: 'Implementación rápida', 
                  desc: 'Conecta tu sistema en días, no meses' 
                },
                { 
                  icon: '🔒', 
                  title: 'Seguridad empresarial', 
                  desc: 'Encriptación de extremo a extremo y cumplimiento normativo' 
                },
                { 
                  icon: '📊', 
                  title: 'APIs robustas', 
                  desc: 'Documentación completa y soporte técnico dedicado' 
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Features Grid Below - Removed */}
          <div className="hidden">
            {/* Features List Below */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
            >
              {[
                { icon: '🔄', title: 'Sincronización bidireccional', desc: 'Datos actualizados en tiempo real entre Flow y tu ERP' },
                { icon: '⚡', title: 'Implementación rápida', desc: 'Conecta tu sistema en días, no meses' },
                { icon: '🔒', title: 'Seguridad empresarial', desc: 'Encriptación de extremo a extremo y cumplimiento normativo' },
                { icon: '📊', title: 'APIs robustas', desc: 'Documentación completa y soporte técnico dedicado' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-100 dark:bg-neutral-900 transition-all duration-300"
                >
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section - Mejorado */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-4">Proceso simple</p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Empezar es fácil</h2>
            <p className="text-xl text-gray-400 dark:text-gray-300">
              De la idea a la automatización activa - en solo 3 pasos.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {[
              { num: 1, title: 'Descubrimiento', desc: 'Llamada rápida para mapear tus procesos y elegir qué automatizar.', color: 'from-blue-500 to-secondary-600' },
              { num: 2, title: 'Desarrollo', desc: 'Construimos rápido. Tú revisas y ajustamos si hace falta.', color: 'from-green-500 to-teal-600' },
              { num: 3, title: 'Lanzamiento y mejora', desc: 'Se pone en marcha. Damos soporte y seguimos mejorando contigo.', color: 'from-orange-500 to-red-600' }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants} 
                whileHover={{ scale: 1.02, x: 10 }}
                className="group relative bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-all duration-500`} />
                <div className="relative z-10 flex items-start space-x-6">
                  <motion.div 
                    className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center font-bold text-2xl shadow-xl`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {step.num}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">{step.title}</h3>
                    <p className="text-gray-400 dark:text-gray-300 text-lg leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-4">
              Retorno de inversión
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              ¿Cuánto ahorrarás con Flow?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Calcula el impacto real que Flow tendrá en tu operación financiera
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ROICalculator />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="preguntas" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-950/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-4">FAQ</p>
            <h2 className="text-4xl font-bold mb-6">Todo lo que necesitas saber</h2>
            <p className="text-xl text-gray-400 dark:text-gray-300">
              ¿Dudas? Tenemos respuestas. Aquí tienes todo lo que debes saber antes de empezar.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "¿Con qué herramientas se integra?",
                answer: "Flow se conecta con ERPs (SAP, Oracle, Dynamics), bancos (APIs bancarias), hojas de cálculo (Excel, Google Sheets), bases de datos (MySQL, PostgreSQL), y herramientas como Airtable, n8n, y Zapier."
              },
              {
                question: "¿Necesito un equipo de desarrollo?",
                answer: "No. Nosotros nos encargamos de todo el desarrollo, implementación y soporte. Tú solo necesitas definir qué procesos quieres automatizar y nosotros lo construimos."
              },
              {
                question: "¿Qué tipo de tareas puede automatizar Flow?",
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
                className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-gray-700 rounded-2xl p-8"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{faq.question}</h3>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-secondary-900 dark:to-secondary-800 transition-colors duration-200">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-gray-900 dark:text-gray-100">
              El futuro de la gestión financiera
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Flow no es solo un software: es un copiloto que piensa, aprende y te anticipa los números antes de que lo hagas tú. Únete a la nueva era de la inteligencia financiera.
            </p>
            
            <Link href="/consulta">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-neutral-100 transition-all duration-200 shadow-2xl cursor-pointer"
              >
                Agendar consulta gratis
              </motion.div>
            </Link>
            
            <p className="text-base text-gray-600 dark:text-gray-400 mt-8">
              Sin compromiso. Evaluamos tu caso y te mostramos el potencial de automatización.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer Premium */}
      <footer className="border-t border-gray-200 dark:border-primary-800/30 bg-gradient-to-b from-secondary-900 to-secondary-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Newsletter Section */}
          <div className="py-16 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-3xl font-bold mb-4">Mantente actualizado</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Recibe tips de automatización financiera y novedades de producto
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-6 py-4 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition-colors"
                >
                  Suscribirse
                </motion.button>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Producto */}
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-3">
                <li><Link href="/soluciones" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Soluciones</Link></li>
                <li><Link href="/como-funciona" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Cómo funciona</Link></li>
                <li><Link href="/precios" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Precios</Link></li>
                <li><Link href="/integraciones" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Integraciones</Link></li>
                <li><Link href="/seguridad" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Seguridad</Link></li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-3">
                <li><Link href="/quienes-somos" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Quiénes somos</Link></li>
                <li><Link href="/casos-exito" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Casos de éxito</Link></li>
                <li><Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Blog</Link></li>
                <li><Link href="/consulta" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Carreras</Link></li>
                <li><Link href="/consulta" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Prensa</Link></li>
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-3">
                <li><Link href="/documentacion" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Documentación</Link></li>
                <li><Link href="/api-docs" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">API</Link></li>
                <li><Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">FAQ</Link></li>
                <li><Link href="/contacto" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Soporte</Link></li>
                <li><Link href="/estado" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Estado del sistema</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/terminos" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Términos de servicio</Link></li>
                <li><Link href="/privacidad" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Privacidad</Link></li>
                <li><Link href="/privacidad" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Cookies</Link></li>
                <li><Link href="/terminos" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Licencias</Link></li>
                <li><Link href="/contacto" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors text-sm">Contacto</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="py-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Image 
                  src="/images/logo/flow-logo.jpg" 
                  alt="Flow" 
                  width={100} 
                  height={46}
                  className="h-12 w-auto object-contain"
                />
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-6">
                {[
                  { name: 'LinkedIn', icon: 'in' },
                  { name: 'Twitter', icon: '𝕏' },
                  { name: 'YouTube', icon: '▶' },
                  { name: 'GitHub', icon: 'gh' }
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href="#"
                    whileHover={{ y: -2 }}
                    className="w-10 h-10 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:border-gray-300 dark:border-gray-600 transition-all"
                    aria-label={social.name}
                  >
                    <span className="text-sm font-semibold">{social.icon}</span>
                  </motion.a>
                ))}
              </div>

              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © {currentYear} Flow. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky CTA */}
      <StickyCTA />

      {/* Chat Widget */}
      <ChatWidget />

      {/* Exit Intent Popup */}
      <ExitIntent />

      {/* Analytics */}
      <Analytics />
    </div>
  )
}
