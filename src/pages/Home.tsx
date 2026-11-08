import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, Box, MessageCircle, Rocket, ShieldCheck, Zap } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import EnquiryForm from '../components/EnquiryForm'
import FaqList, { type FaqItem } from '../components/FaqList'
import TestimonialCarousel from '../components/TestimonialCarousel'
import { testimonials as allTestimonials } from '../data/testimonials'

// The one person who hired me for freelance work goes first.
const testimonials = [...allTestimonials].sort((a, b) => Number(b.id === 'nikhil-saini') - Number(a.id === 'nikhil-saini'))

/*
 * One page, one job: get a qualified project enquiry. The enquiry form sits in
 * the hero, the proof sits underneath it, and everything else answers a
 * question a buyer has before they write. Offer detail lives on /hire.
 */

const stats = [
  { icon: Zap, value: '4+ years', label: 'of backend engineering' },
  { icon: Box, value: '1M+', label: 'scheduled tasks per instance' },
  { icon: ShieldCheck, value: '-40%', label: 'database latency (CarDekho)' },
]

const services = [
  {
    icon: Rocket,
    title: 'MVP backend development',
    body: 'Build your idea on a reliable, scalable backend. Fixed scope, fixed price, live in about three weeks.',
  },
  {
    icon: Zap,
    title: 'Backend performance optimisation',
    body: 'Find the bottlenecks, fix them, and measure the difference. Faster responses and fewer 2am pages.',
  },
  {
    icon: MessageCircle,
    title: 'Custom chatbot development',
    body: 'A chatbot backend you own and can shape, wired into your data and tools, not another SaaS subscription.',
  },
]

const weeks = [
  { n: 'Week 1', title: 'Foundation', body: 'Schema, authentication and API design, agreed with you before code.' },
  { n: 'Week 2', title: 'Build', body: 'Core endpoints, background jobs and tests on the critical paths.' },
  { n: 'Week 3', title: 'Ship', body: 'Production deploy, CI/CD, docs and a handover walkthrough.' },
]

const caseStudies = [
  {
    company: 'CarDekho',
    value: -40,
    suffix: '%',
    label: 'Database latency',
    body: 'Optimised queries, indexing and caching for faster, steadier responses.',
    to: '/projects/api-performance',
  },
  {
    company: 'Rampwin',
    value: -28,
    suffix: '%',
    label: 'Incident recovery time',
    body: 'Split a monolith into bounded services so failures stay contained.',
    to: '/projects/microservices-migration',
  },
  {
    company: 'Equinix',
    value: -30,
    suffix: '%',
    label: 'Deployment failures',
    body: 'Canary releases with automatic rollback for steadier deployments.',
    to: '/projects/cicd-automation',
  },
]

const faqs: FaqItem[] = [
  {
    q: 'Can you guarantee a timeline?',
    a: 'For a defined MVP scope I put the timeline in writing before work starts, typically three weeks. If the scope changes, we agree the new timeline before I continue.',
  },
  {
    q: 'Do you work with startups?',
    a: 'Yes. Early stage startups and small product teams are who I build for: founders who need a solid backend without hiring a full team.',
  },
  {
    q: 'What technologies do you use?',
    a: 'Node.js and TypeScript, or Java with Spring Boot, for services. PostgreSQL, MySQL, MongoDB and Redis for data. Docker, Kubernetes and CI/CD for delivery.',
  },
  {
    q: 'Do you provide post-launch support?',
    a: 'Every project ends with documentation, a runbook and a walkthrough. If you want me to stay on, I can support and extend the system as ongoing hourly work.',
  },
  {
    q: 'What are your engagement models?',
    a: 'Fixed scope projects with defined milestones, or ongoing hourly work once we have a working rhythm. We agree which fits before any contract.',
  },
  {
    q: 'How do we get started?',
    a: 'Send the enquiry form or book a 20 minute call. I will reply within one working day with questions or a fixed quote.',
  },
]

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-5 mb-10">
      <span className="h-px flex-1 bg-white/[0.14]" aria-hidden />
      <h2 className="display text-3xl sm:text-4xl text-white text-center">{children}</h2>
      <span className="h-px flex-1 bg-white/[0.14]" aria-hidden />
    </div>
  )
}

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!inView || reduce) {
      el.textContent = `${inView || reduce ? to : 0}${suffix}`
      return
    }
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, reduce, to, suffix])

  return <span ref={ref}>{`0${suffix}`}</span>
}

/* A headline line that slides up out of a mask. */
function Line({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.1em]">
      <motion.span
        className="block"
        initial={{ y: '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export default function Home() {
  usePageMeta(
    'Kulshresth Jangid | Freelance Backend Engineer for SaaS Startups',
    'Build your SaaS product with confidence. A production-ready backend in 3 weeks, with clean architecture, scalability and business focus. Freelance backend engineer, Node.js, TypeScript and Java.',
    {
      canonical: 'https://buildwithkulshresth.com/',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    },
  )

  const heroRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const weeksRef = useRef<HTMLDivElement>(null)
  const weeksInView = useInView(weeksRef, { once: true, margin: '-80px' })

  function onHeroMove(e: React.PointerEvent<HTMLElement>) {
    if (reduce || e.pointerType === 'touch') return
    const el = heroRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div>
      {/* Hero: promise on the left, the enquiry form on the right */}
      <section
        ref={heroRef}
        onPointerMove={onHeroMove}
        className="spotlight relative overflow-hidden border-b border-white/[0.1]"
      >
        <div className="rule-grid absolute inset-0 pointer-events-none" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-14 sm:pb-20 grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.16] bg-surface/70 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80 mb-7"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-signal" />
              </span>
              Freelance backend engineer
            </motion.p>

            <h1 className="display text-[3rem] sm:text-7xl lg:text-[5rem] leading-[1.02] text-white">
              <Line delay={0.1}>Build your SaaS product</Line>
              <Line delay={0.24}>
                with <em className="text-signal">confidence.</em>
              </Line>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-7 max-w-xl text-lg sm:text-xl leading-relaxed text-white/80"
            >
              Get a production-ready backend, built in 3 weeks, with clean architecture, scalability and business focus.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 sm:divide-x divide-white/[0.14] max-w-2xl"
            >
              {stats.map(({ icon: Icon, value, label }) => (
                <li key={label} className="sm:px-6 first:sm:pl-0 flex sm:block items-center gap-4">
                  <Icon size={26} strokeWidth={1.5} className="text-signal sm:mb-3 flex-shrink-0" />
                  <div>
                    <p className="display text-3xl text-white leading-none">{value}</p>
                    <p className="mt-1.5 text-sm text-white/65 leading-snug">{label}</p>
                  </div>
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl border border-white/[0.16] bg-surface/80 backdrop-blur-sm p-6 sm:p-7 shadow-[0_20px_60px_-30px_rgb(0_0_0/0.5)]">
              <h2 className="display text-3xl text-white">Tell me about your project.</h2>
              <p className="mt-1.5 mb-5 text-sm text-white/65">I review your requirements and get back to you within one working day.</p>
              <EnquiryForm variant="full" submitLabel="Send enquiry" source="hero" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* What clients say */}
      {testimonials.some((t) => t.approved) && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <Reveal>
            <SectionTitle>What clients say</SectionTitle>
            <TestimonialCarousel testimonials={testimonials} />
          </Reveal>
        </section>
      )}

      {/* Services */}
      <section className="border-y border-white/[0.1] bg-surface/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <Reveal>
            <SectionTitle>Services</SectionTitle>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {services.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <Link
                  to="/hire"
                  className="group h-full rounded-2xl border border-white/[0.14] bg-ink/40 p-7 flex flex-col gap-4 hover:border-signal/60 hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon size={30} strokeWidth={1.5} className="text-signal" />
                  <h3 className="display text-2xl text-white leading-tight">{title}</h3>
                  <p className="text-white/70 leading-relaxed flex-1">{body}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm text-white group-hover:text-signal transition-colors">
                    Learn more <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About, with the 3 week plan in place of a stock photo */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal>
            <div ref={weeksRef} className="rounded-2xl border border-white/[0.14] bg-surface p-7 sm:p-8">
              <p className="eyebrow mb-1">How the 3 weeks go</p>
              <p className="text-sm text-white/60 mb-7">Fixed scope, fixed price, you own the code.</p>
              <ol className="relative space-y-7">
                <span className="absolute left-[11px] top-2 bottom-2 w-px bg-white/[0.14]" aria-hidden />
                <motion.span
                  className="absolute left-[11px] top-2 w-px bg-signal origin-top"
                  style={{ height: 'calc(100% - 1rem)' }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: weeksInView ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 1.6, ease: 'easeInOut' }}
                  aria-hidden
                />
                {weeks.map((w) => (
                  <li key={w.n} className="relative pl-10">
                    <span className="absolute left-0 top-1 w-6 h-6 rounded-full border border-signal bg-ink flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-signal" />
                    </span>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">{w.n}</p>
                    <p className="display text-2xl text-white mt-0.5">{w.title}</p>
                    <p className="text-white/70 mt-1 leading-relaxed">{w.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow text-signal mb-3">About me</p>
            <h2 className="display text-4xl sm:text-5xl text-white leading-[1.05]">
              A backend engineer with a <em className="text-signal">product mindset.</em>
            </h2>
            <p className="mt-6 text-lg text-white/75 leading-relaxed max-w-xl">
              I&rsquo;m Kulshresth Jangid, a backend engineer with 4+ years of experience building scalable systems for startups and
              enterprises like CarDekho, Rampwin and Equinix.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-white hover:border-signal hover:text-signal transition-colors"
            >
              Know more about me <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Case studies */}
      <section className="border-y border-white/[0.1] bg-surface/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <Reveal>
            <SectionTitle>Case studies</SectionTitle>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {caseStudies.map((c, i) => (
              <Reveal key={c.company} delay={i * 0.08}>
                <Link
                  to={c.to}
                  className="group h-full rounded-2xl border border-white/[0.14] bg-ink/40 p-7 flex flex-col gap-3 hover:border-signal/60 hover:-translate-y-1 transition-all duration-300"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/70">{c.company}</p>
                  <p className="display text-6xl text-signal tabular-nums">
                    <CountUp to={c.value} suffix={c.suffix} />
                  </p>
                  <p className="text-white font-medium">{c.label}</p>
                  <p className="text-white/65 leading-relaxed flex-1">{c.body}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm text-white group-hover:text-signal transition-colors">
                    Read case study <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact and FAQ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <Reveal>
            <div id="contact" className="scroll-mt-24 rounded-2xl border border-white/[0.16] bg-surface p-7 sm:p-8">
              <h2 className="display text-4xl text-white">Let&rsquo;s discuss your project.</h2>
              <p className="mt-2 mb-6 text-white/70">Share a few details and I&rsquo;ll get back to you.</p>
              <EnquiryForm variant="compact" submitLabel="Get in touch" source="contact" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div id="faq" className="scroll-mt-24">
              <div className="flex items-end justify-between gap-4 mb-5">
                <h2 className="display text-4xl text-white">Frequently asked questions</h2>
              </div>
              <FaqList items={faqs} />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
