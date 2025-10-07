'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, type Lead } from '@/lib/supabaseClient'

export default function CTAForm() {
  const [formData, setFormData] = useState({
    email: '',
    company: '',
    role: ''
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
    
    if (!formData.email) {
      setError('El email es obligatorio')
      return
    }
    
    if (!validateEmail(formData.email)) {
      setError('Por favor ingresa un email válido')
      return
    }

    setIsLoading(true)

    try {
      // 1. Insertar en Supabase
      const leadData: Lead = {
        email: formData.email,
        company: formData.company || '',
        role: formData.role || '',
      }

      const { data, error: supabaseError } = await supabase
        .from('leads')
        .insert([leadData])
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
          email: createdLead.email,
          company: createdLead.company,
          role: createdLead.role,
          created_at: createdLead.created_at,
        }),
      })

      setIsSuccess(true)
      setFormData({ email: '', company: '', role: '' })
    } catch (err) {
      console.error('Error al enviar formulario:', err)
      setError('Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-950/30 border border-green-800/50 rounded-2xl p-8 text-center"
      >
        <div className="text-green-400 text-lg font-medium mb-2">
          ¡Listo! Recibimos tu solicitud.
        </div>
        <p className="text-neutral-300">
          Te escribiremos pronto.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-400 focus-ring transition-colors"
            placeholder="tu@empresa.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-white mb-2">
            Empresa
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-400 focus-ring transition-colors"
            placeholder="Nombre de tu empresa"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-white mb-2">
            Cargo
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-400 focus-ring transition-colors"
            placeholder="CFO, Controller, etc."
            disabled={isLoading}
          />
        </div>
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
        disabled={isLoading || !formData.email}
        whileHover={{ opacity: 0.9 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white text-black font-semibold py-4 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            Enviando...
          </>
        ) : (
          'Quiero acceso'
        )}
      </motion.button>

      <p className="text-xs text-neutral-400 text-center">
        Al enviar aceptas recibir comunicación sobre Flow. No hacemos spam.
      </p>
    </motion.form>
  )
}
