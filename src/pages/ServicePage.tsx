import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { getService, services } from '../data/services'
import { projects } from '../data/projects'
import { posts } from '../data/posts'
import { CALENDLY_URL } from '../lib/contact'
import { absoluteUrl, breadcrumbLd, AUTHOR } from '../lib/seo'
import Breadcrumbs from '../components/Breadcrumbs'
import StaticFaq from '../components/StaticFaq'
import GlassCard from '../components/GlassCard'
import EnquiryForm from '../components/EnquiryForm'
import NotFound from './NotFound'

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>()
  const service = slug ? getService(slug) : undefined
  const path = service ? `/services/${service.slug}` : '/services'
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/hire' },
    { name: service?.navLabel ?? 'Service', path },
  ]

  usePageMeta(service?.title ?? 'Service not found | Kulshresth Jangid', service?.description, {
    canonical: service ? absoluteUrl(path) : undefined,
    noindex: !service,
    og: service ? { title: service.title, description: service.description } : undefined,
    jsonLd: service
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            '@id': `${absoluteUrl(path)}#service`,
            name: `${service.serviceType} by Kulshresth Jangid`,
            url: absoluteUrl(path),
            image: absoluteUrl('/og-image.png'),
            description: service.description,
            areaServed: [{ '@type': 'Place', name: 'Worldwide' }],
            serviceType: service.serviceType,
            provider: AUTHOR,
            founder: AUTHOR,
            availableLanguage: 'English',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Jaipur',
              addressRegion: 'Rajasthan',
              addressCountry: 'IN',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.h1,
            serviceType: service.serviceType,
            description: service.description,
            url: absoluteUrl(path),
            areaServed: 'Worldwide',
            provider: AUTHOR,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: service.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
          breadcrumbLd(crumbs),
        ]
      : undefined,
  })

  if (!service) return <NotFound />

  const relatedServices = service.related
    .map((s) => services.find((x) => x.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
  const relatedPosts = posts.filter((p) => p.serviceSlug === service.slug)

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 space-y-14">
      <motion.header initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
        <Breadcrumbs crumbs={crumbs} />
        <p className="eyebrow">{service.eyebrow}</p>
        <h1 className="display text-4xl sm:text-6xl text-white leading-[1.05]">{service.h1}</h1>
        <p className="text-lg text-white/75 leading-relaxed max-w-2xl">{service.intro}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cta={`service_${service.slug}_hero_call`}
            className="inline-flex items-center gap-2 pl-5 pr-4 py-3 rounded-full bg-signal text-ink text-sm font-medium hover:bg-white transition-colors"
          >
            Book a 20 minute call
            <CalendarDays size={16} />
          </a>
          <a
            href="#enquire"
            data-cta={`service_${service.slug}_hero_enquire`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 text-white/85 text-sm font-medium hover:border-signal hover:text-signal transition-colors"
          >
            Send an enquiry
            <ArrowRight size={16} />
          </a>
        </div>
      </motion.header>

      {service.sections.map((section) => (
        <section key={section.heading} className="space-y-4">
          <h2 className="display text-3xl sm:text-4xl text-white">{section.heading}</h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="text-white/75 leading-relaxed">
              {p}
            </p>
          ))}
        </section>
      ))}

      <section className="space-y-4">
        <h2 className="display text-3xl sm:text-4xl text-white">Stack</h2>
        <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
          {service.stack.map((t) => (
            <li key={t} className="px-3 py-1 text-xs font-mono text-white/70 bg-white/[0.05] border border-white/[0.12] rounded-md">
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-5">
        <h2 className="display text-3xl sm:text-4xl text-white">Measured outcomes from real projects</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {service.outcomes.map((o) => {
            const project = projects.find((p) => p.id === o.projectId)
            return (
              <GlassCard key={o.metric + o.anchor} padding="md" className="space-y-2">
                <p className="text-white font-semibold leading-snug">{o.metric}</p>
                <p className="text-sm text-white/65 leading-relaxed">{o.detail}</p>
                {project && (
                  <Link to={`/projects/${project.id}`} className="inline-flex items-center gap-1.5 text-sm text-signal hover:underline">
                    Read the {o.anchor}
                    <ArrowRight size={14} />
                  </Link>
                )}
              </GlassCard>
            )
          })}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="display text-3xl sm:text-4xl text-white">Frequently asked questions</h2>
        <StaticFaq items={service.faqs} />
      </section>

      {relatedPosts.length > 0 && (
        <section className="space-y-3">
          <h2 className="display text-3xl text-white">Related writing</h2>
          <ul className="space-y-2">
            {relatedPosts.map((p) => (
              <li key={p.slug}>
                <Link to={`/blog/${p.slug}`} className="text-signal hover:underline">
                  {p.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="enquire" className="scroll-mt-24 space-y-5">
        <h2 className="display text-3xl sm:text-4xl text-white">Tell me what you are building</h2>
        <p className="text-white/70 leading-relaxed max-w-2xl">
          Send two or three lines about the product and the problem. I read every enquiry myself and reply within one working day with a view on scope, whether I am the right fit and a fixed price if I am.
        </p>
        <GlassCard padding="lg">
          <EnquiryForm variant="full" source={`service-${service.slug}`} />
        </GlassCard>
      </section>

      <nav aria-label="Other services" className="border-t border-white/[0.1] pt-8">
        <h2 className="text-sm font-mono text-white/55 uppercase tracking-wider mb-3">Other services</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {relatedServices.map((s) => (
            <li key={s.slug}>
              <Link to={`/services/${s.slug}`} className="text-white/80 hover:text-signal transition-colors">
                {s.navLabel}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/projects" className="text-white/80 hover:text-signal transition-colors">
              All case studies
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
