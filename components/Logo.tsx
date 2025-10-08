interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export default function Logo({ width = 60, height = 28, className = '' }: LogoProps) {
  return (
    <img 
      src="/images/logo/Flow-logo.png"
      alt="Flow" 
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'contain' }}
      onError={(e) => {
        console.error('Error loading logo from /images/logo/Flow-logo.png')
        // Fallback: mostrar texto si la imagen falla
        const target = e.target as HTMLImageElement
        target.style.display = 'none'
        const parent = target.parentElement
        if (parent) {
          const fallback = document.createElement('span')
          fallback.textContent = 'FLOW'
          fallback.className = 'text-white font-bold text-xl'
          parent.appendChild(fallback)
        }
      }}
    />
  )
}
