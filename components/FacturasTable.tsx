'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Factura {
  id?: string;
  numero_factura: string;
  ruc_emisor: string;
  razon_social: string;
  direccion_emisor: string;
  fecha_emision: string;
  proveedor: string;
  codigo_producto: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  valor_venta: number;
  igv: number;
  importe_total: number;
  archivo_url?: string;
  created_at?: string;
};

interface FacturasStats {
  total: number;
  hoy: number;
  semana: number;
  mes: number;
  montoTotal: number;
}

interface FacturasData {
  success: boolean;
  facturas: Factura[];
  stats: FacturasStats;
  error?: string;
}

export default function FacturasTable() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<FacturasStats>({
    total: 0,
    hoy: 0,
    semana: 0,
    mes: 0,
    montoTotal: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [tableSize, setTableSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortField, setSortField] = useState<string>('fecha_emision');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const totalPages = Math.ceil(stats.total / itemsPerPage);

  const fetchFacturas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Construir parámetros de consulta
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        sortField,
        sortDirection
      })
      
      // Agregar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim()) {
          params.append(`filter_${key}`, value)
        }
      })
      
      const response = await fetch(`/api/facturas?${params}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data: FacturasData = await response.json()
      
      if (data.success) {
        setFacturas(data.facturas)
        setStats(data.stats)
      } else {
        throw new Error(data.error || 'Error desconocido al cargar facturas')
      }
    } catch (err) {
      console.error('Error fetching facturas:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setFacturas([])
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchFacturas()
  }, [currentPage, itemsPerPage, searchTerm, filters, sortField, sortDirection])

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [searchTerm, filters, itemsPerPage]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEstadoColor = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('procesada') || estadoLower.includes('aprobada') || estadoLower.includes('pagada')) {
      return 'bg-green-900/20 text-green-400';
    }
    if (estadoLower.includes('pendiente') || estadoLower.includes('revision')) {
      return 'bg-yellow-900/20 text-yellow-400';
    }
    if (estadoLower.includes('rechazada') || estadoLower.includes('error')) {
      return 'bg-red-900/20 text-red-400';
    }
    return 'bg-neutral-900/20 text-neutral-400';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-neutral-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-neutral-700 rounded w-20 mb-2"></div>
                <div className="h-8 bg-neutral-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Loading Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
            <div className="h-6 bg-neutral-700 rounded w-40 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-neutral-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-900/20 border border-red-800 rounded-2xl p-6 text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error de conexión</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <div className="bg-red-800/30 p-4 rounded-lg text-left max-w-md mx-auto">
            <p className="text-sm text-red-200 mb-2">Posibles soluciones:</p>
            <ul className="text-sm text-red-300 space-y-1">
              <li>• Verifica que Supabase esté configurado en .env.local</li>
              <li>• Confirma que la tabla 'facturas' existe</li>
              <li>• Revisa que las credenciales sean correctas</li>
            </ul>
          </div>
          <button 
            onClick={fetchFacturas}
            className="mt-4 bg-red-600 hover:bg-red-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-neutral-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Facturas Hoy</p>
              <p className="text-3xl font-bold text-green-400">{stats.hoy}</p>
            </div>
            <div className="bg-green-900/20 p-3 rounded-xl">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Total Mes</p>
              <span className="text-2xl font-bold">{stats.mes}</span>
            </div>
            <div className="bg-blue-900/20 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Monto Total</p>
              <p className="text-3xl font-bold text-yellow-400">{formatMoney(stats.montoTotal)}</p>
            </div>
            <div className="bg-yellow-900/20 p-3 rounded-xl">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Facturas Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-neutral-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 overflow-auto max-h-screen scrollbar-thick scrollbar-track-neutral-900 scrollbar-thumb-neutral-600 hover:scrollbar-thumb-neutral-500"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold">Facturas Registradas</h3>
            <p className="text-neutral-400 text-sm">Total: {stats.total} facturas</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={fetchFacturas}
              className="bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Controles Avanzados */}
        <div className="mb-6 space-y-4">
          {/* Búsqueda y Controles Principales */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar en todas las columnas..."
                className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Selector de Registros por Página */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Mostrar:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600 dark:text-gray-300">registros</span>
            </div>

            {/* Selector de Tamaño de Tabla */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Tamaño:</label>
              <div className="flex bg-neutral-800 rounded-lg border border-neutral-700">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setTableSize(size)}
                    className={`px-3 py-2 text-xs font-medium transition-colors ${
                      tableSize === size
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-neutral-700'
                    } ${size === 'small' ? 'rounded-l-lg' : size === 'large' ? 'rounded-r-lg' : ''}`}
                  >
                    {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filtros por Campo */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { key: 'numero_factura', label: 'N° Factura' },
              { key: 'ruc_emisor', label: 'RUC' },
              { key: 'razon_social', label: 'Razón Social' },
              { key: 'proveedor', label: 'Proveedor' },
              { key: 'codigo_producto', label: 'Código' },
              { key: 'descripcion', label: 'Descripción' }
            ].map((field) => (
              <div key={field.key} className="relative">
                <input
                  type="text"
                  placeholder={`Filtrar ${field.label}`}
                  className="w-full px-3 py-2 text-sm bg-neutral-800/50 border border-neutral-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  value={filters[field.key] || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, [field.key]: e.target.value }))}
                />
                {filters[field.key] && (
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, [field.key]: '' }))}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-gray-900 dark:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Limpiar Filtros */}
          {(Object.values(filters).some(v => v) || searchTerm) && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setFilters({})
                  setSearchTerm('')
                }}
                className="px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>

        {!facturas || facturas.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-neutral-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 className="text-lg font-semibold mb-2">No hay facturas</h4>
            <p className="text-neutral-400">Aún no se han procesado facturas desde n8n</p>
          </div>
        ) : (
          <div className={`
            border border-neutral-700 rounded-xl overflow-hidden
            ${tableSize === 'small' ? 'max-h-96' : tableSize === 'medium' ? 'max-h-[600px]' : 'max-h-[800px]'}
          `}>
            <div className="max-w-full">
              <table className={`
                w-full min-w-max
                ${tableSize === 'small' ? 'text-xs' : tableSize === 'medium' ? 'text-sm' : 'text-base'}
              `}>
               <thead className="bg-neutral-800 sticky top-0 z-10">
                <tr>
                  {[
                    { key: 'numero_factura', label: 'N° Factura' },
                    { key: 'ruc_emisor', label: 'RUC Emisor' },
                    { key: 'razon_social', label: 'Razón Social' },
                    { key: 'direccion_emisor', label: 'Dirección' },
                    { key: 'fecha_emision', label: 'Fecha Emisión' },
                    { key: 'proveedor', label: 'Proveedor' },
                    { key: 'codigo_producto', label: 'Código Producto' },
                    { key: 'descripcion', label: 'Descripción' },
                    { key: 'cantidad', label: 'Cantidad' },
                    { key: 'precio_unitario', label: 'Precio Unit.' },
                    { key: 'valor_venta', label: 'Valor Venta' },
                    { key: 'igv', label: 'IGV' },
                    { key: 'importe_total', label: 'Importe Total' },
                    { key: 'archivo_url', label: 'Archivo' }
                  ].map((column) => (
                    <th 
                      key={column.key}
                      className={`
                        py-3 px-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider
                        cursor-pointer hover:bg-neutral-700 transition-colors select-none
                        ${tableSize === 'small' ? 'py-2 px-2' : tableSize === 'large' ? 'py-4 px-6' : 'py-3 px-4'}
                      `}
                      onClick={() => {
                        if (sortField === column.key) {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                        } else {
                          setSortField(column.key)
                          setSortDirection('desc')
                        }
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {sortField === column.key && (
                          <svg 
                            className={`w-4 h-4 transform transition-transform ${
                              sortDirection === 'asc' ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {facturas && facturas.map((factura, index) => (
                  <motion.tr
                    key={factura.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-neutral-800/30 transition-colors"
                  >
                    {[
                      { value: factura.numero_factura || 'N/A', className: 'text-gray-600 dark:text-gray-300 font-mono' },
                      { value: factura.ruc_emisor || 'N/A', className: 'text-gray-600 dark:text-gray-300 font-mono' },
                      { value: factura.razon_social || 'N/A', className: 'text-gray-900 dark:text-white font-medium max-w-xs truncate' },
                      { value: factura.direccion_emisor || 'N/A', className: 'text-neutral-400 max-w-xs truncate' },
                      { value: formatDate(factura.fecha_emision), className: 'text-gray-600 dark:text-gray-300' },
                      { value: factura.proveedor || 'N/A', className: 'text-gray-600 dark:text-gray-300 max-w-xs truncate' },
                      { value: factura.codigo_producto || 'N/A', className: 'text-gray-600 dark:text-gray-300 font-mono' },
                      { value: factura.descripcion || 'N/A', className: 'text-gray-600 dark:text-gray-300 max-w-xs truncate' },
                      { value: factura.cantidad || 0, className: 'text-gray-600 dark:text-gray-300 text-center' },
                      { value: `S/ ${factura.precio_unitario?.toLocaleString('es-PE', {minimumFractionDigits: 2}) || '0.00'}`, className: 'text-green-400 font-medium' },
                      { value: `S/ ${factura.valor_venta?.toLocaleString('es-PE', {minimumFractionDigits: 2}) || '0.00'}`, className: 'text-green-400 font-medium' },
                      { value: `S/ ${factura.igv?.toLocaleString('es-PE', {minimumFractionDigits: 2}) || '0.00'}`, className: 'text-yellow-400 font-medium' },
                      { value: `S/ ${factura.importe_total?.toLocaleString('es-PE', {minimumFractionDigits: 2}) || '0.00'}`, className: 'text-green-400 font-bold' },
                      { 
                        value: factura.archivo_url ? (
                          <a 
                            href={factura.archivo_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-neutral-500">-</span>
                        ), 
                        className: 'text-center' 
                      }
                    ].map((cell, cellIndex) => (
                      <td 
                        key={cellIndex}
                        className={`
                          ${cell.className}
                          ${tableSize === 'small' ? 'py-2 px-2 text-xs' : tableSize === 'large' ? 'py-4 px-6' : 'py-3 px-4'}
                        `}
                      >
                        {cell.value}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Paginación Mejorada */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 gap-4">
            <div className="text-sm text-neutral-400">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, stats.total)} de {stats.total} facturas
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Primera
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Anterior
              </button>
              
              {/* Números de página */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-gray-600 dark:text-gray-300 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Siguiente
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Última
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
