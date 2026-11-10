import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { CALENDLY_URL as CALENDLY_LINK, EMAIL, WEB3FORMS_ACCESS_KEY } from '../lib/contact'
import GlassCard from '../components/GlassCard'

// Calendly's intro-call event is open 7-11pm IST weekdays, that window is
// ~13:30-17:30 UTC, i.e. roughly 8:30am-12:30pm US Eastern. Real overlap is
// with Eastern mornings; Pacific clients land in their very-early morning.
const OVERLAP_HOURS = '4 hours (US Eastern mornings)'

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
}

// Positioning follows HIRE_OFFER_POSITIONING.md: every long-running build-service
// ad in the research is a named package with fixed scope, fixed price, a timeline
// and a team size. So the flagship leads, the chatbot offer is positioned on
// ownership, and the audit stays a quiet upsell.
const flagship = {
  name: 'MVP Backend Sprint',
  promise: 'A working backend for your MVP in 3 weeks.',
  terms: ['Fixed scope', 'Fixed price', 'You own the code', 'One senior engineer, no handoffs'],
  who: 'Founders and small product teams with a validated idea who need the backend built properly and fast, without hiring a team.',
  scope: [
    'API design and database schema',
    'Authentication and role based access',
    'Core endpoints and background jobs',
    'Automated tests on the critical paths',
    'Docker, CI/CD and a production deploy',
    'Docs, a runbook and a handover walkthrough',
  ],
  timeline: '3 weeks for a typical MVP scope',
  price: 'Fixed price, quoted after a 20 minute call',
}

const chatbotOffer = {
  title: 'Your own chatbot backend',
  who: 'Teams that tried an off-the-shelf chatbot tool and hit its limits: rigid flows, per seat pricing, and your data in someone else’s cloud.',
  get: 'A chatbot backend you own and can shape: structured prompts, conversation state and memory, and real integrations into your systems. The same foundation I built Zigchat and its Bot Creation API on.',
  timeline: '2 to 4 weeks',
}

const auditOffer = {
  title: 'Already have a backend?',
  body: 'If it is slow, flaky or hard to deploy, a 1 to 2 week audit finds the cause and ranks the fixes by impact.',
}

const services = [
  {
    title: 'Backend and API Development',
    desc: 'Building the engine that runs behind an app or website, so it works fast, handles lots of users, and does not break.',
  },
  {
    title: 'LLM and AI Integration',
    desc: 'Adding AI features into an existing app or website, like a chatbot that actually answers customers, or smart automation that saves staff time.',
  },
  {
    title: 'Backend and Architecture Audits',
    desc: 'Reviewing an existing system to find what is slow, broken, or about to break, then fixing the root cause instead of a quick patch.',
  },
  {
    title: 'Workflow and AI Automation',
    desc: 'Automating repetitive manual work, like data entry or follow ups, using scripts and AI so people do not have to do it by hand.',
  },
  {
    title: 'Full Stack Delivery',
    desc: 'Building both what the customer sees, the app or website, and everything running behind it, as one complete package.',
  },
]

const proofPoints = [
  '4+ years of professional backend and full-stack engineering',
  'Built Zigchat: a no-code chatbot SaaS (Node.js, Express, TypeScript, SQL, NLP)',
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
  { step: '02', title: 'Scoped proposal', desc: 'A written proposal with fixed milestones and deliverables, you know what you’re getting and when before any work starts.' },
  { step: '03', title: 'Weekly demos', desc: 'Working software, shown weekly. No black-box stretches where you’re left guessing what’s happening.' },
  { step: '04', title: 'Handover with docs', desc: 'Clean handover: documented code, a runbook for what you own now, and a walkthrough, not a project that only I understand.' },
]

const selectedWork = [
  {
    id: 'social-saas',
    title: 'Kaizex: Marketing Operating System',
    problem: 'Content teams needed real conversational automation, not a scripted bot, running across a website widget and WhatsApp Business, with no existing tool offering content intelligence or a usable builder.',
    built: 'A visual, node-based pipeline builder (21+ node types) that drives real conversations across channels, landing in one unified inbox regardless of where the message came from. BYO-AI across five provider adapters.',
    stack: ['Java', 'Spring Boot', 'RabbitMQ', 'Redis', 'MariaDB', 'WhatsApp Cloud API'],
  },
  {
    id: 'leadgen-pro',
    title: 'LeadGen Pro: AI Lead Generation Engine',
    problem: 'B2B lead generation at any real volume gets expensive fast once you’re paying per API call for qualification and outreach copy.',
    built: 'A fully self-hosted pipeline: multi-source scraping, SHA-256 + fuzzy deduplication, and a local LLM (Mistral 7B via Ollama) doing two-pass qualification and personalised outreach, zero recurring AI cost.',
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
    a: `I'm based in Jaipur, India (IST, UTC+5:30). Expect roughly ${OVERLAP_HOURS} of real-time overlap with US business hours, plus async-friendly communication the rest of the day, written updates, recorded demos, and async code review so nothing waits on a live call.`,
  },
  {
    q: 'Who owns the code once the project is done?',
    a: 'You do, fully. Everything built under the engagement, code, docs, infrastructure configs, is yours on delivery. No retained rights, no licensing strings.',
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
  'Not sure yet: let’s discuss',
]

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function Hire() {
  usePageMeta(
    'MVP Backend in 3 Weeks | Kulshresth Jangid, Freelance Backend Engineer',
    'Fixed scope, fixed price MVP backend in 3 weeks. APIs, auth, tests, deploy and handover from one senior engineer, and you own the code. Node.js, TypeScript, Java.',
    {
      canonical: 'https://buildwithkulshresth.com/hire',
      og: {
        title: 'MVP Backend in 3 Weeks | Kulshresth Jangid, Freelance Backend Engineer',
        description: 'Fixed scope, fixed price MVP backend in 3 weeks from one senior engineer. You own the code.',
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
          name: 'Kulshresth Jangid: Freelance Backend Engineering',
          url: 'https://buildwithkulshresth.com/hire',
          image: 'https://buildwithkulshresth.com/og-image.png',
          description: 'Fixed scope, fixed price MVP backend builds in about 3 weeks, plus LLM/chatbot backends and backend audits, for early-stage startups.',
          areaServed: 'Worldwide',
          provider: { '@type': 'Person', name: 'Kulshresth Jangid' },
          serviceType: [
            'MVP Backend Development',
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

    // Honeypot, real users never fill a visually-hidden field. Bots that
    // blindly fill every input will. Deliberately not named "website" (or
    // anything else a browser's autofill heuristics commonly target),
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
        `Form isn't wired up yet, email me directly instead: ${EMAIL}`,
      )
      return
    }

    setStatus('submitting')
    setErrorMsg('')
    try {
      data.set('access_key', WEB3FORMS_ACCESS_KEY)
      data.set('subject', 'New freelance project inquiry, buildwithkulshresth.com/hire')
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
      setErrorMsg(`Something went wrong, email me directly instead: ${EMAIL}`)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-20">
      {/* Hero */}
      <motion.section {...fadeUp} className="space-y-6 max-w-3xl">
        <p className="eyebrow">Freelance / Fixed scope</p>
        <h1 className="display text-5xl sm:text-7xl text-white leading-[1.02]">
          A working backend for your MVP in <em className="text-signal">3 weeks.</em>
        </h1>
        <p className="text-lg text-white/70 leading-relaxed max-w-xl">
          Fixed scope, fixed price, and you own the code. One senior engineer, no handoffs. Node.js, TypeScript and
          Java/Spring Boot.
        </p>
        <div className="flex items-center gap-x-6 gap-y-3 flex-wrap pt-2">
          <a
            href={CALENDLY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 pl-6 pr-2 py-2 rounded-full bg-signal text-ink font-medium hover:bg-white transition-colors duration-200"
          >
            Book a free 20 minute call
            <span className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight size={17} />
            </span>
          </a>
          <a href={`mailto:${EMAIL}`} className="text-white/70 hover:text-white border-b border-white/25 hover:border-signal pb-0.5 transition-colors">
            or email me
          </a>
        </div>
      </motion.section>

      {/* What I build: flagship package first, then the two quieter offers */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        <h2 className="display text-4xl text-white mb-2">What I build</h2>
        <p className="text-sm text-white/50 mb-8">Pick the shape of help you need.</p>

        <GlassCard padding="lg" className="grid lg:grid-cols-5 gap-8 border-signal/30">
          <div className="lg:col-span-3 flex flex-col gap-5">
            <p className="eyebrow text-signal">The main package</p>
            <div>
              <h3 className="display text-4xl text-white leading-tight">{flagship.name}</h3>
              <p className="mt-2 text-xl text-white/80">{flagship.promise}</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {flagship.terms.map((t) => (
                <li key={t} className="px-3 py-1.5 rounded-full border border-signal/40 text-signal text-xs font-mono">
                  {t}
                </li>
              ))}
            </ul>
            <div>
              <p className="eyebrow mb-1.5">Who it is for</p>
              <p className="text-white/65 leading-relaxed">{flagship.who}</p>
            </div>
            <div className="mt-auto pt-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono text-xs text-white/50 space-y-1">
                <p>Timeline: {flagship.timeline}</p>
                <p>Price: {flagship.price}</p>
              </div>
              <a href="#contact" className="inline-flex items-center gap-1.5 text-white hover:text-signal font-medium transition-colors">
                Get a fixed quote <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="lg:col-span-2 lg:border-l lg:border-white/[0.08] lg:pl-8">
            <p className="eyebrow mb-4">What is included</p>
            <ul className="space-y-3">
              {flagship.scope.map((item) => (
                <li key={item} className="flex gap-2.5 text-white/75 leading-snug">
                  <CheckCircle2 size={17} className="text-signal flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <GlassCard hoverable padding="lg" className="flex flex-col gap-4">
            <h3 className="display text-3xl text-white leading-tight">{chatbotOffer.title}</h3>
            <div>
              <p className="eyebrow mb-1.5">Who it is for</p>
              <p className="text-white/65 leading-relaxed">{chatbotOffer.who}</p>
            </div>
            <div className="flex-1">
              <p className="eyebrow mb-1.5">What you get</p>
              <p className="text-white/65 leading-relaxed">{chatbotOffer.get}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <span className="font-mono text-xs text-white/50">Typical: {chatbotOffer.timeline}</span>
              <a href="#contact" className="text-sm text-white/70 hover:text-signal font-medium transition-colors">
                Get a quote &rarr;
              </a>
            </div>
          </GlassCard>

          <div className="rounded-xl border border-dashed border-white/15 p-8 flex flex-col gap-4">
            <h3 className="display text-3xl text-white leading-tight">{auditOffer.title}</h3>
            <p className="text-white/60 leading-relaxed flex-1">{auditOffer.body}</p>
            <a href="#contact" className="self-start text-sm text-white/70 hover:text-signal font-medium transition-colors">
              Ask about an audit &rarr;
            </a>
          </div>
        </div>
      </motion.section>

      {/* Full services list */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.11 }}
      >
        <h2 className="display text-4xl text-white mb-2">Services</h2>
        <p className="text-sm text-white/50 mb-8">
          Everything above comes together from this list.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(({ title, desc }) => (
            <GlassCard key={title} hoverable padding="md" className="space-y-2">
              <h3 className="text-sm font-semibold text-white leading-snug">{title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
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
        <h2 className="display text-4xl text-white mb-6">Background</h2>
        <GlassCard className="space-y-5">
          <ul className="space-y-2.5">
            {proofPoints.map((point) => (
              <li key={point} className="flex gap-2.5 text-sm">
                <CheckCircle2 size={16} className="text-white/30 flex-shrink-0 mt-0.5" />
                <span className="text-white/70 leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t border-white/[0.06]">
            <p className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-2.5">Stack</p>
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
        <h2 className="display text-4xl text-white mb-1">How I work</h2>
        <p className="text-xs text-white/20 font-mono mb-6">
          // async-friendly, ~{OVERLAP_HOURS} overlap with US time zones
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {howIWork.map(({ step, title, desc }) => (
            <GlassCard key={step} padding="sm" className="space-y-2">
              <span className="text-xs font-mono text-white/45">{step}</span>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
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
          <h2 className="display text-4xl text-white">Selected work</h2>
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
                  <p className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1">Problem</p>
                  <p className="text-sm text-white/65 leading-relaxed">{work.problem}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1">What I built</p>
                  <p className="text-sm text-white/65 leading-relaxed">{work.built}</p>
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
        <h2 className="display text-4xl text-white mb-6">FAQ</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <GlassCard key={q} padding="sm">
              <h3 className="text-sm font-semibold text-white mb-1.5">{q}</h3>
              <p className="text-sm text-white/65 leading-relaxed">{a}</p>
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
          <h2 className="display text-5xl text-white mb-3">
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
              {/* Honeypot, hidden from real users, visible to naive bots */}
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
                Or skip the form,{' '}
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
