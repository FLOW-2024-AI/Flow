'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-11">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo/Flow-logo.jpg" 
              alt="Flow" 
              width={60} 
              height={28}
              className="h-7 w-auto object-contain"
            />
          </Link>
          
          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/soluciones" className="text-white/80 hover:text-white transition-colors text-xs">
              Soluciones
            </Link>
            <Link href="/como-funciona" className="text-white/80 hover:text-white transition-colors text-xs">
              Cómo funciona
            </Link>
            <Link href="/precios" className="text-white/80 hover:text-white transition-colors text-xs">
              Precios
            </Link>
            <Link href="/quienes-somos" className="text-white/80 hover:text-white transition-colors text-xs">
              Nosotros
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-white/80 hover:text-white transition-colors text-xs">
              Iniciar sesión
            </Link>
            <Link href="/consulta" className="bg-white text-black px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-90 transition-opacity">
              Consulta
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
