import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import LatencyTrace from '../components/LatencyTrace'
import { CALENDLY_URL } from '../components/Navbar'
import { projects } from '../data/projects'
import { testimonials } from '../data/testimonials'

const EMAIL = 'jangidkulshresth@gmail.com'

const stack = [
  'Java', 'Spring Boot', 'Node.js', 'TypeScript', 'Kafka', 'RabbitMQ', 'Redis',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Kubernetes', 'Docker', 'Prometheus', 'Terraform',
]

const proof = [
  { value: 40, suffix: '%', label: 'lower p99 database latency', where: 'CarDekho', to: '/projects/api-performance' },
  { value: 30, suffix: '%', label: 'fewer failed deployments', where: 'Equinix', to: '/projects/cicd-automation' },
  { value: 28, suffix: '%', label: 'faster recovery from incidents', where: 'Rampwin', to: '/projects/microservices-migration' },
  { value: 1, suffix: 'M+', label: 'scheduled tasks per instance', where: 'Kaizex', to: '/projects/social-saas' },
]

const services = [
  {
    title: 'LLM and chatbot backends',
    body: 'Support automation, internal assistants and booking flows that run on real data and real integrations, not a demo script.',
    time: '2 to 4 weeks',
  },
  {
    title: 'API and microservice builds',
    body: 'New services or extensions to existing ones, with a clean schema, auth, tests that catch regressions, and no surprises in production.',
    time: '2 to 4 weeks',
  },
  {
    title: 'Backend audit and scaling',
    body: 'A straight answer on why your backend is slow or flaky, the fixes ranked by impact, and a deploy setup that holds under traffic.',
    time: '1 to 2 weeks',
  },
]

const steps = [
  { n: '01', title: 'Intro call', body: '20 minutes to understand the problem. No pitch.' },
  { n: '02', title: 'Scoped proposal', body: 'Fixed milestones and deliverables, in writing, before any work starts.' },
  { n: '03', title: 'Weekly demos', body: 'Working software every week, so nothing is a black box.' },
  { n: '04', title: 'Clean handover', body: 'Docs, a runbook and a walkthrough. Yours to own from day one.' },
]

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
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
      duration: 1.6,
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
    <span className="block overflow-hidden pb-[0.08em]">
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
    'Kulshresth Jangid | Freelance Backend Engineer for Startups',
    'Freelance backend engineer. I cut API latency, harden deployments and build LLM and chatbot backends for startups and product teams. Node.js, TypeScript, Java. Remote from India.',
    {
      canonical: 'https://buildwithkulshresth.com/',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What does Kulshresth Jangid do?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Freelance backend engineering: API performance, microservices, deployment reliability, and LLM or chatbot backends, using Node.js, TypeScript and Java.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Kulshresth Jangid available for freelance projects?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. He takes a small number of fixed scope projects at a time, working remotely from Jaipur, India.',
            },
          },
        ],
      },
    },
  )

  const heroRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const approved = testimonials.filter((t) => t.approved)
  const featured = approved.find((t) => t.id === 'nikhil-saini') ?? approved[0]
  const others = approved.filter((t) => t.id !== featured?.id).slice(0, 3)
  const work = projects.slice(0, 4)

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
      {/* Hero */}
      <section
        ref={heroRef}
        onPointerMove={onHeroMove}
        className="spotlight relative overflow-hidden border-b border-white/[0.08]"
      >
        <div className="rule-grid absolute inset-0 pointer-events-none" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-16 sm:pb-24 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 xl:col-span-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="eyebrow flex items-center gap-2.5 mb-7"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-signal" />
              </span>
              Freelance backend engineer, remote
            </motion.p>

            <h1 className="display text-[2.75rem] sm:text-6xl lg:text-[4.4rem] leading-[1.02] text-white">
              <Line delay={0.1}>Slow backends,</Line>
              <Line delay={0.22}>
                made <em className="text-signal">fast.</em>
              </Line>
              <Line delay={0.34}>Fragile systems,</Line>
              <Line delay={0.46}>
                made <em className="text-signal">calm.</em>
              </Line>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-white/65"
            >
              I help startups and product teams cut latency, stop the 2am pages, and ship services that hold up under real
              traffic. Four years in production at CarDekho, Rampwin and Equinix.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
            >
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 pl-6 pr-2 py-2 rounded-full bg-signal text-ink font-medium hover:bg-white transition-colors duration-200"
              >
                Book a 20 minute call
                <span className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight size={17} />
                </span>
              </a>
              <a href="#proof" className="group inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <span className="border-b border-white/30 group-hover:border-signal pb-0.5 transition-colors">See the proof</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.15 }}
              className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40"
            >
              Worked with teams at <span className="text-white/70">CarDekho</span> · <span className="text-white/70">Rampwin</span> ·{' '}
              <span className="text-white/70">Equinix</span> · <span className="text-white/70">Bombaywala</span>
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 xl:col-span-6"
          >
            <LatencyTrace />
          </motion.div>
        </div>
      </section>

      {/* Stack marquee */}
      <div className="border-b border-white/[0.08] overflow-hidden py-4" aria-label="Technology I work with">
        <div className="flex w-max animate-marquee gap-10 font-mono text-sm text-white/40">
          {[...stack, ...stack].map((s, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap" aria-hidden={i >= stack.length}>
              {s}
              <span className="w-1 h-1 rounded-full bg-signal/70" />
            </span>
          ))}
        </div>
      </div>

      {/* Proof */}
      <section id="proof" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28 scroll-mt-20">
        <Reveal>
          <p className="eyebrow mb-4">Proof</p>
          <h2 className="display text-4xl sm:text-5xl lg:text-6xl text-white max-w-3xl leading-[1.05]">
            Numbers I can point to, <span className="text-white/45">and the work behind each one.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 border-t border-l border-white/[0.09]">
          {proof.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.08} className="border-r border-b border-white/[0.09]">
              <Link to={p.to} className="group block h-full p-6 sm:p-8 hover:bg-surface transition-colors duration-300">
                <div className="display text-6xl sm:text-7xl text-white group-hover:text-signal transition-colors duration-300 tabular-nums">
                  <CountUp to={p.value} suffix={p.suffix} />
                </div>
                <p className="mt-4 text-sm sm:text-base text-white/70 leading-snug">{p.label}</p>
                <p className="mt-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                  {p.where}
                  <ArrowUpRight size={15} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-white/[0.08] bg-surface/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">What I take on</p>
              <h2 className="display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">Three ways to work together.</h2>
            </div>
            <Link to="/hire" className="group inline-flex items-center gap-2 text-white/80 hover:text-white">
              <span className="border-b border-white/30 group-hover:border-signal pb-0.5 transition-colors">How engagements work</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="group h-full rounded-2xl border border-white/[0.09] bg-ink p-7 flex flex-col gap-5 hover:border-signal/60 hover:-translate-y-1 transition-all duration-300">
                  <span className="display text-5xl text-white/25 group-hover:text-signal transition-colors duration-300">0{i + 1}</span>
                  <h3 className="display text-3xl text-white leading-tight">{s.title}</h3>
                  <p className="text-white/60 leading-relaxed flex-1">{s.body}</p>
                  <span className="self-start font-mono text-[11px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full border border-white/15 text-white/60">
                    {s.time}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">Selected work</p>
            <h2 className="display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">Systems that run in production.</h2>
          </div>
          <Link to="/projects" className="group inline-flex items-center gap-2 text-white/80 hover:text-white">
            <span className="border-b border-white/30 group-hover:border-signal pb-0.5 transition-colors">All case studies</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        <div className="mt-12 border-t border-white/[0.09]">
          {work.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <Link
                to={`/projects/${p.id}`}
                className="group grid grid-cols-12 gap-4 items-start py-7 sm:py-9 border-b border-white/[0.09] hover:pl-3 transition-all duration-300"
              >
                <span className="col-span-2 sm:col-span-1 font-mono text-xs text-white/35 pt-2">0{i + 1}</span>
                <div className="col-span-10 sm:col-span-7">
                  <h3 className="display text-3xl sm:text-4xl text-white group-hover:text-signal transition-colors duration-300 leading-tight">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-white/60 leading-relaxed max-w-2xl">{p.shortDescription}</p>
                </div>
                <div className="col-span-10 col-start-3 sm:col-span-4 sm:col-start-auto flex sm:justify-end items-start gap-4">
                  <div className="flex flex-wrap sm:justify-end gap-1.5">
                    {p.techStack.slice(0, 4).map((t) => (
                      <span key={t} className="px-2.5 py-1 text-[11px] font-mono rounded-full border border-white/12 text-white/50">
                        {t}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight size={22} className="hidden sm:block flex-shrink-0 text-white/30 group-hover:text-signal group-hover:rotate-12 transition-all" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {featured && (
        <section className="border-y border-white/[0.08] bg-surface/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
            <Reveal>
              <p className="eyebrow mb-10">What people say</p>
              <blockquote>
                <p className="display text-3xl sm:text-4xl lg:text-5xl leading-[1.15] text-white max-w-5xl">
                  <span className="text-signal">“</span>
                  {featured.quote}
                  <span className="text-signal">”</span>
                </p>
                <footer className="mt-8 flex items-center gap-4">
                  <span className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center font-mono text-xs text-white/70">
                    {featured.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <div>
                    <p className="text-white font-medium">
                      {featured.linkedinUrl ? (
                        <a href={featured.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-signal transition-colors">
                          {featured.name}
                        </a>
                      ) : (
                        featured.name
                      )}
                    </p>
                    <p className="font-mono text-xs text-white/45">
                      {featured.role}, {featured.company}
                    </p>
                  </div>
                </footer>
              </blockquote>
            </Reveal>

            {others.length > 0 && (
              <div className="mt-16 grid md:grid-cols-3 gap-5">
                {others.map((t, i) => (
                  <Reveal key={t.id} delay={i * 0.1}>
                    <figure className="h-full rounded-2xl border border-white/[0.09] bg-ink p-6 flex flex-col gap-5">
                      <blockquote className="text-white/70 leading-relaxed flex-1">{t.quote}</blockquote>
                      <figcaption className="pt-4 border-t border-white/[0.08]">
                        <p className="text-sm text-white font-medium">
                          {t.linkedinUrl ? (
                            <a href={t.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-signal transition-colors">
                              {t.name}
                            </a>
                          ) : (
                            t.name
                          )}
                        </p>
                        <p className="font-mono text-[11px] text-white/45 mt-0.5">
                          {t.role}
                          {t.company ? `, ${t.company}` : ''}
                        </p>
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Process */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <Reveal>
          <p className="eyebrow mb-4">How it works</p>
          <h2 className="display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] max-w-3xl">
            No black boxes. You see progress every week.
          </h2>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="border-t border-white/20 pt-5">
                <span className="font-mono text-xs text-signal">{s.n}</span>
                <h3 className="display text-3xl text-white mt-3">{s.title}</h3>
                <p className="mt-3 text-white/60 leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden border-t border-white/[0.08]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_120%,rgba(176,228,204,0.22),transparent_60%)]" aria-hidden />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-24 sm:py-36 text-center">
          <Reveal>
            <h2 className="display text-5xl sm:text-7xl lg:text-8xl text-white leading-[1.02]">
              Have a slow or shaky backend? <em className="text-signal">Let&rsquo;s look at it.</em>
            </h2>
            <p className="mt-8 text-lg text-white/65 max-w-xl mx-auto leading-relaxed">
              Twenty minutes, no pitch. You describe the problem and I tell you honestly whether I can help.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 pl-7 pr-2.5 py-2.5 rounded-full bg-signal text-ink font-medium hover:bg-white transition-colors duration-200"
              >
                Book a 20 minute call
                <span className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight size={18} />
                </span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="px-7 py-3.5 rounded-full border border-white/25 text-white hover:border-white hover:bg-white/5 transition-colors"
              >
                {EMAIL}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
