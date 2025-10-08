'use client'

import Link from 'next/link'
import { useState } from 'react'
import Logo from './Logo'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-2xl border-b border-white/[0.08] z-50">
      <div className="max-w-[980px] mx-auto px-6">
        <div className="flex justify-between items-center h-11">
          {/* Logo */}
          <Link href="/" className="flex items-center -ml-2 hover:opacity-80 transition-opacity">
            <Logo width={80} height={32} className="h-8 w-auto object-contain" />
          </Link>
          
          {/* Center Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/soluciones" className="text-white/70 hover:text-white transition-colors text-[12px] font-normal">
              Soluciones
            </Link>
            <Link href="/como-funciona" className="text-white/70 hover:text-white transition-colors text-[12px] font-normal">
              Cómo funciona
            </Link>
            <Link href="/precios" className="text-white/70 hover:text-white transition-colors text-[12px] font-normal">
              Precios
            </Link>
            <Link href="/quienes-somos" className="text-white/70 hover:text-white transition-colors text-[12px] font-normal">
              Nosotros
            </Link>
            <Link href="/contacto" className="text-white/70 hover:text-white transition-colors text-[12px] font-normal">
              Contacto
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden sm:block text-white/70 hover:text-white transition-colors text-[12px] font-normal">
              Iniciar sesión
            </Link>
            <Link href="/consulta" className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-3 py-1.5 rounded-full text-[12px] font-normal transition-colors">
              Consulta
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white/70 hover:text-white transition-colors"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-2xl border-t border-white/[0.08]">
          <div className="max-w-[980px] mx-auto px-6 py-4 space-y-3">
            <Link 
              href="/soluciones" 
              className="block text-white/70 hover:text-white transition-colors text-sm py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Soluciones
            </Link>
            <Link 
              href="/como-funciona" 
              className="block text-white/70 hover:text-white transition-colors text-sm py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cómo funciona
            </Link>
            <Link 
              href="/precios" 
              className="block text-white/70 hover:text-white transition-colors text-sm py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Precios
            </Link>
            <Link 
              href="/quienes-somos" 
              className="block text-white/70 hover:text-white transition-colors text-sm py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link 
              href="/contacto" 
              className="block text-white/70 hover:text-white transition-colors text-sm py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </Link>
            <div className="border-t border-white/[0.08] pt-3">
              <Link 
                href="/login" 
                className="block text-white/70 hover:text-white transition-colors text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
