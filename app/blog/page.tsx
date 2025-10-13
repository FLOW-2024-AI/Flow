'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

const blogPosts = [
  {
    title: "Cómo la IA está transformando la contabilidad empresarial",
    excerpt: "Descubre cómo la inteligencia artificial está revolucionando los procesos contables y financieros en las empresas modernas.",
    category: "IA & Tecnología",
    date: "15 Mar 2025",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80"
  },
  {
    title: "5 señales de que necesitas automatizar tus finanzas",
    excerpt: "¿Tu equipo pasa horas en tareas manuales? Identifica cuándo es el momento de automatizar tu operación financiera.",
    category: "Automatización",
    date: "12 Mar 2025",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80"
  },
  {
    title: "Guía completa de conciliación bancaria automatizada",
    excerpt: "Todo lo que necesitas saber para implementar conciliación bancaria automática en tu empresa.",
    category: "Guías",
    date: "10 Mar 2025",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&q=80"
  },
  {
    title: "ROI de la automatización financiera: casos reales",
    excerpt: "Análisis de retorno de inversión en proyectos de automatización con datos reales de empresas.",
    category: "Casos de éxito",
    date: "8 Mar 2025",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&q=80"
  },
  {
    title: "Integración de ERPs: mejores prácticas",
    excerpt: "Cómo integrar Flow con tu ERP existente sin interrumpir operaciones.",
    category: "Integraciones",
    date: "5 Mar 2025",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80"
  },
  {
    title: "El futuro de la gestión financiera con IA",
    excerpt: "Tendencias y predicciones sobre cómo la IA transformará las finanzas empresariales.",
    category: "Tendencias",
    date: "1 Mar 2025",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&q=80"
  }
]

const categories = ["Todos", "IA & Tecnología", "Automatización", "Guías", "Casos de éxito", "Integraciones", "Tendencias"]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#191919] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Blog de
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Flow
              </span>
            </h1>
            <p className="text-xl text-gray-400 dark:text-gray-300 max-w-3xl mx-auto">
              Insights, guías y tendencias sobre automatización financiera e inteligencia artificial
            </p>
          </motion.div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => (
              <button
                key={index}
                className="px-6 py-2 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-full hover:border-blue-500 hover:text-blue-400 transition-all"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:border-gray-300 dark:border-gray-600 transition-all cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-gray-900 dark:text-white text-xs font-bold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime} lectura</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="text-blue-400 font-medium flex items-center">
                    Leer más
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Suscríbete al newsletter</h2>
          <p className="text-xl text-gray-400 dark:text-gray-300 mb-8">
            Recibe artículos, guías y novedades directamente en tu inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 px-6 py-4 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button className="bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
