'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'G-XXXXXXXXXX', {
        page_path: pathname + searchParams.toString(),
      })
    }

    // Track page view
    trackPageView(pathname)
  }, [pathname, searchParams])

  return null
}

// Helper functions for tracking
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, properties)
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Event:', eventName, properties)
    }
  }
}

export function trackPageView(path: string) {
  trackEvent('page_view', { page_path: path })
}

export function trackCTAClick(ctaName: string, location: string) {
  trackEvent('cta_click', {
    cta_name: ctaName,
    location: location
  })
}

export function trackFormSubmit(formName: string) {
  trackEvent('form_submit', {
    form_name: formName
  })
}
