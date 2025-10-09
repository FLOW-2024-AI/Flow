'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabaseClient'

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

export default function ConsultaPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    empresa: '',
    cargo: '',
    telefono: '',
    empleados: '',
    procesos: '',
    mensaje: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validaciones
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.empresa) {
      setError('Por favor completa todos los campos obligatorios')
      return
    }
    
    if (!validateEmail(formData.email)) {
      setError('Por favor ingresa un email corporativo válido')
      return
    }

    setIsLoading(true)

    try {
      // 1. Insertar en Supabase
      const consultaData = {
        email: formData.email,
        company: formData.empresa,
        role: formData.cargo,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        empleados: formData.empleados,
        procesos: formData.procesos,
        mensaje: formData.mensaje,
        tipo: 'consulta'
      }

      const { data, error: supabaseError } = await supabase
        .from('leads')
        .insert([consultaData])
        .select()

      if (supabaseError) {
        throw new Error(supabaseError.message)
      }

      // 2. Notificar a n8n
      const createdLead = data[0]
      await fetch('/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...createdLead,
          tipo: 'consulta_agendada'
        }),
      })

      setIsSuccess(true)
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        empresa: '',
        cargo: '',
        telefono: '',
        empleados: '',
        procesos: '',
        mensaje: ''
      })
    } catch (err) {
      console.error('Error al enviar consulta:', err)
      setError('Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white dark:bg-secondary-900 text-gray-900 dark:text-gray-100 flex items-center justify-center px-4 transition-colors duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-6">¡Consulta enviada exitosamente!</h1>
          <p className="text-xl text-neutral-300 mb-8">
            Recibimos tu solicitud. Nuestro equipo se pondrá en contacto contigo en las próximas 24-48 horas para agendar tu consulta gratuita.
          </p>
          
          <div className="bg-neutral-950/50 border border-neutral-800 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">¿Qué sigue?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <p className="text-neutral-300">Te contactaremos para agendar una llamada de 30 minutos</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <p className="text-neutral-300">Analizaremos tus procesos y identificaremos oportunidades</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
                <p className="text-neutral-300">Te mostraremos ejemplos específicos para tu industria</p>
              </div>
            </div>
          </div>
          
          <Link 
            href="/"
            className="inline-block bg-white text-black px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Volver al inicio
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      {/* Main Content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Left Column - Info */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <div className="inline-block bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-sm font-semibold text-green-400 mb-4">
                  ✓ 100% Gratuita • Sin compromiso
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Agenda tu consulta gratuita</h1>
                <p className="text-xl text-neutral-300 leading-relaxed">
                  Descubre cómo Flow puede <span className="text-white font-semibold">reducir 80% el tiempo manual</span> y automatizar tus procesos financieros.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-400 rounded-sm"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Análisis personalizado</h3>
                    <p className="text-neutral-300">Evaluamos tus procesos actuales y identificamos oportunidades específicas de automatización.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 bg-green-400 rounded-sm"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Demo en vivo</h3>
                    <p className="text-neutral-300">Te mostramos casos reales de automatización similares a tu industria y necesidades.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 bg-purple-400 rounded-sm"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Plan de implementación</h3>
                    <p className="text-neutral-300">Diseñamos un roadmap claro con tiempos, costos y ROI esperado para tu proyecto.</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-950/50 border border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">¿Qué incluye la consulta?</h3>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>30 minutos de consulta personalizada</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Análisis de tus procesos actuales</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Identificación de oportunidades</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Propuesta de valor personalizada</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Sin compromiso ni costo</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div variants={itemVariants}>
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-white mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus-ring transition-colors"
                        placeholder="Tu nombre"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label htmlFor="apellido" className="block text-sm font-medium text-white mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus-ring transition-colors"
                        placeholder="Tu apellido"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                      Email corporativo *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus-ring transition-colors"
                      placeholder="tu@empresa.com"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="empresa" className="block text-sm font-medium text-white mb-2">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus-ring transition-colors"
                      placeholder="Nombre de tu empresa"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cargo" className="block text-sm font-medium text-white mb-2">
                        Cargo
                      </label>
                      <input
                        type="text"
                        id="cargo"
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus-ring transition-colors"
                        placeholder="CFO, Controller, etc."
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-white mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus-ring transition-colors"
                        placeholder="+1 234 567 8900"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="empleados" className="block text-sm font-medium text-white mb-2">
                      Tamaño de la empresa
                    </label>
                    <select
                      id="empleados"
                      name="empleados"
                      value={formData.empleados}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white focus-ring transition-colors"
                      disabled={isLoading}
                    >
                      <option value="">Selecciona el tamaño</option>
                      <option value="1-10">1-10 empleados</option>
                      <option value="11-50">11-50 empleados</option>
                      <option value="51-200">51-200 empleados</option>
                      <option value="201-500">201-500 empleados</option>
                      <option value="500+">Más de 500 empleados</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="procesos" className="block text-sm font-medium text-white mb-2">
                      ¿Qué procesos te gustaría automatizar?
                    </label>
                    <select
                      id="procesos"
                      name="procesos"
                      value={formData.procesos}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white focus-ring transition-colors"
                      disabled={isLoading}
                    >
                      <option value="">Selecciona un área</option>
                      <option value="conciliacion-bancaria">Conciliación bancaria</option>
                      <option value="cuentas-por-pagar">Cuentas por pagar</option>
                      <option value="cuentas-por-cobrar">Cuentas por cobrar / Cobranza</option>
                      <option value="facturacion-electronica">Facturación electrónica SUNAT</option>
                      <option value="reportes-sunat">Reportes SUNAT (PLAME, PLE, SIRE)</option>
                      <option value="presupuesto">Presupuesto y control</option>
                      <option value="flujo-caja">Flujo de caja proyectado</option>
                      <option value="todo">Todo lo anterior</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-white mb-2">
                      Cuéntanos más sobre tu situación actual
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus-ring transition-colors resize-none"
                      placeholder="Describe brevemente tus principales desafíos o procesos que consumen más tiempo..."
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm bg-red-950/30 border border-red-800/50 rounded-lg p-3"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading || !formData.nombre || !formData.apellido || !formData.email || !formData.empresa}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white text-black font-semibold py-4 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Agendar consulta gratuita'
                    )}
                  </motion.button>

                  <p className="text-xs text-neutral-400 text-center">
                    Al enviar este formulario aceptas que nos pongamos en contacto contigo para agendar la consulta. 
                    No compartimos tu información con terceros.
                  </p>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
