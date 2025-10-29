'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import QuickSightEmbed from '@/components/QuickSightEmbed'
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
  Eye,
  MoreVertical,
  Database,
  Bot,
  Edit3,
  CheckSquare,
  Send,
  TrendingUp,
  X,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  User,
  BarChart3,
  Loader2
} from 'lucide-react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'



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

// Analytics data - Ya no se usa, ahora usamos QuickSight
// const analyticsData = {
//   procesadasHoy: 23,
//   tasaAutomatizacion: 94,
//   tiempoPromedio: 8,
//   errorRate: 2.3,
//   facturasPorMes: [
//     { mes: 'May', cantidad: 98 },
//     { mes: 'Jun', cantidad: 112 },
//     { mes: 'Jul', cantidad: 134 },
//     { mes: 'Ago', cantidad: 145 },
//     { mes: 'Sep', cantidad: 156 },
//     { mes: 'Oct', cantidad: 156 }
//   ],
//   topProveedores: [
//     { nombre: 'Distribuidora ABC', cantidad: 45, monto: 125000 },
//     { nombre: 'Servicios XYZ', cantidad: 38, monto: 98000 },
//     { nombre: 'Logística Express', cantidad: 32, monto: 87000 }
//   ]
// }

export default function FacturasRegistradasPage() {
  const [activeTab, setActiveTab] = useState<'validacion' | 'edicion' | 'bd' | 'agente' | 'analytics'>('validacion')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState('Todas')
  const [selectedFacturas, setSelectedFacturas] = useState<string[]>([])
  const [selectedFacturasAprobadas, setSelectedFacturasAprobadas] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedData, setEditedData] = useState<any>({})
  const [facturasPendientes, setFacturasPendientes] = useState(mockFacturasPendientes)
  const [facturasAprobadas, setFacturasAprobadas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingAprobadas, setLoadingAprobadas] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorAprobadas, setErrorAprobadas] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [stats, setStats] = useState({
    pendientes: 0,
    montoPendientePen: 0,
    montoPendienteUsd: 0,
    procesadasHoy: 0
  })
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [selectedFacturaDetalle, setSelectedFacturaDetalle] = useState<any>(null)
  const [loadingDetalle, setLoadingDetalle] = useState(false)
  const [pdfSignedUrl, setPdfSignedUrl] = useState<string | null>(null)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [pdfSectionExpanded, setPdfSectionExpanded] = useState(true)

  // Estados para el chat
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: Date}>>([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de facturas. Puedo ayudarte con consultas como:\n\n• "¿Cuántas facturas tengo pendientes?"\n• "¿Cuál es el monto total de facturas de octubre?"\n• "Muéstrame las facturas del proveedor ABC"\n• "¿Qué facturas vencen esta semana?"',
      timestamp: new Date()
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  // Función para calcular tiempo relativo desde/hasta la fecha de vencimiento
  const getRelativeTime = (fechaVencimiento: string | null) => {
    if (!fechaVencimiento) return { text: 'Sin vencimiento', color: 'text-gray-500 dark:text-gray-400' }

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const fecha = new Date(fechaVencimiento)
    fecha.setHours(0, 0, 0, 0)

    const diffTime = fecha.getTime() - hoy.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      const diasPasados = Math.abs(diffDays)
      return {
        text: `Hace ${diasPasados} día${diasPasados !== 1 ? 's' : ''}`,
        color: 'text-red-600 dark:text-red-400'
      }
    } else if (diffDays === 0) {
      return {
        text: 'Vence hoy',
        color: 'text-orange-600 dark:text-orange-400'
      }
    } else {
      return {
        text: `En ${diffDays} día${diffDays !== 1 ? 's' : ''}`,
        color: 'text-gray-700 dark:text-gray-300'
      }
    }
  }

  // Funciones de selección para facturas aprobadas
  const toggleFacturaAprobadaSelection = (id: string) => {
    setSelectedFacturasAprobadas(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const toggleSelectAllAprobadas = (facturasVisibles: any[]) => {
    const idsVisibles = facturasVisibles.map(f => f.id)
    if (selectedFacturasAprobadas.length === idsVisibles.length &&
        idsVisibles.every(id => selectedFacturasAprobadas.includes(id))) {
      setSelectedFacturasAprobadas([])
    } else {
      setSelectedFacturasAprobadas(idsVisibles)
    }
  }

  const getFacturasParaExportar = () => {
    if (selectedFacturasAprobadas.length === 0) {
      // Si no hay selección, exportar todas las visibles (filtradas)
      return facturasAprobadas.filter(factura => {
        const matchSearch = factura.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           factura.ruc.includes(searchTerm)
        const matchMoneda = selectedCategoria === 'Todas' || factura.moneda === selectedCategoria || (!factura.moneda && selectedCategoria === 'PEN')
        return matchSearch && matchMoneda
      })
    } else {
      // Exportar solo las seleccionadas
      return facturasAprobadas.filter(f => selectedFacturasAprobadas.includes(f.id))
    }
  }

  // Funciones de exportación
  const exportToCSV = (facturas: any[]) => {
    const csvData = facturas.map(f => ({
      'Proveedor': f.proveedor,
      'RUC': f.ruc,
      'Número Factura': f.id,
      'Fecha': f.fecha,
      'Estado Pago': getRelativeTime(f.fechaVencimiento).text,
      'Subtotal': f.monto,
      'IGV': f.impuesto,
      'Total': f.total,
      'Moneda': f.moneda || 'PEN',
      'Estado CPE': f.estadoSunat || 'N/A',
      'Estado RUC': f.estadoRuc || 'N/A'
    }))

    const headers = Object.keys(csvData[0])
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(h => `"${row[h as keyof typeof row]}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `facturas_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const exportToExcel = (facturas: any[]) => {
    const excelData = facturas.map(f => ({
      'Proveedor': f.proveedor,
      'RUC': f.ruc,
      'Número Factura': f.id,
      'Fecha': f.fecha,
      'Estado de Pago': getRelativeTime(f.fechaVencimiento).text,
      'Subtotal': f.monto,
      'IGV': f.impuesto,
      'Total': f.total,
      'Moneda': f.moneda || 'PEN',
      'Estado CPE': f.estadoSunat || 'N/A',
      'Estado RUC': f.estadoRuc || 'N/A'
    }))

    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Facturas')

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 40 }, // Proveedor
      { wch: 15 }, // RUC
      { wch: 25 }, // Número
      { wch: 12 }, // Fecha
      { wch: 18 }, // Estado Pago
      { wch: 12 }, // Subtotal
      { wch: 12 }, // IGV
      { wch: 12 }, // Total
      { wch: 10 }, // Moneda
      { wch: 12 }, // Estado CPE
      { wch: 12 }  // Estado RUC
    ]
    ws['!cols'] = colWidths

    XLSX.writeFile(wb, `facturas_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportToPDF = (facturas: any[]) => {
    const doc = new jsPDF('landscape')

    // Título
    doc.setFontSize(16)
    doc.text('Facturas Registradas', 14, 15)
    doc.setFontSize(10)
    doc.text(`Generado: ${new Date().toLocaleString('es-PE')}`, 14, 22)

    // Tabla
    const tableData = facturas.map(f => [
      f.proveedor,
      f.ruc,
      f.id,
      f.fecha,
      getRelativeTime(f.fechaVencimiento).text,
      `${f.moneda === 'USD' ? '$' : 'S/'} ${f.monto.toFixed(2)}`,
      `${f.moneda === 'USD' ? '$' : 'S/'} ${f.impuesto.toFixed(2)}`,
      `${f.moneda === 'USD' ? '$' : 'S/'} ${f.total.toFixed(2)}`,
      f.estadoSunat || 'N/A',
      f.estadoRuc || 'N/A'
    ])

    autoTable(doc, {
      head: [['Proveedor', 'RUC', 'Número', 'Fecha', 'Estado Pago', 'Subtotal', 'IGV', 'Total', 'CPE', 'RUC']],
      body: tableData,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] }
    })

    doc.save(`facturas_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Cargar facturas pendientes y estadísticas desde la API
  useEffect(() => {
    fetchFacturasPendientes()
    fetchStats()
  }, [])

  // Cargar facturas aprobadas cuando se selecciona la pestaña BD
  useEffect(() => {
    if (activeTab === 'bd') {
      fetchFacturasAprobadas()
    }
  }, [activeTab])

  // Resetear a la primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategoria])

  // Cerrar menú de exportación al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showExportMenu && !target.closest('.export-menu-container')) {
        setShowExportMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showExportMenu])

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
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
      console.error('Error fetching facturas:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/facturas-stats')
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const fetchFacturasAprobadas = async () => {
    try {
      setLoadingAprobadas(true)
      setErrorAprobadas(null)

      const response = await fetch('/api/facturas-aprobadas')
      const result = await response.json()

      if (result.success) {
        setFacturasAprobadas(result.data)
      } else {
        setErrorAprobadas(result.error || 'Error al cargar facturas aprobadas')
        console.error('Error:', result.error)
      }
    } catch (err) {
      setErrorAprobadas('Error de conexión con el servidor')
      console.error('Error fetching facturas aprobadas:', err)
    } finally {
      setLoadingAprobadas(false)
    }
  }

  const verDetalleFactura = async (invoiceId: string) => {
    try {
      setLoadingDetalle(true)
      setShowDetalleModal(true)
      setPdfSignedUrl(null)

      const response = await fetch(`/api/factura-detalle?id=${encodeURIComponent(invoiceId)}`)
      const result = await response.json()

      if (result.success) {
        setSelectedFacturaDetalle(result.data)

        // Si hay s3_url, obtener la URL firmada
        if (result.data.factura.s3_url) {
          setLoadingPdf(true)
          try {
            const pdfResponse = await fetch('/api/get-pdf-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ s3Url: result.data.factura.s3_url })
            })
            const pdfResult = await pdfResponse.json()

            if (pdfResult.success) {
              setPdfSignedUrl(pdfResult.url)
            }
          } catch (pdfErr) {
            console.error('Error obteniendo URL del PDF:', pdfErr)
          } finally {
            setLoadingPdf(false)
          }
        }
      } else {
        console.error('Error al cargar detalle:', result.error)
        alert('Error al cargar el detalle de la factura')
        setShowDetalleModal(false)
      }
    } catch (err) {
      console.error('Error fetching detalle:', err)
      alert('Error de conexión al cargar el detalle')
      setShowDetalleModal(false)
    } finally {
      setLoadingDetalle(false)
    }
  }

  const cerrarDetalleModal = () => {
    setShowDetalleModal(false)
    setSelectedFacturaDetalle(null)
    setPdfSignedUrl(null)
  }

  // Función para enviar mensaje del chat
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!chatInput.trim() || chatLoading) return

    const messageToSend = chatInput.trim()

    const userMessage = {
      role: 'user' as const,
      content: messageToSend,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setChatLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend })
      })

      const result = await response.json()

      if (result.success) {
        const assistantMessage = {
          role: 'assistant' as const,
          content: result.response,
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, assistantMessage])
      } else {
        const errorMessage = {
          role: 'assistant' as const,
          content: 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo.',
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        role: 'assistant' as const,
        content: 'Error de conexión. Por favor, verifica tu conexión e intenta de nuevo.',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setChatLoading(false)
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
    // Buscar la factura para mostrar sus detalles
    const factura = facturasPendientes.find(f => f.id === id)
    if (!factura) return

    // Determinar símbolo de moneda
    const moneda = (factura as any).moneda || 'PEN'
    const simbolo = moneda === 'USD' ? '$' : 'S/'
    const locale = moneda === 'USD' ? 'en-US' : 'es-PE'

    // Mostrar confirmación
    const confirmar = window.confirm(
      `¿Estás seguro que deseas aprobar esta factura?\n\n` +
      `Proveedor: ${factura.proveedor}\n` +
      `RUC: ${factura.ruc}\n` +
      `Total: ${simbolo} ${factura.total.toLocaleString(locale, { minimumFractionDigits: 2 })}\n\n` +
      `Esta acción marcará la factura como aprobada.`
    )

    if (!confirmar) return

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

        // Actualizar estadísticas
        fetchStats()

        // Mostrar mensaje de éxito
        alert('✅ Factura aprobada exitosamente')
        console.log('Factura enviada exitosamente:', id)
      } else {
        console.error('Error al enviar factura:', result.error)
        alert('❌ Error al aprobar la factura: ' + result.error)
      }
    } catch (err) {
      console.error('Error enviando factura:', err)
      alert('❌ Error de conexión al aprobar la factura')
    }
  }
  
  const enviarSeleccionadas = async () => {
    if (selectedFacturas.length === 0) {
      alert('⚠️ Por favor selecciona al menos una factura')
      return
    }

    // Calcular totales por moneda
    const facturasAEnviar = facturasPendientes.filter(f => selectedFacturas.includes(f.id))
    const totalPen = facturasAEnviar
      .filter(f => (f as any).moneda === 'PEN' || !(f as any).moneda)
      .reduce((acc, f) => acc + f.total, 0)
    const totalUsd = facturasAEnviar
      .filter(f => (f as any).moneda === 'USD')
      .reduce((acc, f) => acc + f.total, 0)

    let mensaje = `¿Estás seguro que deseas aprobar ${selectedFacturas.length} factura(s)?\n\n`
    if (totalPen > 0) {
      mensaje += `Total en soles: S/ ${totalPen.toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n`
    }
    if (totalUsd > 0) {
      mensaje += `Total en dólares: $ ${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n`
    }
    mensaje += `\nEsta acción marcará las facturas como aprobadas.`

    // Mostrar confirmación
    const confirmar = window.confirm(mensaje)

    if (!confirmar) return

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

        // Actualizar estadísticas
        fetchStats()

        // Mostrar mensaje de éxito
        alert(`✅ ${result.approvedIds?.length || selectedFacturas.length} factura(s) aprobada(s) exitosamente`)
        console.log('Facturas enviadas exitosamente:', result.approvedIds)
      } else {
        console.error('Error al enviar facturas:', result.error)
        alert('❌ Error al aprobar las facturas: ' + result.error)
      }
    } catch (err) {
      console.error('Error enviando facturas:', err)
      alert('❌ Error de conexión al aprobar las facturas')
    }
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</span>
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendientes}</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    S/ {stats.montoPendientePen.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Por validar</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto Pendiente</span>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    $ {stats.montoPendienteUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.procesadasHoy}</p>
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
                                {(factura as any).moneda === 'USD' ? '$' : 'S/'} {factura.monto.toLocaleString((factura as any).moneda === 'USD' ? 'en-US' : 'es-PE', { minimumFractionDigits: 2 })}
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
                                {(factura as any).moneda === 'USD' ? '$' : 'S/'} {factura.impuesto.toLocaleString((factura as any).moneda === 'USD' ? 'en-US' : 'es-PE', { minimumFractionDigits: 2 })}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-base font-bold text-gray-900 dark:text-white">
                              {(factura as any).moneda === 'USD' ? '$' : 'S/'} {editingId === factura.id
                                ? (editedData.monto + editedData.impuesto).toLocaleString((factura as any).moneda === 'USD' ? 'en-US' : 'es-PE', { minimumFractionDigits: 2 })
                                : factura.total.toLocaleString((factura as any).moneda === 'USD' ? 'en-US' : 'es-PE', { minimumFractionDigits: 2 })
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
                                  <button
                                    onClick={() => verDetalleFactura(factura.id)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Ver detalles"
                                  >
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
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Facturas Registradas</h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Todas las facturas aprobadas y registradas en el sistema</p>
              </div>

              {/* Loading State */}
              {loadingAprobadas && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando facturas...</span>
                </div>
              )}

              {/* Error State */}
              {errorAprobadas && !loadingAprobadas && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <div>
                      <h3 className="font-semibold text-red-900 dark:text-red-100">Error al cargar facturas</h3>
                      <p className="text-sm text-red-700 dark:text-red-300">{errorAprobadas}</p>
                    </div>
                  </div>
                  <button
                    onClick={fetchFacturasAprobadas}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {!loadingAprobadas && !errorAprobadas && (
                <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Facturas</span>
                <FileText className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{facturasAprobadas.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aprobadas</p>
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
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {facturasAprobadas.filter(f => {
                  const fecha = new Date(f.fecha)
                  const hoy = new Date()
                  return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear()
                }).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Facturas aprobadas</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                S/ {facturasAprobadas.filter(f => f.moneda === 'PEN' || !f.moneda).reduce((acc, f) => acc + f.total, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Soles</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-[#252525] dark:to-[#252525] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto Total</span>
                <CheckCircle className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                $ {facturasAprobadas.filter(f => f.moneda === 'USD').reduce((acc, f) => acc + f.total, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Dólares</p>
            </motion.div>
          </div>

          {/* Filters and Export */}
          <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  Moneda
                </label>
                <select
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Todas</option>
                  <option>PEN</option>
                  <option>USD</option>
                </select>
              </div>
            </div>

            {/* Export Dropdown */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 items-center">
              {selectedFacturasAprobadas.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {selectedFacturasAprobadas.length} seleccionada{selectedFacturasAprobadas.length > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => setSelectedFacturasAprobadas([])}
                    className="ml-1 p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded transition-colors"
                  >
                    <X className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </button>
                </div>
              )}

              <div className="relative export-menu-container">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Exportar {selectedFacturasAprobadas.length > 0 ? 'Seleccionadas' : 'Todo'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showExportMenu && (
                  <div className="absolute z-50 mt-2 w-48 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <button
                      onClick={() => {
                        exportToExcel(getFacturasParaExportar())
                        setShowExportMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors text-left text-sm"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      <span>Excel (.xlsx)</span>
                    </button>
                    <button
                      onClick={() => {
                        exportToCSV(getFacturasParaExportar())
                        setShowExportMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors text-left text-sm"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                      <span>CSV (.csv)</span>
                    </button>
                    <button
                      onClick={() => {
                        exportToPDF(getFacturasParaExportar())
                        setShowExportMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors text-left text-sm rounded-b-lg"
                    >
                      <FileText className="w-4 h-4 text-red-600" />
                      <span>PDF (.pdf)</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1"></div>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedFacturasAprobadas.length > 0
                  ? `${selectedFacturasAprobadas.length} de ${facturasAprobadas.length}`
                  : `${getFacturasParaExportar().length} facturas`
                }
              </span>
            </div>
          </div>

          {/* Facturas Table */}
          <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left">
                      <input
                        type="checkbox"
                        checked={(() => {
                          const facturasVisibles = facturasAprobadas.filter(factura => {
                            const matchSearch = factura.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                               factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                               factura.ruc.includes(searchTerm)
                            const matchMoneda = selectedCategoria === 'Todas' || factura.moneda === selectedCategoria || (!factura.moneda && selectedCategoria === 'PEN')
                            return matchSearch && matchMoneda
                          })
                          const idsVisibles = facturasVisibles.map(f => f.id)
                          return idsVisibles.length > 0 && idsVisibles.every(id => selectedFacturasAprobadas.includes(id))
                        })()}
                        onChange={() => {
                          const facturasVisibles = facturasAprobadas.filter(factura => {
                            const matchSearch = factura.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                               factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                               factura.ruc.includes(searchTerm)
                            const matchMoneda = selectedCategoria === 'Todas' || factura.moneda === selectedCategoria || (!factura.moneda && selectedCategoria === 'PEN')
                            return matchSearch && matchMoneda
                          })
                          toggleSelectAllAprobadas(facturasVisibles)
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      RUC
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Estado de Pago
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
                      Estado CPE
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Estado RUC
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {(() => {
                    // Filtrar facturas
                    const filteredFacturas = facturasAprobadas.filter(factura => {
                      const matchSearch = factura.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                         factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                         factura.ruc.includes(searchTerm)
                      const matchMoneda = selectedCategoria === 'Todas' || factura.moneda === selectedCategoria || (!factura.moneda && selectedCategoria === 'PEN')
                      return matchSearch && matchMoneda
                    })

                    // Calcular paginación
                    const indexOfLastItem = currentPage * itemsPerPage
                    const indexOfFirstItem = indexOfLastItem - itemsPerPage
                    const currentFacturas = filteredFacturas.slice(indexOfFirstItem, indexOfLastItem)

                    return currentFacturas.map((factura, index) => (
                    <motion.tr
                      key={factura.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors ${
                        selectedFacturasAprobadas.includes(factura.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedFacturasAprobadas.includes(factura.id)}
                          onChange={() => toggleFacturaAprobadaSelection(factura.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{factura.proveedor}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{factura.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white font-mono">{factura.ruc}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">{factura.fecha}</div>
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const relativeTime = getRelativeTime(factura.fechaVencimiento)
                          return (
                            <div className={`text-sm font-medium ${relativeTime.color}`}>
                              {relativeTime.text}
                            </div>
                          )
                        })()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {factura.moneda === 'USD' ? '$' : 'S/'} {factura.monto.toLocaleString(factura.moneda === 'USD' ? 'en-US' : 'es-PE', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {factura.moneda === 'USD' ? '$' : 'S/'} {factura.impuesto.toLocaleString(factura.moneda === 'USD' ? 'en-US' : 'es-PE', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-base font-bold text-gray-900 dark:text-white">
                          {factura.moneda === 'USD' ? '$' : 'S/'} {factura.total.toLocaleString(factura.moneda === 'USD' ? 'en-US' : 'es-PE', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          factura.estadoSunat === 'VALIDO'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : factura.estadoSunat === 'INVALIDO'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}>
                          {factura.estadoSunat || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          factura.estadoRuc === 'ACTIVO'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : factura.estadoRuc === 'INACTIVO' || factura.estadoRuc === 'SUSPENDIDO'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}>
                          {factura.estadoRuc || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => verDetalleFactura(factura.id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                    ))
                  })()}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {(() => {
              // Calcular información de paginación
              const filteredFacturas = facturasAprobadas.filter(factura => {
                const matchSearch = factura.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   factura.ruc.includes(searchTerm)
                const matchMoneda = selectedCategoria === 'Todas' || factura.moneda === selectedCategoria || (!factura.moneda && selectedCategoria === 'PEN')
                return matchSearch && matchMoneda
              })

              const totalPages = Math.ceil(filteredFacturas.length / itemsPerPage)
              const indexOfLastItem = currentPage * itemsPerPage
              const indexOfFirstItem = indexOfLastItem - itemsPerPage
              const currentCount = Math.min(indexOfLastItem, filteredFacturas.length)

              // Generar números de página a mostrar
              const getPageNumbers = () => {
                const pages = []
                const maxPagesToShow = 5

                if (totalPages <= maxPagesToShow) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i)
                  }
                } else {
                  if (currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) {
                      pages.push(i)
                    }
                    pages.push('...')
                    pages.push(totalPages)
                  } else if (currentPage >= totalPages - 2) {
                    pages.push(1)
                    pages.push('...')
                    for (let i = totalPages - 3; i <= totalPages; i++) {
                      pages.push(i)
                    }
                  } else {
                    pages.push(1)
                    pages.push('...')
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                      pages.push(i)
                    }
                    pages.push('...')
                    pages.push(totalPages)
                  }
                }

                return pages
              }

              return (
                <div className="bg-gray-50 dark:bg-neutral-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando <span className="font-medium">{filteredFacturas.length === 0 ? 0 : indexOfFirstItem + 1}</span> a <span className="font-medium">{currentCount}</span> de <span className="font-medium">{filteredFacturas.length}</span> facturas
                  </div>

                  {totalPages > 1 && (
                    <div className="flex gap-2 flex-wrap justify-center">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm bg-white dark:bg-neutral-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>

                      {getPageNumbers().map((pageNum, idx) => (
                        pageNum === '...' ? (
                          <span key={`ellipsis-${idx}`} className="px-3 py-1 text-sm text-gray-500">
                            ...
                          </span>
                        ) : (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum as number)}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-neutral-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-neutral-600'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm bg-white dark:bg-neutral-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
                </>
              )}
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
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'} rounded-lg p-4`}>
                          <p className={`whitespace-pre-wrap text-sm ${message.role === 'user' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                            {message.content}
                          </p>
                          <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                            {message.timestamp.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-8 h-8 bg-gray-300 dark:bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                          </div>
                        )}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input area */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <form onSubmit={handleChatSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Escribe tu pregunta..."
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || chatLoading}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      Enviar
                    </button>
                  </form>
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

              {/* QuickSight Embed */}
              <QuickSightEmbed
                dashboardUrl="https://us-east-1.quicksight.aws.amazon.com/sn/embed/share/accounts/886436955626/dashboards/0bcf94e1-d432-4d4d-a08a-fc5db87de97f?directory_alias=nathanvr98"
                title="QuickSight Dashboard - Facturas"
              />

              {/* Info Footer */}
              <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>
                  Dashboard powered by{' '}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">AWS QuickSight</span>
                  {' '}• Datos sincronizados con Aurora PostgreSQL
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal de Detalle de Factura */}
      {showDetalleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header del Modal */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Detalle de Factura
              </h2>
              <button
                onClick={cerrarDetalleModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              {loadingDetalle ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : selectedFacturaDetalle ? (
                <div className="space-y-6">
                  {/* Sección: Información de la Factura */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Información de la Factura
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Número de Factura</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {selectedFacturaDetalle.factura.numero_factura || selectedFacturaDetalle.factura.invoice_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tipo de Documento</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {selectedFacturaDetalle.factura.tipo_documento}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de Emisión</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {selectedFacturaDetalle.factura.fecha_emision}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de Vencimiento</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {selectedFacturaDetalle.factura.fecha_vencimiento || 'No especificada'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Moneda</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {selectedFacturaDetalle.factura.moneda}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Condición de Pago</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {selectedFacturaDetalle.factura.condicion_pago || 'No especificada'}
                        </p>
                      </div>
                      {selectedFacturaDetalle.factura.medio_pago && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Medio de Pago</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {selectedFacturaDetalle.factura.medio_pago}
                          </p>
                        </div>
                      )}
                      {selectedFacturaDetalle.factura.vendedor && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Vendedor</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {selectedFacturaDetalle.factura.vendedor}
                          </p>
                        </div>
                      )}
                      {selectedFacturaDetalle.factura.oc_asociada && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Orden de Compra</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {selectedFacturaDetalle.factura.oc_asociada}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sección: Información del Proveedor */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Información del Proveedor
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">RUC</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {selectedFacturaDetalle.proveedor.ruc}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Razón Social</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {selectedFacturaDetalle.proveedor.razon_social}
                        </p>
                      </div>
                      {selectedFacturaDetalle.proveedor.nombre_comercial && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Nombre Comercial</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {selectedFacturaDetalle.proveedor.nombre_comercial}
                          </p>
                        </div>
                      )}
                      {selectedFacturaDetalle.proveedor.direccion && (
                        <div className="md:col-span-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Dirección</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {selectedFacturaDetalle.proveedor.direccion}
                          </p>
                        </div>
                      )}
                      {(selectedFacturaDetalle.proveedor.distrito || selectedFacturaDetalle.proveedor.provincia || selectedFacturaDetalle.proveedor.departamento) && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Ubicación</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {[
                              selectedFacturaDetalle.proveedor.distrito,
                              selectedFacturaDetalle.proveedor.provincia,
                              selectedFacturaDetalle.proveedor.departamento
                            ].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      )}
                      {selectedFacturaDetalle.proveedor.telefono && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {selectedFacturaDetalle.proveedor.telefono}
                          </p>
                        </div>
                      )}
                      {selectedFacturaDetalle.proveedor.email && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {selectedFacturaDetalle.proveedor.email}
                          </p>
                        </div>
                      )}
                      {selectedFacturaDetalle.proveedor.estado_ruc && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Estado RUC</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {selectedFacturaDetalle.proveedor.estado_ruc}
                          </p>
                        </div>
                      )}
                      {selectedFacturaDetalle.proveedor.condicion_domicilio && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Condición Domicilio</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {selectedFacturaDetalle.proveedor.condicion_domicilio}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sección: Detalle de Productos/Items */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <List className="w-5 h-5" />
                      Detalle de Productos ({selectedFacturaDetalle.items.length} items)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-200 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Ítem</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Código</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Descripción</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Cantidad</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Unidad</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Valor Unit.</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">P. Unit.</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Descuento</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Subtotal</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">IGV</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {selectedFacturaDetalle.items.length > 0 ? (
                            selectedFacturaDetalle.items.map((item: any, index: number) => {
                              // Mapear valores desde la DB
                              const cantidad = parseFloat(item.cantidad || 0);
                              const valorUnitario = parseFloat(item.valor_unitario || 0); // precio SIN IGV
                              const precioUnitario = parseFloat(item.precio_unitario || 0); // precio CON IGV
                              const descuento = parseFloat(item.descuento || 0);
                              const subtotal = parseFloat(item.subtotal || item.valor_venta || 0); // valor antes de IGV
                              const igv = parseFloat(item.igv || 0);
                              const total = parseFloat(item.total || 0);

                              return (
                                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                  <td className="px-4 py-3 text-gray-900 dark:text-white">{item.numero_item}</td>
                                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.codigo_producto || '-'}</td>
                                  <td className="px-4 py-3 text-gray-900 dark:text-white max-w-xs">{item.descripcion}</td>
                                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{cantidad}</td>
                                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{item.unidad_medida}</td>
                                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                                    {selectedFacturaDetalle.factura.moneda === 'USD' ? '$' : 'S/'} {valorUnitario.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                                    {selectedFacturaDetalle.factura.moneda === 'USD' ? '$' : 'S/'} {precioUnitario.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                                    {selectedFacturaDetalle.factura.moneda === 'USD' ? '$' : 'S/'} {descuento.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                                    {selectedFacturaDetalle.factura.moneda === 'USD' ? '$' : 'S/'} {subtotal.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                                    {selectedFacturaDetalle.factura.moneda === 'USD' ? '$' : 'S/'} {igv.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                    {selectedFacturaDetalle.factura.moneda === 'USD' ? '$' : 'S/'} {total.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={11} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                No hay productos en esta factura
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Sección: Visualizador de PDF */}
                  {selectedFacturaDetalle.factura.s3_url && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                      <div
                        className="flex items-center justify-between mb-4 cursor-pointer"
                        onClick={() => setPdfSectionExpanded(!pdfSectionExpanded)}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          PDF Original
                        </h3>
                        <button
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title={pdfSectionExpanded ? "Colapsar" : "Expandir"}
                        >
                          {pdfSectionExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          )}
                        </button>
                      </div>
                      {pdfSectionExpanded && (
                        <>
                          {loadingPdf ? (
                            <div className="flex items-center justify-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                          ) : pdfSignedUrl ? (
                            <div className="relative w-full" style={{ height: '600px' }}>
                              <iframe
                                src={pdfSignedUrl}
                                className="w-full h-full border-0 rounded-lg"
                                title="PDF Viewer"
                              />
                              <a
                                href={pdfSignedUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                              >
                                <Download className="w-4 h-4" />
                                Descargar
                              </a>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
                              <FileText className="w-12 h-12 text-gray-400 mb-2" />
                              <p className="text-gray-600 dark:text-gray-400">No se pudo cargar el PDF</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Sección: Totales */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Totales</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedFacturaDetalle.factura.moneda === 'USD' ? '$' : 'S/'} {selectedFacturaDetalle.factura.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">IGV (18%):</span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedFacturaDetalle.factura.moneda === 'USD' ? '$' : 'S/'} {selectedFacturaDetalle.factura.igv.toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t-2 border-blue-200 dark:border-blue-700 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">Total:</span>
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {selectedFacturaDetalle.factura.moneda === 'USD' ? '$' : 'S/'} {selectedFacturaDetalle.factura.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón de cerrar al final */}
                  <div className="flex justify-end">
                    <button
                      onClick={cerrarDetalleModal}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
