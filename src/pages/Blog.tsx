import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'
import { posts } from '../data/posts'
import { absoluteUrl, breadcrumbLd, AUTHOR } from '../lib/seo'
import Breadcrumbs from '../components/Breadcrumbs'
import GlassCard from '../components/GlassCard'

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
]

export default function Blog() {
  usePageMeta(
    'Backend Engineering Blog | Kulshresth Jangid',
    'Technical notes from real backend projects: webhook relays, SLO burn-rate alerting and multi-tenant OIDC, with code and the numbers behind them.',
    {
      canonical: absoluteUrl('/blog'),
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Backend Engineering Blog: Kulshresth Jangid',
          url: absoluteUrl('/blog'),
          author: AUTHOR,
          blogPost: posts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.h1,
            url: absoluteUrl(`/blog/${p.slug}`),
            datePublished: p.datePublished,
            dateModified: p.dateModified,
          })),
        },
        breadcrumbLd(crumbs),
      ],
    },
  )

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 space-y-10">
      <motion.header initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">
        <Breadcrumbs crumbs={crumbs} />
        <p className="eyebrow">Blog</p>
        <h1 className="display text-4xl sm:text-6xl text-white leading-[1.05]">Notes from real backend projects</h1>
        <p className="text-lg text-white/70 leading-relaxed max-w-2xl">
          Technical write-ups drawn from systems I have built, with the code and the numbers that matter.
        </p>
      </motion.header>

      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <GlassCard hoverable padding="md" className="space-y-3">
              <p className="text-xs font-mono text-white/55">
                <time dateTime={p.datePublished}>{p.datePublished}</time>
                {' · '}
                {p.tags.join(' · ')}
              </p>
              <h2 className="display text-2xl sm:text-3xl text-white leading-snug">
                <Link to={`/blog/${p.slug}`} className="hover:text-signal transition-colors">
                  {p.h1}
                </Link>
              </h2>
              <p className="text-white/70 leading-relaxed">{p.excerpt}</p>
            </GlassCard>
          </li>
        ))}
      </ul>
    </div>
  )
}
