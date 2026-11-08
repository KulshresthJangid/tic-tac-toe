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

/*
 * Page structure follows one rule: if a section does not raise the share of
 * qualified visitors who book a call, it does not belong here. Offers, process
 * and pricing detail live on /hire for people who want them.
 */

// Top three reasons a founder hesitates to hire a freelancer, most common first.
const objections = [
  {
    q: 'Will it hold up in production?',
    a: 'Four years running real traffic at CarDekho, Rampwin and Equinix. Every number on this page comes from a system I shipped.',
  },
  {
    q: 'What will it cost, and what if scope drifts?',
    a: 'Fixed scope and milestones, agreed in writing before any work starts. You own the code the day it is delivered.',
  },
  {
    q: 'Can we work across time zones?',
    a: 'About four hours of live overlap with US Eastern mornings, plus a written update and a working demo every week.',
  },
]

const proof = [
  { value: 40, suffix: '%', label: 'lower p99 database latency', where: 'CarDekho', to: '/projects/api-performance' },
  { value: 30, suffix: '%', label: 'fewer failed deployments', where: 'Equinix', to: '/projects/cicd-automation' },
  { value: 28, suffix: '%', label: 'faster incident recovery', where: 'Rampwin', to: '/projects/microservices-migration' },
  { value: 1, suffix: 'M+', label: 'scheduled tasks per instance', where: 'Kaizex', to: '/projects/social-saas' },
]

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
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
      duration: 1.5,
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

function CallButton({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const lg = size === 'lg'
  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2.5 rounded-full bg-signal text-ink font-medium hover:bg-white transition-colors duration-200 ${
        lg ? 'pl-7 pr-2.5 py-2.5 text-base' : 'pl-6 pr-2 py-2'
      }`}
    >
      Book a free 20 minute call
      <span
        className={`${lg ? 'w-10 h-10' : 'w-9 h-9'} rounded-full bg-ink text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300`}
      >
        <ArrowUpRight size={lg ? 18 : 17} />
      </span>
    </a>
  )
}

export default function Home() {
  usePageMeta(
    'Kulshresth Jangid | Freelance Backend Engineer for Startups',
    'Slow backend? I find what is slowing your API down, fix it, and show you the numbers. Freelance backend engineer for startups. Node.js, TypeScript, Java. Remote from India.',
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
  const others = approved.filter((t) => t.id !== featured?.id).slice(0, 2)
  const work = projects.slice(0, 3)

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
      {/* 1. Hero: one promise, one clarifying line, proof as the image, one button */}
      <section
        ref={heroRef}
        onPointerMove={onHeroMove}
        className="spotlight relative overflow-hidden border-b border-white/[0.08]"
      >
        <div className="rule-grid absolute inset-0 pointer-events-none" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-16 sm:pb-24 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6">
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
              Freelance backend engineer, taking new projects
            </motion.p>

            <h1 className="display text-[3.1rem] sm:text-7xl lg:text-[5.2rem] leading-[1] text-white">
              <Line delay={0.1}>Slow backend?</Line>
              <Line delay={0.25}>
                I&rsquo;ll make it <em className="text-signal">fast.</em>
              </Line>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-white/70"
            >
              I find what is slowing your API down, fix it, and show you the numbers. At CarDekho that meant p99 database
              latency down 40%.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-9"
            >
              <CallButton />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <LatencyTrace />
          </motion.div>
        </div>
      </section>

      {/* 2. Three objections, most common first */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-3 gap-x-10 gap-y-10">
          {objections.map((o, i) => (
            <Reveal key={o.q} delay={i * 0.08}>
              <div className="border-t border-white/20 pt-5 h-full">
                <span className="font-mono text-xs text-signal">0{i + 1}</span>
                <h2 className="display text-3xl text-white mt-3 leading-tight">{o.q}</h2>
                <p className="mt-3 text-white/65 leading-relaxed">{o.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3. Social proof, underneath */}
      <section id="proof" className="border-y border-white/[0.08] bg-surface/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow mb-4">Proof</p>
            <h2 className="display text-4xl sm:text-5xl text-white leading-[1.05] max-w-3xl">
              Numbers from teams I have worked with.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 border-t border-l border-white/[0.09]">
            {proof.map((p, i) => (
              <Reveal key={p.label} delay={i * 0.07} className="border-r border-b border-white/[0.09]">
                <Link to={p.to} className="group block h-full p-6 sm:p-8 hover:bg-ink/60 transition-colors duration-300">
                  <div className="display text-6xl sm:text-7xl text-white group-hover:text-signal transition-colors duration-300 tabular-nums">
                    <CountUp to={p.value} suffix={p.suffix} />
                  </div>
                  <p className="mt-4 text-sm sm:text-base text-white/70 leading-snug">{p.label}</p>
                  <p className="mt-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                    {p.where}
                    <ArrowUpRight size={15} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>

          {featured && (
            <Reveal className="mt-16">
              <blockquote>
                <p className="display text-3xl sm:text-4xl lg:text-5xl leading-[1.15] text-white max-w-5xl">
                  <span className="text-signal">&ldquo;</span>
                  {featured.quote}
                  <span className="text-signal">&rdquo;</span>
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
          )}

          {others.length > 0 && (
            <div className="mt-12 grid md:grid-cols-2 gap-5">
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

      {/* 4. Selected work: three rows, no extras */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display text-4xl sm:text-5xl text-white leading-[1.05]">Recent work</h2>
          <Link to="/projects" className="group inline-flex items-center gap-2 text-white/80 hover:text-white">
            <span className="border-b border-white/30 group-hover:border-signal pb-0.5 transition-colors">All case studies</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        <div className="mt-10 border-t border-white/[0.09]">
          {work.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <Link
                to={`/projects/${p.id}`}
                className="group flex items-start justify-between gap-6 py-7 sm:py-8 border-b border-white/[0.09] hover:pl-3 transition-all duration-300"
              >
                <div>
                  <h3 className="display text-3xl sm:text-4xl text-white group-hover:text-signal transition-colors duration-300 leading-tight">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-white/60 leading-relaxed max-w-2xl">{p.shortDescription}</p>
                </div>
                <ArrowUpRight size={22} className="mt-2 flex-shrink-0 text-white/30 group-hover:text-signal transition-colors" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. One last ask */}
      <section className="relative overflow-hidden border-t border-white/[0.08]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_120%,rgba(176,228,204,0.2),transparent_60%)]" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
          <Reveal>
            <h2 className="display text-5xl sm:text-7xl text-white leading-[1.02]">
              Tell me what is slow. <em className="text-signal">I&rsquo;ll tell you if I can fix it.</em>
            </h2>
            <div className="mt-10 flex justify-center">
              <CallButton size="lg" />
            </div>
            <p className="mt-6 text-sm text-white/55">
              Prefer email?{' '}
              <a href={`mailto:${EMAIL}`} className="text-white/80 hover:text-signal transition-colors">
                {EMAIL}
              </a>{' '}
              or see{' '}
              <Link to="/hire" className="text-white/80 hover:text-signal transition-colors">
                what I take on and how I work
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
