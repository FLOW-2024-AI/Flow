'use client'

import { useState } from 'react'
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

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes - you would implement real authentication here
      if (formData.email === 'admin@flow.finance' && formData.password === 'demo123') {
        // Store demo session
        if (typeof window !== 'undefined') {
          localStorage.setItem('demo_session', 'true')
        }
        // Redirect to dashboard
        console.log('Login successful!')
        const basePath = process.env.NODE_ENV === 'production' ? '/Flow' : ''
        window.location.href = `${basePath}/dashboard`
      } else {
        setError('Credenciales incorrectas. Intenta nuevamente.')
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo/Flow-logo.jpg" 
                alt="Flow" 
                width={168} 
                height={78}
                className="h-20 w-auto object-contain"
                style={{ height: '78px' }}
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

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 shadow-2xl">
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Iniciar Sesión</h1>
              <p className="text-neutral-400">
                Accede a tu panel de administración
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email corporativo
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="tu@flow.finance"
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all pr-12"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors focus:outline-none"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-white bg-black border-neutral-700 rounded focus:ring-white focus:ring-2"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-neutral-400">Recordarme</span>
                </label>
                
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-neutral-400 hover:text-white transition-colors focus-ring rounded px-1"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black py-3 px-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Iniciando sesión...
                    </div>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-neutral-800 text-center">
              <p className="text-sm text-neutral-400">
                ¿Necesitas acceso?{' '}
                <Link href="/consulta" className="text-white hover:underline focus-ring rounded px-1">
                  Contacta con soporte
                </Link>
              </p>
            </motion.div>

            {/* Demo credentials info */}
            <motion.div variants={itemVariants} className="mt-6 p-4 bg-neutral-800/30 rounded-xl border border-neutral-700">
              <p className="text-xs text-neutral-400 mb-2 font-medium">Demo - Credenciales de prueba:</p>
              <div className="text-xs text-neutral-300 space-y-1">
                <p><strong>Email:</strong> admin@flow.finance</p>
                <p><strong>Contraseña:</strong> demo123</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
