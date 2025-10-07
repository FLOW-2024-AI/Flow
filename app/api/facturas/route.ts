import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured'
      }, { status: 500 });
    }
    
    // Obtener facturas desde Supabase
    const { data: facturas, error, count } = await supabase
      .from('facturas')
      .select('*', { count: 'exact' })
      .order('fecha_emision', { ascending: false });

    if (error) {
      console.error('Error de Supabase:', error);
      return NextResponse.json({
        success: false,
        error: `Error de Supabase: ${error.message}`,
        facturas: [],
        stats: { total: 0, hoy: 0, semana: 0, mes: 0, montoTotal: 0 }
      }, { status: 500 });
    }

    // Calcular estadísticas básicas
    const stats = {
      total: count || 0,
      hoy: 0,
      semana: 0,
      mes: 0,
      montoTotal: facturas ? facturas.reduce((sum: number, f: any) => {
        return sum + (parseFloat(f.importe_total) || 0);
      }, 0) : 0
    };

    return NextResponse.json({
      success: true,
      facturas: facturas || [],
      stats: stats
    });

  } catch (error) {
    console.error('Error en API de facturas:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      facturas: [],
      stats: { total: 0, hoy: 0, semana: 0, mes: 0, montoTotal: 0 }
    }, { status: 500 });
  }
}

// Endpoint para crear nuevas facturas (opcional)
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    const { data, error } = await supabase
      .from('public.facturas')
      .insert([body])
      .select();

    if (error) {
      throw new Error(`Error de Supabase: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Factura creada exitosamente'
    });

  } catch (error) {
    console.error('Error al crear factura en Supabase:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al crear factura',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
