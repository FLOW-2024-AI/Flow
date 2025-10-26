'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import { 
  FileBarChart, 
  List, 
  Calendar, 
  Filter,
  Search,
  Download,
  Upload,
  Archive,
  Settings,
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  MoreVertical,
  Database,
  Bot,
  BarChart3,
  Edit3,
  CheckSquare,
  Send,
  TrendingUp,
  PieChart,
  X
} from 'lucide-react'

// Data dummy de facturas
const mockFacturas = [
  {
    id: 'F001-00012345',
    proveedor: 'Distribuidora ABC SAC',
    ruc: '20123456789',
    fecha: '2025-10-15',
    monto: 8500.00,
    impuesto: 1530.00,
    total: 10030.00,
    estado: 'Registrada',
    categoria: 'Mercadería',
    formaPago: 'Crédito 30 días',
    fechaVencimiento: '2025-11-15'
  },
  {
    id: 'F002-00087654',
    proveedor: 'Servicios Tecnológicos XYZ',
    ruc: '20987654321',
    fecha: '2025-10-14',
    monto: 3200.00,
    impuesto: 576.00,
    total: 3776.00,
    estado: 'Registrada',
    categoria: 'Servicios',
    formaPago: 'Contado',
    fechaVencimiento: '-'
  },
  {
    id: 'F001-00045678',
    proveedor: 'Logística Express SAC',
    ruc: '20456789123',
    fecha: '2025-10-13',
    monto: 1850.00,
    impuesto: 333.00,
    total: 2183.00,
    estado: 'Procesando',
    categoria: 'Transporte',
    formaPago: 'Crédito 15 días',
    fechaVencimiento: '2025-10-28'
  },
  {
    id: 'F003-00023456',
    proveedor: 'Suministros Generales EIRL',
    ruc: '20234567891',
    fecha: '2025-10-12',
    monto: 950.00,
    impuesto: 171.00,
    total: 1121.00,
    estado: 'Registrada',
    categoria: 'Suministros',
    formaPago: 'Contado',
    fechaVencimiento: '-'
  },
  {
    id: 'F001-00098765',
    proveedor: 'Marketing Digital Corp',
    ruc: '20876543219',
    fecha: '2025-10-11',
    monto: 5600.00,
    impuesto: 1008.00,
    total: 6608.00,
    estado: 'Pendiente',
    categoria: 'Marketing',
    formaPago: 'Crédito 45 días',
    fechaVencimiento: '2025-11-25'
  },
  {
    id: 'F002-00034567',
    proveedor: 'Consultoría Empresarial SAC',
    ruc: '20345678912',
    fecha: '2025-10-10',
    monto: 12000.00,
    impuesto: 2160.00,
    total: 14160.00,
    estado: 'Registrada',
    categoria: 'Consultoría',
    formaPago: 'Crédito 60 días',
    fechaVencimiento: '2025-12-10'
  },
  {
    id: 'F001-00056789',
    proveedor: 'Mantenimiento Industrial EIRL',
    ruc: '20567891234',
    fecha: '2025-10-09',
    monto: 2300.00,
    impuesto: 414.00,
    total: 2714.00,
    estado: 'Registrada',
    categoria: 'Mantenimiento',
    formaPago: 'Contado',
    fechaVencimiento: '-'
  },
  {
    id: 'F003-00067890',
    proveedor: 'Alquiler de Equipos SAC',
    ruc: '20678901234',
    fecha: '2025-10-08',
    monto: 4500.00,
    impuesto: 810.00,
    total: 5310.00,
    estado: 'Procesando',
    categoria: 'Alquiler',
    formaPago: 'Crédito 30 días',
    fechaVencimiento: '2025-11-08'
  }
]

// Estadísticas
const mockStats = {
  totalFacturas: 847,
  facturasEsteMes: 156,
  montoTotal: 2850420.00,
  montoEsteMes: 458900.00,
  pendientesValidacion: 12,
  confianzaPromedio: 94
}

// Facturas pendientes de validación
const mockFacturasPendientes = [
  {
    id: 'TEMP-2025-001',
    proveedor: 'Distribuidora Los Andes SAC',
    ruc: '20543210987',
    fecha: '2025-10-19',
    monto: 4500.00,
    impuesto: 810.00,
    total: 5310.00,
    confianza: 98,
    campos: { proveedor: 98, ruc: 100, monto: 99, fecha: 95 },
    origen: 'Email'
  },
  {
    id: 'TEMP-2025-002',
    proveedor: 'Servicios Técnicos Premium',
    ruc: '20678901234',
    fecha: '2025-10-18',
    monto: 2300.00,
    impuesto: 414.00,
    total: 2714.00,
    confianza: 92,
    campos: { proveedor: 89, ruc: 100, monto: 95, fecha: 92 },
    origen: 'SUNAT'
  },
  {
    id: 'TEMP-2025-003',
    proveedor: 'Consultora Business Pro SAC',
    ruc: '20123987456',
    fecha: '2025-10-18',
    monto: 8900.00,
    impuesto: 1602.00,
    total: 10502.00,
    confianza: 87,
    campos: { proveedor: 82, ruc: 100, monto: 88, fecha: 90 },
    origen: 'Email'
  }
]

// Analytics data
const analyticsData = {
  procesadasHoy: 23,
  tasaAutomatizacion: 94,
  tiempoPromedio: 8,
  errorRate: 2.3,
  facturasPorMes: [
    { mes: 'May', cantidad: 98 },
    { mes: 'Jun', cantidad: 112 },
    { mes: 'Jul', cantidad: 134 },
    { mes: 'Ago', cantidad: 145 },
    { mes: 'Sep', cantidad: 156 },
    { mes: 'Oct', cantidad: 156 }
  ],
  topProveedores: [
    { nombre: 'Distribuidora ABC', cantidad: 45, monto: 125000 },
    { nombre: 'Servicios XYZ', cantidad: 38, monto: 98000 },
    { nombre: 'Logística Express', cantidad: 32, monto: 87000 }
  ]
}

export default function FacturasRegistradasPage() {
  const [activeTab, setActiveTab] = useState<'validacion' | 'edicion' | 'bd' | 'agente' | 'analytics'>('validacion')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEstado, setSelectedEstado] = useState('Todas')
  const [selectedCategoria, setSelectedCategoria] = useState('Todas')
  const [selectedFacturas, setSelectedFacturas] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedData, setEditedData] = useState<any>({})
  const [facturasPendientes, setFacturasPendientes] = useState(mockFacturasPendientes)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar facturas pendientes desde la API
  useEffect(() => {
    fetchFacturasPendientes()
  }, [])

  const fetchFacturasPendientes = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/facturas-pendientes')
      const result = await response.json()

      if (result.success) {
        setFacturasPendientes(result.data)
      } else {
        setError(result.error || 'Error al cargar facturas')
        console.error('Error:', result.error)
      }facturasPendientes.length
    } catch (err) {
      setError('Error de conexión con el servidor')
      console.error('Error fetching facturas:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const toggleFacturaSelection = (id: string) => {
    setSelectedFacturas(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }
  
  const toggleSelectAll = () => {
    if (selectedFacturas.length === facturasPendientes.length) {
      setSelectedFacturas([])
    } else {
      setSelectedFacturas(facturasPendientes.map(f => f.id))
    }
  }
  
  const startEditing = (factura: any) => {
    setEditingId(factura.id)
    setEditedData({
      proveedor: factura.proveedor,
      ruc: factura.ruc,
      fecha: factura.fecha,
      monto: factura.monto,
      impuesto: factura.impuesto
    })
  }
  
  const saveEdits = (id: string) => {
    // Actualizar la data localmente
    setFacturasPendientes(prev => 
      prev.map(f => 
        f.id === id 
          ? { 
              ...f, 
              proveedor: editedData.proveedor,
              ruc: editedData.ruc,
              fecha: editedData.fecha,
              monto: editedData.monto,
              impuesto: editedData.impuesto,
              total: editedData.monto + editedData.impuesto
            }
          : f
      )
    )
    setEditingId(null)
    setEditedData({})
  }
  
  const cancelEditing = () => {
    setEditingId(null)
    setEditedData({})
  }
  
  const enviarFactura = async (id: string) => {
    try {
      const response = await fetch('/api/facturas-pendientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ facturaIds: [id] })
      })

      const result = await response.json()

      if (result.success) {
        // Remover de pendientes
        setFacturasPendientes(prev => prev.filter(f => f.id !== id))

        // Remover de seleccionadas si estaba seleccionada
        setSelectedFacturas(prev => prev.filter(fId => fId !== id))

        console.log('Factura enviada exitosamente:', id)
      } else {
        console.error('Error al enviar factura:', result.error)
        alert('Error al aprobar la factura: ' + result.error)
      }
    } catch (err) {
      console.error('Error enviando factura:', err)
      alert('Error de conexión al aprobar la factura')
    }
  }
  
  const enviarSeleccionadas = async () => {
    try {
      const response = await fetch('/api/facturas-pendientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ facturaIds: selectedFacturas })
      })

      const result = await response.json()

      if (result.success) {
        // Remover todas las seleccionadas de pendientes
        setFacturasPendientes(prev =>
          prev.filter(f => !selectedFacturas.includes(f.id))
        )

        // Limpiar selección
        setSelectedFacturas([])

        console.log('Facturas enviadas exitosamente:', result.approvedIds)
      } else {
        console.error('Error al enviar facturas:', result.error)
        alert('Error al aprobar las facturas: ' + result.error)
      }
    } catch (err) {
      console.error('Error enviando facturas:', err)
      alert('Error de conexión al aprobar las facturas')
    }
  }

  const filteredFacturas = mockFacturas.filter(factura => {
    const matchSearch = factura.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       factura.ruc.includes(searchTerm)
    const matchEstado = selectedEstado === 'Todas' || factura.estado === selectedEstado
    const matchCategoria = selectedCategoria === 'Todas' || factura.categoria === selectedCategoria
    return matchSearch && matchEstado && matchCategoria
  })

  const getEstadoBadge = (estado: string) => {
    const badges: { [key: string]: { bg: string, text: string, icon: any } } = {
      'Registrada': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: CheckCircle },
      'Procesando': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: Clock },
      'Pendiente': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: AlertCircle }
    }
    const badge = badges[estado] || badges['Pendiente']
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3.5 h-3.5" />
        {estado}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Header */}
      <header className="bg-white dark:bg-[#252525] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/apps" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Volver a Apps</span>
            </Link>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div>
              <h1 className="text-lg font-semibold">Facturas Registradas</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Última actualización: 19/10/2025</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block w-64 bg-gray-50 dark:bg-neutral-800 border-r border-gray-200 dark:border-gray-700 min-h-screen transition-colors duration-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileBarChart className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold">Cliente Demo</span>
            </div>

            {/* Navigation */}
            <nav className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">PROCESAMIENTO</p>
                <div className="space-y-1">
                  <button 
                    onClick={() => setActiveTab('validacion')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'validacion' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CheckSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">Pendientes de Validación</span>
                    </div>
                    {facturasPendientes.length > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {facturasPendientes.length}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => setActiveTab('edicion')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'edicion' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Edición de Facturas</span>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">CONSULTA</p>
                <div className="space-y-1">
                  <button 
                    onClick={() => setActiveTab('bd')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'bd' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Database className="w-4 h-4" />
                    <span className="text-sm font-medium">Base de Datos</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('agente')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'agente' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    <span className="text-sm font-medium">Agente IA</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'analytics' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Dashboard y Analíticas</span>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">CONFIGURACIÓN</p>
                <div className="space-y-1">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors text-left">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Ajustes</span>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 w-full overflow-x-hidden">
          
          {/* VALIDACIÓN DE FACTURAS */}
          {activeTab === 'validacion' && (
            <div>
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Pendientes de Validación</h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Facturas procesadas por IA que requieren tu revisión</p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando facturas...</span>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <div>
                      <h3 className="font-semibold text-red-900 dark:text-red-100">Error al cargar facturas</h3>
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  </div>
                  <button
                    onClick={fetchFacturasPendientes}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {!loading && !error && (
                <>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</span>
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{facturasPendientes.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Requieren atención</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto Pendiente</span>
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    S/ {facturasPendientes.reduce((acc, f) => acc + f.total, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Por validar</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Procesadas Hoy</span>
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.procesadasHoy}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Automático</p>
                </motion.div>
              </div>

              {/* Acciones masivas */}
              {selectedFacturas.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-blue-900 dark:text-blue-100">
                        {selectedFacturas.length} factura{selectedFacturas.length > 1 ? 's' : ''} seleccionada{selectedFacturas.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={enviarSeleccionadas}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                      >
                        <Send className="w-4 h-4" />
                        Enviar Seleccionadas
                      </button>
                      <button 
                        onClick={() => setSelectedFacturas([])}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tabla de facturas pendientes */}
              <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedFacturas.length === mockFacturasPendientes.length}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Proveedor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          RUC
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Subtotal
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          IGV
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Origen
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Estado CPE
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Estado RUC
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Acciones
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Enviar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {facturasPendientes.map((factura, index) => (
                        <motion.tr
                          key={factura.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className={`hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors ${
                            selectedFacturas.includes(factura.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedFacturas.includes(factura.id)}
                              onChange={() => toggleFacturaSelection(factura.id)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                          </td>
                          <td className="px-6 py-4">
                            {editingId === factura.id ? (
                              <input
                                type="text"
                                value={editedData.proveedor}
                                onChange={(e) => setEditedData({...editedData, proveedor: e.target.value})}
                                className="w-full px-2 py-1 text-sm font-semibold text-gray-900 dark:text-white bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              />
                            ) : (
                              <div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">{factura.proveedor}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{factura.id}</div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingId === factura.id ? (
                              <input
                                type="text"
                                value={editedData.ruc}
                                onChange={(e) => setEditedData({...editedData, ruc: e.target.value})}
                                className="w-full px-2 py-1 text-sm text-gray-900 dark:text-white font-mono bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              />
                            ) : (
                              <div className="text-sm text-gray-900 dark:text-white font-mono">{factura.ruc}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingId === factura.id ? (
                              <input
                                type="date"
                                value={editedData.fecha}
                                onChange={(e) => setEditedData({...editedData, fecha: e.target.value})}
                                className="w-full px-2 py-1 text-sm text-gray-900 dark:text-white bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              />
                            ) : (
                              <div className="text-sm text-gray-900 dark:text-white">{factura.fecha}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {editingId === factura.id ? (
                              <input
                                type="number"
                                step="0.01"
                                value={editedData.monto}
                                onChange={(e) => setEditedData({...editedData, monto: parseFloat(e.target.value)})}
                                className="w-full px-2 py-1 text-sm font-medium text-gray-900 dark:text-white text-right bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              />
                            ) : (
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                S/ {factura.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {editingId === factura.id ? (
                              <input
                                type="number"
                                step="0.01"
                                value={editedData.impuesto}
                                onChange={(e) => setEditedData({...editedData, impuesto: parseFloat(e.target.value)})}
                                className="w-full px-2 py-1 text-sm font-medium text-gray-900 dark:text-white text-right bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              />
                            ) : (
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                S/ {factura.impuesto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-base font-bold text-gray-900 dark:text-white">
                              S/ {editingId === factura.id 
                                ? (editedData.monto + editedData.impuesto).toLocaleString('es-PE', { minimumFractionDigits: 2 })
                                : factura.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })
                              }
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                              {factura.origen}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                              (factura as any).estadoSunat === 'VALIDO'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : (factura as any).estadoSunat === 'INVALIDO'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}>
                              {(factura as any).estadoSunat || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                              (factura as any).estadoRuc === 'ACTIVO'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : (factura as any).estadoRuc === 'INACTIVO' || (factura as any).estadoRuc === 'SUSPENDIDO'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}>
                              {(factura as any).estadoRuc || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {editingId === factura.id ? (
                                <>
                                  <button 
                                    onClick={() => saveEdits(factura.id)}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" 
                                    title="Guardar cambios"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={cancelEditing}
                                    className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors" 
                                    title="Cancelar"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    onClick={() => startEditing(factura)}
                                    className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors" 
                                    title="Editar"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Ver detalles">
                                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center">
                              <button 
                                onClick={() => enviarFactura(factura.id)}
                                disabled={editingId === factura.id}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm"
                                title="Enviar a BD"
                              >
                                <Send className="w-4 h-4" />
                                Enviar
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </>
              )}
            </div>
          )}

          {/* EDICIÓN DE FACTURAS */}
          {activeTab === 'edicion' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Edición de Facturas</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Corrige y ajusta datos de facturas procesadas</p>
              </div>

              <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl p-8">
                <div className="text-center py-12">
                  <Edit3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Editor de Facturas</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Selecciona una factura desde "Pendientes de Validación" para editarla aquí
                  </p>
                  <button 
                    onClick={() => setActiveTab('validacion')}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Ir a Pendientes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BASE DE DATOS */}
          {activeTab === 'bd' && (
            <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Facturas</span>
                <FileText className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockStats.totalFacturas}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Histórico completo</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Este Mes</span>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockStats.facturasEsteMes}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12% vs mes anterior</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto Total</span>
                <FileBarChart className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">S/ {mockStats.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Todos los tiempos</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto Este Mes</span>
                <CheckCircle className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">S/ {mockStats.montoEsteMes.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8% vs mes anterior</p>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Proveedor, RUC o número..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  value={selectedEstado}
                  onChange={(e) => setSelectedEstado(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Todas</option>
                  <option>Registrada</option>
                  <option>Procesando</option>
                  <option>Pendiente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoría
                </label>
                <select
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Todas</option>
                  <option>Mercadería</option>
                  <option>Servicios</option>
                  <option>Transporte</option>
                  <option>Suministros</option>
                  <option>Marketing</option>
                  <option>Consultoría</option>
                  <option>Mantenimiento</option>
                  <option>Alquiler</option>
                </select>
              </div>
            </div>
          </div>

          {/* Facturas Table */}
          <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Factura</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Proveedor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredFacturas.map((factura, index) => (
                    <motion.tr
                      key={factura.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-indigo-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{factura.id}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{factura.ruc}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">{factura.proveedor}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{factura.formaPago}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{factura.fecha}</div>
                        {factura.fechaVencimiento !== '-' && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">Vence: {factura.fechaVencimiento}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {factura.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          S/ {factura.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          + S/ {factura.impuesto.toLocaleString('es-PE', { minimumFractionDigits: 2 })} IGV
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          S/ {factura.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getEstadoBadge(factura.estado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 dark:bg-neutral-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando <span className="font-medium">{filteredFacturas.length}</span> de <span className="font-medium">{mockFacturas.length}</span> facturas
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-white dark:bg-neutral-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-600 transition-colors">
                  Anterior
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  1
                </button>
                <button className="px-3 py-1 text-sm bg-white dark:bg-neutral-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-600 transition-colors">
                  2
                </button>
                <button className="px-3 py-1 text-sm bg-white dark:bg-neutral-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-600 transition-colors">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
            </div>
          )}

          {/* AGENTE IA */}
          {activeTab === 'agente' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Agente IA</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Consulta tus facturas en lenguaje natural</p>
              </div>

              <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl h-[600px] flex flex-col">
                {/* Chat messages */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-900 dark:text-white">
                          ¡Hola! Soy tu asistente de facturas. Puedo ayudarte con consultas como:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <li>• "¿Cuántas facturas tengo pendientes?"</li>
                          <li>• "¿Cuál es el monto total de facturas de octubre?"</li>
                          <li>• "Muéstrame las facturas del proveedor ABC"</li>
                          <li>• "¿Qué facturas vencen esta semana?"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input area */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe tu pregunta..."
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD Y ANALÍTICAS */}
          {activeTab === 'analytics' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard y Analíticas</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Visualiza tendencias y patrones</p>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Procesadas Hoy</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.procesadasHoy}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">+15% vs ayer</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasa Automatización</span>
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.tasaAutomatizacion}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Procesamiento IA</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tiempo Promedio</span>
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.tiempoPromedio} min</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Por factura</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasa de Errores</span>
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.errorRate}%</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">-0.5% vs mes anterior</p>
                </motion.div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Facturas por mes */}
                <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Facturas Procesadas por Mes
                  </h3>
                  <div className="space-y-3">
                    {analyticsData.facturasPorMes.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">{item.mes}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{item.cantidad} facturas</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600"
                            style={{ width: `${(item.cantidad / 160) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top proveedores */}
                <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Top Proveedores
                  </h3>
                  <div className="space-y-4">
                    {analyticsData.topProveedores.map((prov, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{prov.nombre}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{prov.cantidad} facturas</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            S/ {prov.monto.toLocaleString('es-PE')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
