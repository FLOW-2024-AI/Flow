'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const testimonials = [
  {
    name: 'María González',
    role: 'CFO',
    company: 'TechCorp',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
    quote: 'Flow redujo nuestro tiempo de cierre mensual de 10 días a solo 2. La automatización es impresionante.',
    metrics: '80% menos tiempo',
    rating: 5
  },
  {
    name: 'Carlos Mendoza',
    role: 'Controller',
    company: 'RetailMax',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80',
    quote: 'La conciliación bancaria que antes tomaba días ahora es instantánea. ROI positivo en el primer mes.',
    metrics: '$50K ahorrados/año',
    rating: 5
  },
  {
    name: 'Ana Ruiz',
    role: 'Directora Financiera',
    company: 'LogiPro',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80',
    quote: 'El dashboard en tiempo real cambió completamente nuestra toma de decisiones. Datos precisos al instante.',
    metrics: '100% visibilidad',
    rating: 5
  }
]

export default function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium text-gray-500 dark:text-gray-500 tracking-wider uppercase mb-4">
            Lo que dicen nuestros clientes
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Historias de éxito reales
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Empresas que transformaron sus finanzas con Flow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-[#252525] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Metric Badge */}
              <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-6">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{testimonial.metrics}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
