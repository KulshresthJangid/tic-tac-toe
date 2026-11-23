import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { consentPending, setConsent } from '../lib/analytics'

/** Shown only to visitors in Europe, and only when analytics is configured. */
export default function ConsentBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(consentPending())
  }, [])

  if (!show) return null

  function choose(value: 'granted' | 'denied') {
    setConsent(value)
    setShow(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Analytics cookies"
      className="fixed bottom-4 inset-x-4 sm:left-auto sm:right-6 sm:max-w-sm z-[60] rounded-xl border border-white/[0.18] bg-ink/95 backdrop-blur-md p-5 shadow-2xl"
    >
      <p className="text-sm text-white/80 leading-relaxed">
        I use Google Analytics to see which pages are useful. It only runs if you say yes. See the{' '}
        <Link to="/privacy" className="text-signal underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => choose('granted')}
          className="px-4 py-2 rounded-full bg-signal text-ink text-sm font-medium hover:bg-white transition-colors"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose('denied')}
          className="px-4 py-2 rounded-full border border-white/25 text-white/85 text-sm font-medium hover:border-signal transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  )
}
