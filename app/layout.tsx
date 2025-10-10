import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'

export const metadata: Metadata = {
  title: 'Flow - Automatiza finanzas con IA',
  description: 'Flow conecta tu tesorería, contabilidad y flujos RPA en un panel único. Extrae datos de PDFs, concilia, proyecta y alerta en tiempo real.',
  keywords: 'fintech, IA, automatización, tesorería, contabilidad, RPA, n8n',
  authors: [{ name: 'Flow' }],
  creator: 'Flow',
  publisher: 'Flow',
  openGraph: {
    title: 'Flow - Automatiza finanzas con IA',
    description: 'Cierra el mes en horas, no días. Conecta tu tesorería, contabilidad y flujos RPA en un panel único.',
    url: 'https://flow.finance',
    siteName: 'Flow',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flow - Automatiza finanzas con IA',
    description: 'Cierra el mes en horas, no días. Conecta tu tesorería, contabilidad y flujos RPA en un panel único.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  // Use saved theme if exists, otherwise use system preference
                  var shouldBeDark = theme ? (theme === 'dark') : systemPrefersDark;
                  
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-secondary-900 text-gray-900 dark:text-gray-100 antialiased transition-colors duration-200" style={{ fontFamily: '"Myriad Pro", "Myriad", "Liberation Sans", "Nimbus Sans L", "Helvetica Neue", Arial, sans-serif' }} suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
