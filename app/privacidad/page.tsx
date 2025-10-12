'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Política de Privacidad</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-12">Última actualización: Enero 2025</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Información que Recopilamos</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed mb-4">
                  Recopilamos la siguiente información:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400 dark:text-gray-300">
                  <li>Información de cuenta (nombre, email, empresa)</li>
                  <li>Datos financieros necesarios para el servicio</li>
                  <li>Información de uso y analíticas</li>
                  <li>Datos de comunicación con soporte</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Cómo Usamos tu Información</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed mb-4">
                  Utilizamos tu información para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400 dark:text-gray-300">
                  <li>Proporcionar y mejorar nuestros servicios</li>
                  <li>Procesar transacciones y automatizaciones</li>
                  <li>Enviar comunicaciones importantes</li>
                  <li>Cumplir con obligaciones legales</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Seguridad de Datos</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  Implementamos medidas de seguridad robustas incluyendo encriptación AES-256, autenticación multi-factor, backups automáticos y cumplimiento con SOC 2, GDPR e ISO 27001.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Compartir Información</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  No vendemos ni compartimos tu información personal con terceros, excepto cuando sea necesario para proporcionar el servicio o cumplir con la ley.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Tus Derechos</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed mb-4">
                  Tienes derecho a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400 dark:text-gray-300">
                  <li>Acceder a tu información personal</li>
                  <li>Corregir datos inexactos</li>
                  <li>Solicitar la eliminación de tus datos</li>
                  <li>Exportar tu información</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  Utilizamos cookies para mejorar tu experiencia. Consulta nuestra Política de Cookies para más información.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Contacto</h2>
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  Para preguntas sobre privacidad, contáctanos en: privacy@flow.finance
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
