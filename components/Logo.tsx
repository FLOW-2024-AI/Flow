'use client'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export default function Logo({ width = 60, height = 28, className = '' }: LogoProps) {
  return (
    <div className={className} style={{ width, height }}>
      {/* Logo oscuro para tema claro */}
      <img 
        src="/images/logo/flow-logo-dark.svg"
        alt="Flow" 
        width={width}
        height={height}
        className="dark:hidden"
        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
      />
      {/* Logo claro para tema oscuro */}
      <img 
        src="/images/logo/flow-logo-light.svg"
        alt="Flow" 
        width={width}
        height={height}
        className="hidden dark:block"
        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
      />
    </div>
  )
}
