'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Términos de Servicio</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-12">Última actualización: Enero 2025</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Aceptación de los Términos</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  Al acceder y utilizar Flow, aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Descripción del Servicio</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  Flow es una plataforma SaaS de automatización financiera que utiliza RPA e IA para conectar y optimizar procesos contables y de tesorería empresarial.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Uso del Servicio</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed mb-4">
                  Te comprometes a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400 dark:text-gray-300">
                  <li>Proporcionar información precisa y actualizada</li>
                  <li>Mantener la seguridad de tu cuenta</li>
                  <li>No usar el servicio para actividades ilegales</li>
                  <li>Cumplir con todas las leyes aplicables</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Propiedad Intelectual</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  Todo el contenido, características y funcionalidad de Flow son propiedad exclusiva de Flow y están protegidos por leyes de propiedad intelectual.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Privacidad y Seguridad</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  Tu privacidad es importante para nosotros. Consulta nuestra Política de Privacidad para entender cómo recopilamos, usamos y protegemos tu información.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Limitación de Responsabilidad</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  Flow no será responsable de daños indirectos, incidentales o consecuentes que surjan del uso o la imposibilidad de usar el servicio.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Modificaciones</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Contacto</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  Para preguntas sobre estos términos, contáctanos en: legal@flow.finance
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
