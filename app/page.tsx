'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { ArrowRight, Zap, Shield, TrendingUp, CheckCircle2, Sparkles, BarChart3, Lock, Globe } from 'lucide-react'
import Navbar from '@/components/Navbar'
import ROICalculator from '@/components/ROICalculator'
import Testimonials from '@/components/Testimonials'

export default function Home() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 antialiased">
      <Navbar />

      {/* Hero Section - Premium Webflow Style */}
      <section ref={targetRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900" />
        
        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gradient-to-l from-secondary-400 to-secondary-600 rounded-full blur-3xl opacity-30"
        />

        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 border border-primary-200 dark:border-primary-800 rounded-full px-5 py-2.5 mb-8 shadow-lg backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-semibold text-primary-900 dark:text-primary-100">
              Potenciado por IA y RPA
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-neutral-900 dark:text-neutral-50"
          >
            Tu Ecosistema
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500">
              Financiero Inteligente
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Conecta tu ERP, bancos y SUNAT. Automatiza con RPA, analiza con IA y accede a financiamiento.
            <span className="font-semibold text-neutral-900 dark:text-neutral-50"> Todo en una plataforma.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/consulta">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(14, 165, 233, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
              >
                Agendar Demo Gratuita
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="#features">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl font-semibold text-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300"
              >
                Ver Características
              </motion.button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-neutral-700 dark:text-neutral-300"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-medium">+20 empresas confían en Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-medium">80% reducción en tareas manuales</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-medium">ROI en 3 meses</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-neutral-300 dark:border-neutral-700 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-neutral-400 dark:bg-neutral-600 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section - Bento Grid Style */}
      <section id="features" className="py-32 px-6 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-neutral-900 dark:text-neutral-50">
              Potencia tu{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Operación Financiera
              </span>
            </h2>
            <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
              Automatización inteligente que se integra con tus sistemas existentes
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="lg:col-span-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group"
            >
              <div className="relative z-10">
                <Zap className="w-12 h-12 mb-6" />
                <h3 className="text-3xl font-bold mb-4">Automatización con RPA</h3>
                <p className="text-lg text-primary-100 mb-6">
                  Elimina tareas repetitivas. Nuestros bots trabajan 24/7 procesando facturas, conciliaciones y reportes.
                </p>
                <ul className="space-y-3">
                  {['Procesamiento automático de facturas', 'Conciliación bancaria en minutos', 'Reportes generados al instante'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary-200" />
                      <span className="text-primary-50">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-neutral-800 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300"
            >
              <BarChart3 className="w-12 h-12 text-secondary-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">Análisis con IA</h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                Predicciones financieras, detección de anomalías y recomendaciones inteligentes.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-neutral-800 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-700 hover:border-secondary-500 dark:hover:border-secondary-500 transition-all duration-300"
            >
              <Shield className="w-12 h-12 text-accent-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">Seguridad Enterprise</h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                Encriptación end-to-end, cumplimiento SOC 2 y auditorías completas.
              </p>
            </motion.div>

            {/* Feature 4 - Large */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="lg:col-span-2 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group"
            >
              <div className="relative z-10">
                <Globe className="w-12 h-12 mb-6" />
                <h3 className="text-3xl font-bold mb-4">Ecosistema Financiero</h3>
                <p className="text-lg text-secondary-100 mb-6">
                  Conecta con bancos, inversores y proveedores de financiamiento en un solo lugar.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {['Líneas de crédito', 'Factoring', 'Inversores', 'Productos bancarios'].map((item, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <span className="font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -left-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-32 px-6 bg-white dark:bg-neutral-950">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-neutral-900 dark:text-neutral-50">
              Calcula tu{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                Retorno de Inversión
              </span>
            </h2>
            <p className="text-xl text-neutral-700 dark:text-neutral-300">
              Descubre cuánto puedes ahorrar automatizando tus procesos financieros
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ROICalculator />
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-neutral-900 dark:text-neutral-50">
              Lo que dicen{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                nuestros clientes
              </span>
            </h2>
          </motion.div>
          <Testimonials />
        </div>
      </section>

      {/* Final CTA Section - Glassmorphism Premium */}
      <section className="py-32 px-6 relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.05]" />
        
        {/* Animated Orbs - Sutiles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-secondary-400 to-accent-400 rounded-full blur-3xl"
        />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-16 shadow-2xl"
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-neutral-900 dark:text-neutral-50">
                ¿Listo para transformar
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500">
                  tu operación financiera?
                </span>
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Agenda una demo gratuita y descubre cómo Flow puede ayudarte a automatizar, analizar y crecer.
              </p>
              <Link href="/consulta">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-12 py-5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-500 inline-flex items-center gap-3"
                >
                  Agendar Demo Ahora
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              
              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>30 días gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Soporte dedicado</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Flow Finance</h3>
              <p className="text-sm">
                Tu ecosistema financiero inteligente. Automatiza, analiza y crece.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/soluciones" className="hover:text-white transition-colors">Soluciones</Link></li>
                <li><Link href="/precios" className="hover:text-white transition-colors">Precios</Link></li>
                <li><Link href="/integraciones" className="hover:text-white transition-colors">Integraciones</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/quienes-somos" className="hover:text-white transition-colors">Nosotros</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link></li>
                <li><Link href="/terminos" className="hover:text-white transition-colors">Términos</Link></li>
                <li><Link href="/seguridad" className="hover:text-white transition-colors">Seguridad</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Flow Finance. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
