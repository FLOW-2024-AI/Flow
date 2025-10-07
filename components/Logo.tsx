interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export default function Logo({ width = 60, height = 28, className = '' }: LogoProps) {
  const basePath = process.env.NODE_ENV === 'production' ? '/Flow' : ''
  
  return (
    <img 
      src={`${basePath}/images/logo/Flow-logo.jpg`}
      alt="Flow" 
      width={width}
      height={height}
      className={className}
    />
  )
}
