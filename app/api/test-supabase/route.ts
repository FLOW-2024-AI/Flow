import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    tests: [] as any[]
  };

  try {
    // Test 1: Verificar variables de entorno
    diagnostics.tests.push({
      test: "Variables de entorno",
      status: supabaseUrl && supabaseKey ? "✅ OK" : "❌ FALLO",
      details: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlFormat: supabaseUrl ? supabaseUrl.includes('supabase.co') : false,
        keyFormat: supabaseKey ? supabaseKey.startsWith('eyJ') : false
      }
    });

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: "Variables de entorno faltantes",
        diagnostics
      });
    }

    // Test 2: Crear cliente Supabase
    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseKey);
      diagnostics.tests.push({
        test: "Cliente Supabase",
        status: "✅ OK",
        details: "Cliente creado exitosamente"
      });
    } catch (error) {
      diagnostics.tests.push({
        test: "Cliente Supabase",
        status: "❌ FALLO",
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
      throw error;
    }

    // Test 3: Conexión básica a Supabase
    try {
      const { data, error } = await supabase.from('_realtime_schema').select('*').limit(1);
      diagnostics.tests.push({
        test: "Conexión a Supabase",
        status: error ? "❌ FALLO" : "✅ OK",
        details: error ? error.message : "Conexión exitosa"
      });
    } catch (error) {
      diagnostics.tests.push({
        test: "Conexión a Supabase",
        status: "❌ FALLO",
        details: error instanceof Error ? error.message : 'Error de conexión'
      });
    }

    // Test 4: Verificar si la tabla 'public.facturas' existe
    try {
      const { data: tableData, error: tableError } = await supabase
        .from('public.facturas')
        .select('*')
        .limit(1);

      if (tableError) {
        diagnostics.tests.push({
          test: "Tabla 'public.facturas' existe",
          status: "❌ FALLO",
          details: {
            error: tableError.message,
            code: tableError.code,
            hint: tableError.hint
          }
        });
      } else {
        diagnostics.tests.push({
          test: "Tabla 'public.facturas' existe",
          status: "✅ OK",
          details: {
            hasData: tableData && tableData.length > 0,
            recordCount: tableData ? tableData.length : 0,
            firstRecord: tableData && tableData.length > 0 ? tableData[0] : null
          }
        });
      }
    } catch (error) {
      diagnostics.tests.push({
        test: "Tabla 'Facturas' existe",
        status: "❌ FALLO",
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }

    // Test 5: Contar registros en la tabla
    try {
      const { count, error } = await supabase
        .from('Facturas')
        .select('*', { count: 'exact', head: true });

      if (error) {
        diagnostics.tests.push({
          test: "Contar registros",
          status: "❌ FALLO",
          details: error.message
        });
      } else {
        diagnostics.tests.push({
          test: "Contar registros",
          status: "✅ OK",
          details: {
            totalRecords: count,
            isEmpty: count === 0
          }
        });
      }
    } catch (error) {
      diagnostics.tests.push({
        test: "Contar registros",
        status: "❌ FALLO",
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }

    // Test 6: Obtener estructura de la tabla
    try {
      const { data, error } = await supabase
        .from('Facturas')
        .select('*')
        .limit(1);

      if (!error && data && data.length > 0) {
        const columns = Object.keys(data[0]);
        diagnostics.tests.push({
          test: "Estructura de la tabla",
          status: "✅ OK",
          details: {
            columns: columns,
            columnCount: columns.length,
            sampleData: data[0]
          }
        });
      } else {
        diagnostics.tests.push({
          test: "Estructura de la tabla",
          status: "⚠️ ADVERTENCIA",
          details: "Tabla existe pero no tiene datos"
        });
      }
    } catch (error) {
      diagnostics.tests.push({
        test: "Estructura de la tabla",
        status: "❌ FALLO",
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }

    // Test 7: Verificar RLS
    try {
      const { data, error } = await supabase.rpc('check_rls_status', { table_name: 'Facturas' });
      diagnostics.tests.push({
        test: "Row Level Security",
        status: error ? "⚠️ NO SE PUDO VERIFICAR" : "ℹ️ INFO",
        details: error ? error.message : "RLS verificado"
      });
    } catch (error) {
      diagnostics.tests.push({
        test: "Row Level Security",
        status: "⚠️ NO SE PUDO VERIFICAR",
        details: "No se pudo verificar el estado de RLS"
      });
    }

    return NextResponse.json({
      success: true,
      message: "Diagnóstico completado",
      diagnostics,
      summary: {
        totalTests: diagnostics.tests.length,
        passed: diagnostics.tests.filter(t => t.status.includes('✅')).length,
        failed: diagnostics.tests.filter(t => t.status.includes('❌')).length,
        warnings: diagnostics.tests.filter(t => t.status.includes('⚠️')).length
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error durante el diagnóstico',
      message: error instanceof Error ? error.message : 'Error desconocido',
      diagnostics
    }, { status: 500 });
  }
}
