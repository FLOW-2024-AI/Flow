'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ThemeToggle from '@/components/ThemeToggle'
import { ArrowLeft, RefreshCw, Search, Pause, Play, Database, Eye } from 'lucide-react'

type DynamoFactura = {
  clientId: string
  invoiceId: string
  numeroFactura: string
  fechaEmision: string
  emisorRUC: string
  emisorRazonSocial: string
  receptorRUC: string
  receptorRazonSocial: string
  total: number | null
  subtotal: number | null
  igv: number | null
  moneda: string
  sunatEstado: string
  sunatEsValido: boolean | null
  sunatMotivo: string
  sunatEstadoComprobanteDescripcion: string
  sunatEstadoRucDescripcion: string
  sunatCondicionDomicilioDescripcion: string
  sunatObservaciones: string[]
  sunatRucActivo: boolean
  procesamientoStatus: string
  procesamientoMotor: string
  procesamientoRuta: string | null
  creadoEn: string
  s3Bucket: string
  s3Key: string
  archivoNombre: string
}

type PreviewState = {
  url: string
  filename: string
  kind: 'pdf' | 'image' | 'file'
}

const formatMoney = (value: number | null, moneda: string) => {
  if (value === null || Number.isNaN(value)) {
    return '--'
  }
  const symbol = moneda === 'USD' ? '$' : 'S/'
  return `${symbol} ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
}

const formatDate = (value: string) => {
  if (!value) {
    return '--'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleDateString('es-PE')
}

const formatValidez = (value: boolean | null) => {
  if (value === true) return 'Sí'
  if (value === false) return 'No'
  return '--'
}

const getPreviewKind = (filename: string) => {
  const lower = filename.toLowerCase()
  if (lower.endsWith('.pdf')) return 'pdf'
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image'
  return 'file'
}

const formatCausa = (item: DynamoFactura) => {
  if (item.sunatEsValido === true) {
    return '--'
  }
  const parts: string[] = []
  if (item.sunatEstadoComprobanteDescripcion) {
    parts.push(item.sunatEstadoComprobanteDescripcion)
  }
  if (item.sunatEstadoRucDescripcion && !item.sunatRucActivo) {
    parts.push(`RUC ${item.sunatEstadoRucDescripcion}`)
  }
  if (!parts.length && item.sunatMotivo) {
    parts.push(item.sunatMotivo)
  }
  if (item.sunatObservaciones?.length) {
    parts.push(item.sunatObservaciones.join(', '))
  }
  return parts.length ? parts.join(' | ') : '--'
}

export default function VisorDynamoPage() {
  const [items, setItems] = useState<DynamoFactura[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [cursor, setCursor] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [preview, setPreview] = useState<PreviewState | null>(null)
  const [previewLoading, setPreviewLoading] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState('')

  const stats = useMemo(() => {
    const total = items.length
    const montoTotal = items.reduce((acc, item) => acc + (item.total || 0), 0)
    const validas = items.filter((item) => item.sunatEsValido === true).length
    return { total, montoTotal, validas }
  }, [items])

  const fetchItems = async (options?: { append?: boolean; resetCursor?: boolean }) => {
    if (loading) return
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      params.set('limit', '50')
      if (search) {
        params.set('search', search)
      }
      if (!options?.resetCursor && cursor) {
        params.set('cursor', cursor)
      }
      const response = await fetch(`/api/dynamo-facturas?${params.toString()}`, {
        cache: 'no-store'
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al cargar datos')
      }
      setItems((prev) => (options?.append ? [...prev, ...data.items] : data.items))
      setCursor(data.nextCursor || null)
      setLastUpdated(new Date().toLocaleTimeString('es-PE'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems({ resetCursor: true })
  }, [search])

  useEffect(() => {
    if (!autoRefresh) return
    const id = setInterval(() => fetchItems({ resetCursor: true }), 10000)
    return () => clearInterval(id)
  }, [autoRefresh, search])

  const handleSearch = () => {
    setCursor(null)
    setSearch(query.trim())
  }

  const openPreview = async (item: DynamoFactura) => {
    if (!item.invoiceId) {
      return
    }
    setPreviewError('')
    setPreviewLoading(item.invoiceId)
    try {
      const params = new URLSearchParams({ invoiceId: item.invoiceId })
      const response = await fetch(`/api/dynamo-facturas/preview?${params.toString()}`)
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'No se pudo generar la vista previa')
      }
      const filename = data.filename || item.archivoNombre || item.invoiceId
      setPreview({
        url: data.url,
        filename,
        kind: getPreviewKind(filename)
      })
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : 'Error al cargar vista previa')
    } finally {
      setPreviewLoading(null)
    }
  }

  const sunatBadge = (item: DynamoFactura) => {
    if (item.sunatEsValido === true) {
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
    }
    if (item.sunatEsValido === false) {
      return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200'
    }
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
  }

  const rucBadge = (item: DynamoFactura) => {
    if (item.sunatRucActivo) {
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
    }
    if (item.sunatEstadoRucDescripcion) {
      return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200'
    }
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-[#121212] dark:via-[#171717] dark:to-[#1f1f1f] p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/apps"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-lg">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Visor Dynamo
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Datos en tiempo real desde DynamoDB
                  </p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/80 dark:bg-[#1f1f1f] border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Facturas en vista</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{stats.total}</p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-[#1f1f1f] border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Monto total</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                S/ {stats.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-[#1f1f1f] border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">SUNAT válidas</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{stats.validas}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex items-center gap-2 bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar factura, RUC o proveedor"
                  className="bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none w-56"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
              >
                Buscar
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Última actualización: {lastUpdated || '--'}
              </div>
              <button
                onClick={() => fetchItems({ resetCursor: true })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1f1f1f] text-sm text-slate-700 dark:text-slate-200 hover:shadow transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refrescar
              </button>
              <button
                onClick={() => setAutoRefresh((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1f1f1f] text-sm text-slate-700 dark:text-slate-200"
              >
                {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {autoRefresh ? 'Pausar' : 'Auto'}
              </button>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="rounded-2xl bg-white/90 dark:bg-[#1f1f1f] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100/70 dark:bg-[#2a2a2a] text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3 text-left">Preview</th>
                  <th className="px-4 py-3 text-left">Factura</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Emisor</th>
                  <th className="px-4 py-3 text-left">RUC Emisor</th>
                  <th className="px-4 py-3 text-left">Receptor</th>
                  <th className="px-4 py-3 text-left">RUC Receptor</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Moneda</th>
                  <th className="px-4 py-3 text-left">SUNAT</th>
                  <th className="px-4 py-3 text-left">Válida</th>
                  <th className="px-4 py-3 text-left">RUC</th>
                  <th className="px-4 py-3 text-left">Causa</th>
                  <th className="px-4 py-3 text-left">Motor</th>
                  <th className="px-4 py-3 text-left">Ruta</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.invoiceId} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-white/5">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openPreview(item)}
                        disabled={!item.invoiceId || !item.s3Key || previewLoading === item.invoiceId}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1f1f1f] text-xs text-slate-700 dark:text-slate-200 hover:shadow transition disabled:opacity-50"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {previewLoading === item.invoiceId ? 'Cargando...' : 'Ver'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.numeroFactura}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500" title={item.invoiceId}>
                        {item.invoiceId}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200 max-w-[220px] truncate" title={item.emisorRazonSocial}>
                      {item.emisorRazonSocial || '--'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {item.emisorRUC || '--'}
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200 max-w-[220px] truncate" title={item.receptorRazonSocial}>
                      {item.receptorRazonSocial || '--'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {item.receptorRUC || '--'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {formatDate(item.fechaEmision || item.creadoEn)}
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {formatMoney(item.total, item.moneda)}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {item.moneda || '--'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${sunatBadge(item)}`}>
                        {item.sunatEstado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {formatValidez(item.sunatEsValido)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${rucBadge(item)}`}>
                        {item.sunatEstadoRucDescripcion || 'No validado'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 max-w-[260px] truncate" title={formatCausa(item)}>
                      {formatCausa(item)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <div>{item.procesamientoMotor}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-[200px] truncate" title={item.procesamientoRuta || ''}>
                      {item.procesamientoRuta || '--'}
                    </td>
                  </tr>
                ))}
                {!items.length && !loading && (
                  <tr>
                    <td colSpan={16} className="px-4 py-10 text-center text-slate-500">
                      Sin datos para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {cursor && (
            <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-4 flex justify-center">
              <button
                onClick={() => fetchItems({ append: true })}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1f1f1f] text-sm text-slate-700 dark:text-slate-200 hover:shadow transition"
              >
                Cargar más
              </button>
            </div>
          )}
        </div>
      </div>
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-5xl h-[80vh] rounded-2xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                {preview.filename}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={preview.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 hover:shadow transition"
                >
                  Abrir
                </a>
                <button
                  onClick={() => setPreview(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-[#1a1a1a] flex items-center justify-center">
              {preview.kind === 'pdf' && (
                <iframe src={preview.url} className="w-full h-full" title={preview.filename} />
              )}
              {preview.kind === 'image' && (
                <img src={preview.url} alt={preview.filename} className="max-h-full max-w-full object-contain" />
              )}
              {preview.kind === 'file' && (
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  No se puede previsualizar este archivo. Usa “Abrir”.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {previewError && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-rose-600 text-white px-4 py-3 text-sm shadow-lg">
          {previewError}
        </div>
      )}
    </div>
  )
}
