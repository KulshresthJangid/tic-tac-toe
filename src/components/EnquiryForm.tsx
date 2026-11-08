import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, Building2, CheckCircle2, ChevronDown, DollarSign, Loader2, Lock, Mail, User } from 'lucide-react'
import { BUDGET_OPTIONS, EMAIL, SERVICE_OPTIONS, WEB3FORMS_ACCESS_KEY } from '../lib/contact'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface EnquiryFormProps {
  /** `full` adds the budget field. `compact` is the shorter bottom-of-page form. */
  variant?: 'full' | 'compact'
  submitLabel?: string
  source: string
}

const fieldBase =
  'w-full bg-ink/40 border border-white/[0.14] rounded-lg pl-10 pr-3 py-3 text-sm text-white placeholder:text-white/50 focus:border-signal focus:outline-none transition-colors'

function Field({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">{icon}</span>
      {children}
    </div>
  )
}

export default function EnquiryForm({ variant = 'full', submitLabel = 'Send enquiry', source }: EnquiryFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const full = variant === 'full'

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot: a hidden field real people never fill. Pretend success to bots.
    if (String(data.get('hp_confirm') ?? '').trim()) {
      setStatus('success')
      form.reset()
      return
    }

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error')
      setError('Please add your name and a valid work email.')
      return
    }

    setStatus('submitting')
    setError('')
    try {
      data.set('access_key', WEB3FORMS_ACCESS_KEY)
      data.set('subject', `New project enquiry (${source}), buildwithkulshresth.com`)
      data.set('source', source)
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
      const result = await res.json()
      if (!result.success) throw new Error(result.message || 'Submission failed')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setError(`Something went wrong. Please email me directly: ${EMAIL}`)
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center" role="status">
        <CheckCircle2 size={34} className="text-signal" />
        <p className="display text-3xl text-white">Thank you.</p>
        <p className="text-sm text-white/65 max-w-xs">I read every enquiry myself and will reply within one working day.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`relative ${full ? 'space-y-3' : 'grid sm:grid-cols-2 gap-3'}`}>
      <div className="absolute w-px h-px overflow-hidden opacity-0 -z-10" aria-hidden="true">
        <label htmlFor={`hp-${source}`}>Leave this field empty</label>
        <input type="text" id={`hp-${source}`} name="hp_confirm" tabIndex={-1} autoComplete="off" />
      </div>

      <Field icon={<User size={16} />}>
        <input name="name" required autoComplete="name" placeholder="Your name *" aria-label="Your name" className={fieldBase} />
      </Field>
      <Field icon={<Mail size={16} />}>
        <input name="email" type="email" required autoComplete="email" placeholder="Work email *" aria-label="Work email" className={fieldBase} />
      </Field>
      <Field icon={<Building2 size={16} />}>
        <input name="company" autoComplete="organization" placeholder="Company or startup name" aria-label="Company or startup name" className={fieldBase} />
      </Field>
      <Field icon={<Briefcase size={16} />}>
        <select name="service" defaultValue="" aria-label="What do you need?" className={`${fieldBase} appearance-none pr-9`}>
          <option value="" disabled>
            What do you need?
          </option>
          {SERVICE_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
      </Field>
      {full && (
        <Field icon={<DollarSign size={16} />}>
          <select name="budget" defaultValue="" aria-label="Approximate budget" className={`${fieldBase} appearance-none pr-9`}>
            <option value="" disabled>
              Approx. budget?
            </option>
            {BUDGET_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
        </Field>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={`group inline-flex items-center justify-center gap-2 rounded-full bg-signal text-ink font-medium py-3 hover:bg-white transition-colors duration-200 disabled:opacity-60 ${
          full ? 'w-full mt-1' : 'sm:col-span-2'
        }`}
      >
        {status === 'submitting' ? <Loader2 size={17} className="animate-spin" /> : null}
        {status === 'submitting' ? 'Sending' : submitLabel}
        {status !== 'submitting' && <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />}
      </button>

      {status === 'error' && (
        <p role="alert" className={`text-sm text-white/80 ${full ? '' : 'sm:col-span-2'}`}>
          {error}
        </p>
      )}
      <p className={`flex items-center justify-center gap-1.5 text-xs text-white/55 ${full ? '' : 'sm:col-span-2'}`}>
        <Lock size={12} /> Your details are safe with me. <Link to="/privacy" className="underline hover:text-white">Privacy</Link>
      </p>
    </form>
  )
}
