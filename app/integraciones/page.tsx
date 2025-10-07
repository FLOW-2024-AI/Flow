'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Logo from '@/components/Logo'
import Image from 'next/image'

const integrations = [
  {
    category: "ERP y Contabilidad",
    tools: [
      { name: "Odoo", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Odoo_Official_Logo.png", description: "ERP open source completo" },
      { name: "SAP", logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg", description: "Sistema empresarial líder" },
      { name: "Oracle NetSuite", logo: "https://www.netsuite.com/portal/assets/img/business-software/erp/social/netsuite-logo-open-graph.png", description: "Cloud ERP suite" },
      { name: "QuickBooks", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/QuickBooks_logo.svg", description: "Contabilidad para PyMEs" },
      { name: "Xero", logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Xero_software_logo.svg", description: "Contabilidad en la nube" },
      { name: "Dynamics 365", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Microsoft_Dynamics_365_logo.svg", description: "ERP de Microsoft" }
    ]
  },
  {
    category: "Bancos y Pagos",
    tools: [
      { name: "Bancolombia", logo: "https://www.bancolombia.com/wcm/connect/www.bancolombia.com-26259/8d7f8b3e-5c4a-4f7f-9f0e-3b3e3e3e3e3e/logo-bancolombia.png", description: "Conexión bancaria directa" },
      { name: "Davivienda", logo: "https://www.davivienda.com/wps/themes/html/minisitios/brand/img/logo.svg", description: "API bancaria" },
      { name: "BBVA", logo: "https://upload.wikimedia.org/wikipedia/commons/3/32/BBVA_2019.svg", description: "Integración bancaria" },
      { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", description: "Procesamiento de pagos" },
      { name: "PayPal", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg", description: "Pagos digitales" },
      { name: "Wompi", logo: "https://wompi.com/assets/images/logo.svg", description: "Pagos en línea" }
    ]
  },
  {
    category: "Productividad",
    tools: [
      { name: "Google Sheets", logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg", description: "Hojas de cálculo" },
      { name: "Excel", logo: "https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg", description: "Microsoft Excel" },
      { name: "Airtable", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg", description: "Base de datos flexible" },
      { name: "Notion", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", description: "Workspace todo-en-uno" },
      { name: "Google Drive", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg", description: "Almacenamiento cloud" },
      { name: "Dropbox", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Dropbox_logo_2017.svg", description: "Sincronización de archivos" }
    ]
  },
  {
    category: "Automatización",
    tools: [
      { name: "n8n", logo: "https://n8n.io/favicon.svg", description: "Workflow automation" },
      { name: "Zapier", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Zapier_logo.svg", description: "Conecta apps" },
      { name: "Make", logo: "https://www.make.com/en/brand/make-logo.svg", description: "Automatización visual" },
      { name: "Power Automate", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Power_Automate_logo.svg", description: "Microsoft automation" }
    ]
  }
]

export default function IntegracionesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-neutral-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="flex items-center">
              <Logo 
                width={168} 
                height={78}
                className="h-20 w-auto object-contain"
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

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Integraciones
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                sin límites
              </span>
            </h1>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Flow se conecta con tus herramientas favoritas. Sincronización automática y segura.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-20">
          {integrations.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8">{category.category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool, toolIndex) => (
                  <motion.div
                    key={toolIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: toolIndex * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 flex-shrink-0 relative bg-white rounded-lg p-2 flex items-center justify-center">
                        <img 
                          src={tool.logo} 
                          alt={tool.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                        <p className="text-sm text-neutral-400">{tool.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">¿Por qué nuestras integraciones?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔒",
                title: "Seguridad empresarial",
                description: "Encriptación end-to-end y cumplimiento con estándares internacionales"
              },
              {
                icon: "⚡",
                title: "Sincronización en tiempo real",
                description: "Datos actualizados al instante entre todos tus sistemas"
              },
              {
                icon: "🛠️",
                title: "Configuración flexible",
                description: "Adapta las integraciones a tus necesidades específicas"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Integration CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">¿No ves tu herramienta?</h2>
            <p className="text-xl text-neutral-300 mb-8">
              Creamos integraciones personalizadas para cualquier sistema con API
            </p>
            <Link href="/consulta" className="inline-block bg-white text-black px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity">
              Consultar integración custom
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
