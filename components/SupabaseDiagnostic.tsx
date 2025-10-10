'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface DiagnosticTest {
  test: string;
  status: string;
  details: any;
}

interface DiagnosticResult {
  success: boolean;
  diagnostics: {
    timestamp: string;
    tests: DiagnosticTest[];
  };
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  error?: string;
  message?: string;
}

export default function SupabaseDiagnostic() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      const response = await fetch('/api/test-supabase');
      const data: DiagnosticResult = await response.json();
      
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Error al ejecutar diagnóstico',
        message: error instanceof Error ? error.message : 'Error desconocido',
        diagnostics: { timestamp: new Date().toISOString(), tests: [] },
        summary: { totalTests: 0, passed: 0, failed: 1, warnings: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('✅')) return '✅';
    if (status.includes('❌')) return '❌';
    if (status.includes('⚠️')) return '⚠️';
    return 'ℹ️';
  };

  const getStatusColor = (status: string) => {
    if (status.includes('✅')) return 'text-green-400';
    if (status.includes('❌')) return 'text-red-400';
    if (status.includes('⚠️')) return 'text-yellow-400';
    return 'text-blue-400';
  };

  return (
    <div className="bg-neutral-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Diagnóstico de Supabase
          </h3>
          <p className="text-neutral-400 text-sm">Verifica la conexión y configuración de tu base de datos</p>
        </div>
        <button
          onClick={runDiagnostic}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Ejecutando...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Ejecutar Diagnóstico</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-neutral-800/50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-400">{result.summary.totalTests}</p>
              <p className="text-xs text-neutral-400">Total Tests</p>
            </div>
            <div className="bg-neutral-800/50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-400">{result.summary.passed}</p>
              <p className="text-xs text-neutral-400">Pasaron</p>
            </div>
            <div className="bg-neutral-800/50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-400">{result.summary.failed}</p>
              <p className="text-xs text-neutral-400">Fallaron</p>
            </div>
            <div className="bg-neutral-800/50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-400">{result.summary.warnings}</p>
              <p className="text-xs text-neutral-400">Advertencias</p>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Resultados de las Pruebas:</h4>
            {result.diagnostics.tests.map((test, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-neutral-800/30 border border-neutral-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getStatusIcon(test.status)}</span>
                    <div>
                      <h5 className="font-medium">{test.test}</h5>
                      <p className={`text-sm ${getStatusColor(test.status)}`}>{test.status}</p>
                    </div>
                  </div>
                </div>
                
                {test.details && (
                  <div className="mt-3 ml-11">
                    <details className="text-sm">
                      <summary className="cursor-pointer text-neutral-400 hover:text-gray-600 dark:text-gray-300">
                        Ver detalles
                      </summary>
                      <div className="mt-2 p-3 bg-neutral-900/50 rounded border border-neutral-600">
                        <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-x-auto">
                          {typeof test.details === 'string' 
                            ? test.details 
                            : JSON.stringify(test.details, null, 2)
                          }
                        </pre>
                      </div>
                    </details>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Error Message */}
          {!result.success && result.error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <h4 className="font-semibold text-red-400 mb-2">Error General:</h4>
              <p className="text-red-300">{result.error}</p>
              {result.message && (
                <p className="text-red-400 text-sm mt-1">{result.message}</p>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div className="text-xs text-neutral-500 text-center">
            Ejecutado el: {new Date(result.diagnostics.timestamp).toLocaleString('es-CO')}
          </div>
        </motion.div>
      )}

      {!result && !loading && (
        <div className="text-center py-8 text-neutral-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p>Haz clic en "Ejecutar Diagnóstico" para verificar tu configuración de Supabase</p>
        </div>
      )}
    </div>
  );
}
