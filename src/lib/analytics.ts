import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CALENDLY_URL } from './contact'

/**
 * GA4 measurement ID. Leave empty to disable analytics entirely (the default
 * until the property exists). Create the property in GA4 -> Admin -> Data
 * streams -> Web, paste the "G-..." ID here, rebuild, deploy.
 */
export const GA_MEASUREMENT_ID = ''

const CONSENT_KEY = 'analytics-consent'

type Consent = 'granted' | 'denied'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

/** Prerender (headless Chromium) and other automation must never load analytics or show the banner. */
function isAutomated(): boolean {
  return typeof navigator !== 'undefined' && navigator.webdriver === true
}

export function analyticsConfigured(): boolean {
  return GA_MEASUREMENT_ID.length > 0 && !isAutomated()
}

/**
 * Visitors in Europe (including the UK and Switzerland, by browser timezone)
 * must opt in before any analytics cookie is set. Everyone else is measured by
 * default. Timezone is a heuristic, not a legal determination.
 */
export function needsConsent(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    return tz.startsWith('Europe/') || tz === 'Atlantic/Reykjavik' || tz === 'Atlantic/Canary' || tz === 'Atlantic/Madeira' || tz === 'Atlantic/Azores'
  } catch {
    return false
  }
}

export function getStoredConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

/** True when the consent banner should be shown. */
export function consentPending(): boolean {
  return analyticsConfigured() && needsConsent() && getStoredConsent() === null
}

function analyticsAllowed(): boolean {
  if (!analyticsConfigured()) return false
  if (!needsConsent()) return getStoredConsent() !== 'denied'
  return getStoredConsent() === 'granted'
}

let loaded = false

function load(): void {
  if (loaded || !analyticsAllowed()) return
  loaded = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag.js requires the real `arguments` object, not a rest array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  // page_view is sent manually on route change (SPA), so disable the automatic one.
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false, anonymize_ip: true })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`
  document.head.appendChild(s)
}

export function setConsent(value: Consent): void {
  try {
    localStorage.setItem(CONSENT_KEY, value)
  } catch {
    /* private mode: decision lasts for this page view only */
  }
  if (value === 'granted') {
    load()
    pageView()
  }
}

export function track(event: string, params: Record<string, string | number | boolean | undefined> = {}): void {
  if (!analyticsAllowed()) return
  load()
  window.gtag('event', event, params)
}

export function pageView(): void {
  track('page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
  })
}

function isSameSite(a: HTMLAnchorElement): boolean {
  return a.hostname === window.location.hostname
}

/**
 * Mount once in the layout. Sends page_view on every route change and handles
 * cta_click and outbound_click for every link via one delegated listener, so
 * individual components do not need to know about analytics.
 *
 * - cta_click: any element with data-cta, any Calendly link, any mailto link.
 * - outbound_click: any http(s) link to another host.
 */
export function useAnalytics(): void {
  const { pathname, search } = useLocation()

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    // Wait a tick so usePageMeta has set document.title for the new route.
    const id = window.setTimeout(pageView, 0)
    return () => window.clearTimeout(id)
  }, [pathname, search])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null
      const a = target?.closest?.('a') as HTMLAnchorElement | null
      if (!a || !a.href) return

      const page_path = window.location.pathname
      const ctaName =
        a.dataset.cta ??
        (a.href.startsWith(CALENDLY_URL) ? 'book_call' : a.protocol === 'mailto:' ? 'email' : undefined)
      if (ctaName) {
        track('cta_click', { cta_name: ctaName, link_url: a.href, page_path })
      }
      if ((a.protocol === 'http:' || a.protocol === 'https:') && !isSameSite(a)) {
        track('outbound_click', { link_url: a.href, link_domain: a.hostname, page_path })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
