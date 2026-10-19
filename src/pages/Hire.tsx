import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Mail, CheckCircle2, Loader2 } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import GlassCard from '../components/GlassCard'

const CALENDLY_LINK = 'https://calendly.com/jangidkulshresth/20-min-intro-call'
const EMAIL = 'jangidkulshresth@gmail.com'
// Calendly's intro-call event is open 7-11pm IST weekdays — that window is
// ~13:30-17:30 UTC, i.e. roughly 8:30am-12:30pm US Eastern. Real overlap is
// with Eastern mornings; Pacific clients land in their very-early morning.
const OVERLAP_HOURS = '4 hours (US Eastern mornings)'

// Web3Forms — free, no backend of our own needed (this site is a static
// SPA with no server). This key is a public, client-side key by design
// (Web3Forms' own model, not a secret leak) — safe to ship in the bundle.
const WEB3FORMS_ACCESS_KEY = '4322fba6-b1a2-4070-8c14-391821aca840'

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
}

const offers = [
  {
    title: 'LLM / Chatbot Backends',
    who: 'Teams that need a real conversational product — support automation, an internal AI assistant, a qualification or booking flow — wired into actual data, not a demo script.',
    get: 'A conversational backend built for production: structured prompts, conversation state and memory, and real integrations into your systems. Same foundation I built Zigchat and its Bot Creation API on.',
    timeline: '2-4 weeks',
  },
  {
    title: 'API & Microservice Builds',
    who: 'Founders and CTOs who need a backend service built from scratch or extended without breaking what already works.',
    get: 'A Node.js/TypeScript or Java/Spring Boot service with a proper schema, auth, and clean architecture — SQL or NoSQL, Redis where it earns its place, tests that actually catch regressions.',
    timeline: '2-4 weeks',
  },
  {
    title: 'Backend Audit & Scaling',
    who: 'An existing backend that is slow, flaky, or hard to deploy, and a team that wants a straight answer on why.',
    get: 'A full review of your current backend, concrete performance and reliability fixes, and a production setup — Docker, Kubernetes, Nginx, CI/CD — that holds up under real traffic.',
    timeline: '1-2 weeks',
  },
]

const proofPoints = [
  '4+ years of professional backend and full-stack engineering',
  'Built Zigchat — a no-code chatbot SaaS (Node.js, Express, TypeScript, SQL, NLP)',
  'Open-source contributions to Rocket.Chat',
  'Previously a tech lead on a flagship SaaS product',
]

const stack = [
  'Java', 'Spring Boot', 'Node.js', 'TypeScript', 'Go', 'Python',
  'SQL', 'MongoDB', 'DynamoDB', 'Redis',
  'Docker', 'Kubernetes', 'Nginx', 'Jenkins', 'GitLab CI',
]

const howIWork = [
  { step: '01', title: 'Intro call', desc: 'A 20-minute call to understand the problem, not to pitch you. We figure out together if this is a fit.' },
  { step: '02', title: 'Scoped proposal', desc: 'A written proposal with fixed milestones and deliverables — you know what you’re getting and when before any work starts.' },
  { step: '03', title: 'Weekly demos', desc: 'Working software, shown weekly. No black-box stretches where you’re left guessing what’s happening.' },
  { step: '04', title: 'Handover with docs', desc: 'Clean handover: documented code, a runbook for what you own now, and a walkthrough — not a project that only I understand.' },
]

const selectedWork = [
  {
    id: 'social-saas',
    title: 'Kaizex — Marketing Operating System',
    problem: 'Content teams needed real conversational automation — not a scripted bot — running across a website widget and WhatsApp Business, with no existing tool offering content intelligence or a usable builder.',
    built: 'A visual, node-based pipeline builder (21+ node types) that drives real conversations across channels, landing in one unified inbox regardless of where the message came from. BYO-AI across five provider adapters.',
    stack: ['Java', 'Spring Boot', 'RabbitMQ', 'Redis', 'MariaDB', 'WhatsApp Cloud API'],
  },
  {
    id: 'leadgen-pro',
    title: 'LeadGen Pro — AI Lead Generation Engine',
    problem: 'B2B lead generation at any real volume gets expensive fast once you’re paying per API call for qualification and outreach copy.',
    built: 'A fully self-hosted pipeline: multi-source scraping, SHA-256 + fuzzy deduplication, and a local LLM (Mistral 7B via Ollama) doing two-pass qualification and personalised outreach — zero recurring AI cost.',
    stack: ['Node.js', 'Express', 'Ollama', 'Mistral 7B', 'PostgreSQL', 'Socket.io'],
  },
  {
    id: 'sso-platform',
    title: 'Enterprise SSO Security Portal',
    problem: 'Growing orgs with separate passwords per internal app were accumulating credential risk and multi-hour manual onboarding for every new hire.',
    built: 'A multi-tenant OpenID Connect authorization server with tenant isolation enforced at the data layer, custom JWT claims, PKCE support, and an admin dashboard for non-technical provisioning.',
    stack: ['Java', 'Spring Authorization Server', 'OAuth2', 'PostgreSQL', 'JWT'],
  },
]

const faqs = [
  {
    q: 'What kind of engagement do you take on?',
    a: 'Fixed-scope projects with defined milestones, or ongoing hourly work once we’ve established a working rhythm. We’ll agree on which fits before any contract.',
  },
  {
    q: 'What time zone are you in, and how much overlap can we get?',
    a: `I'm based in Jaipur, India (IST, UTC+5:30). Expect roughly ${OVERLAP_HOURS} of real-time overlap with US business hours, plus async-friendly communication the rest of the day — written updates, recorded demos, and async code review so nothing waits on a live call.`,
  },
  {
    q: 'Who owns the code once the project is done?',
    a: 'You do, fully. Everything built under the engagement — code, docs, infrastructure configs — is yours on delivery. No retained rights, no licensing strings.',
  },
  {
    q: 'Can you sign an NDA?',
    a: 'Yes. Happy to sign yours, or I can send a standard one if you don’t have one ready.',
  },
]

const budgetRanges = [
  'Under $5k',
  '$5k – $15k',
  '$15k – $40k',
  '$40k+',
  'Not sure yet — let’s discuss',
]

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function Hire() {
  usePageMeta(
    'Hire Kulshresth Jangid — Freelance Backend & AI Integration Engineer',
    'Backend and AI integration engineer for early-stage teams. I build APIs, microservices and LLM/chatbot backends that ship fast and hold up in production. Node.js, TypeScript, Java/Spring Boot.',
    {
      canonical: 'https://buildwithkulshresth.com/hire',
      og: {
        title: 'Hire Kulshresth Jangid — Freelance Backend & AI Integration Engineer',
        description: 'Backend and AI integration engineer for early-stage teams. APIs, microservices, and LLM/chatbot backends that ship fast and hold up in production.',
        type: 'profile',
      },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Kulshresth Jangid',
          url: 'https://buildwithkulshresth.com/hire',
          image: 'https://buildwithkulshresth.com/og-image.png',
          jobTitle: 'Backend and AI Integration Engineer',
          description: 'Backend and AI integration engineer for early-stage teams. I build APIs, microservices and LLM/chatbot backends.',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Jaipur',
            addressRegion: 'Rajasthan',
            addressCountry: 'IN',
          },
          knowsAbout: [
            'Node.js', 'TypeScript', 'Java', 'Spring Boot', 'Go', 'Python',
            'LLM Integration', 'Chatbot Backends', 'Microservices', 'API Design',
          ],
          sameAs: [
            'https://github.com/kulshresthjangid',
            'https://www.linkedin.com/in/kulshresth-jangid/',
            'https://x.com/nerdy_ge3k',
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Kulshresth Jangid — Freelance Backend Engineering',
          url: 'https://buildwithkulshresth.com/hire',
          image: 'https://buildwithkulshresth.com/og-image.png',
          description: 'Project-based backend and AI integration engineering for early-stage startups: API and microservice builds, LLM/chatbot backends, and backend audits and scaling.',
          areaServed: 'Worldwide',
          provider: { '@type': 'Person', name: 'Kulshresth Jangid' },
          serviceType: [
            'Backend Development',
            'API Development',
            'LLM Integration',
            'Chatbot Development',
            'Backend Performance Audit',
          ],
        },
      ],
    },
  )

  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot — real users never fill a visually-hidden field. Bots that
    // blindly fill every input will. Deliberately not named "website" (or
    // anything else a browser's autofill heuristics commonly target) —
    // that would false-positive against real users whose autofill profile
    // has a website field, silently eating their submission. Pretend
    // success, send nothing.
    if (String(data.get('hp_confirm') ?? '').trim().length > 0) {
      setStatus('success')
      form.reset()
      return
    }

    if (WEB3FORMS_ACCESS_KEY.startsWith('[')) {
      setStatus('error')
      setErrorMsg(
        `Form isn't wired up yet — email me directly instead: ${EMAIL}`,
      )
      return
    }

    setStatus('submitting')
    setErrorMsg('')
    try {
      data.set('access_key', WEB3FORMS_ACCESS_KEY)
      data.set('subject', 'New freelance project inquiry — buildwithkulshresth.com/hire')
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      })
      const result = await res.json()
      if (result.success) {
        setStatus('success')
        form.reset()
      } else {
        throw new Error(result.message || 'Submission failed')
      }
    } catch {
      setStatus('error')
      setErrorMsg(`Something went wrong — email me directly instead: ${EMAIL}`)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-20">
      {/* Hero */}
      <motion.section {...fadeUp} className="space-y-6 max-w-2xl">
        <p className="text-xs font-mono text-white/25 tracking-[0.25em] uppercase">
          Freelance / Project-Based
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
          Backend and AI integration engineer for early-stage teams.
        </h1>
        <p className="text-base text-white/50 leading-relaxed max-w-xl">
          I build APIs, microservices and LLM/chatbot backends that ship fast and
          hold up in production. Node.js, TypeScript, Java/Spring Boot.
        </p>
        <div className="flex gap-3 flex-wrap pt-2">
          <a
            href={CALENDLY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-150"
          >
            <Calendar size={15} />
            Book a 20-min intro call
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass glass-hover text-white/60 text-sm font-medium hover:text-white transition-all duration-150"
          >
            <Mail size={15} />
            Email me
          </a>
        </div>
      </motion.section>

      {/* What I build */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        <h2 className="text-base font-semibold text-white mb-1">What I build</h2>
        <p className="text-xs text-white/20 font-mono mb-6">// pick the shape of help you need</p>
        <div className="grid md:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <GlassCard key={offer.title} hoverable className="flex flex-col gap-4 h-full">
              <h3 className="text-sm font-semibold text-white leading-snug">{offer.title}</h3>
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1">Who it&apos;s for</p>
                  <p className="text-xs text-white/50 leading-relaxed">{offer.who}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1">What you get</p>
                  <p className="text-xs text-white/50 leading-relaxed">{offer.get}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <span className="text-xs font-mono text-white/30">Typical: {offer.timeline}</span>
                <a
                  href="#contact"
                  className="text-xs text-white/40 hover:text-white font-medium transition-colors"
                >
                  Get a quote →
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.section>

      {/* Proof */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.14 }}
      >
        <h2 className="text-base font-semibold text-white mb-6">Background</h2>
        <GlassCard className="space-y-5">
          <ul className="space-y-2.5">
            {proofPoints.map((point) => (
              <li key={point} className="flex gap-2.5 text-sm">
                <CheckCircle2 size={16} className="text-white/30 flex-shrink-0 mt-0.5" />
                <span className="text-white/50 leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t border-white/[0.06]">
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-2.5">Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-[11px] font-mono text-white/40 bg-white/[0.04] border border-white/[0.08] rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.section>

      {/* How I work */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
      >
        <h2 className="text-base font-semibold text-white mb-1">How I work</h2>
        <p className="text-xs text-white/20 font-mono mb-6">
          // async-friendly, ~{OVERLAP_HOURS} overlap with US time zones
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {howIWork.map(({ step, title, desc }) => (
            <GlassCard key={step} padding="sm" className="space-y-2">
              <span className="text-xs font-mono text-white/20">{step}</span>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
            </GlassCard>
          ))}
        </div>
      </motion.section>

      {/* Selected work */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.26 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white">Selected work</h2>
          <Link to="/projects" className="text-xs text-white/40 hover:text-white font-mono transition-colors">
            all projects →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {selectedWork.map((work) => (
            <Link key={work.id} to={`/projects/${work.id}`} className="block group h-full">
              <GlassCard hoverable className="h-full flex flex-col gap-3 group-hover:border-white/[0.16] group-hover:-translate-y-0.5 transition-transform duration-300">
                <h3 className="text-sm font-semibold text-white leading-snug">{work.title}</h3>
                <div>
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1">Problem</p>
                  <p className="text-xs text-white/50 leading-relaxed">{work.problem}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1">What I built</p>
                  <p className="text-xs text-white/50 leading-relaxed">{work.built}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                  {work.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-mono bg-white/[0.04] border border-white/[0.07] rounded text-white/35"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-white/40 font-medium group-hover:text-white transition-colors pt-2 border-t border-white/[0.06]">
                  View case study →
                </span>
              </GlassCard>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.32 }}
      >
        <h2 className="text-base font-semibold text-white mb-6">FAQ</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <GlassCard key={q} padding="sm">
              <h3 className="text-sm font-semibold text-white mb-1.5">{q}</h3>
              <p className="text-xs text-white/45 leading-relaxed">{a}</p>
            </GlassCard>
          ))}
        </div>
      </motion.section>

      {/* Final CTA + contact form */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.38 }}
        className="scroll-mt-20"
      >
        <div className="text-center mb-8 max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            Tell me about the project
          </h2>
          <p className="text-sm text-white/40">
            A few lines is enough to start. I&apos;ll reply with questions or a quote.
          </p>
        </div>

        <GlassCard className="max-w-xl mx-auto">
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 size={32} className="text-white/60" />
              <p className="text-sm text-white/70 font-medium">Sent. I&apos;ll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 relative" noValidate>
              {/* Honeypot — hidden from real users, visible to naive bots */}
              <div className="absolute w-px h-px overflow-hidden opacity-0 -z-10" aria-hidden="true">
                <label htmlFor="hp_confirm">Leave this field empty</label>
                <input type="text" id="hp_confirm" name="hp_confirm" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label htmlFor="name" className="block text-xs font-medium text-white/50 mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-white/50 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="budget" className="block text-xs font-medium text-white/50 mb-1.5">
                  Budget range
                </label>
                <select
                  id="budget"
                  name="budget"
                  required
                  defaultValue=""
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                >
                  <option value="" disabled>Select a range</option>
                  {budgetRanges.map((range) => (
                    <option key={range} value={range} className="bg-surface text-white">
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="summary" className="block text-xs font-medium text-white/50 mb-1.5">
                  Project summary
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  required
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all resize-y"
                  placeholder="What are you building, and what do you need help with?"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-white/60 bg-white/[0.04] border border-white/[0.1] rounded-lg px-3.5 py-2.5">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Send'
                )}
              </button>

              <p className="text-[11px] text-white/25 text-center">
                Or skip the form —{' '}
                <a href={`mailto:${EMAIL}`} className="underline hover:text-white/50">
                  email me directly
                </a>
                .
              </p>
            </form>
          )}
        </GlassCard>
      </motion.section>
    </div>
  )
}
