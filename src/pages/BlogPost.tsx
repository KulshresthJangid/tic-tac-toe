import { Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'
import { getPost, type PostBlock } from '../data/posts'
import { getService } from '../data/services'
import { projects } from '../data/projects'
import { absoluteUrl, breadcrumbLd, AUTHOR, PUBLISHER } from '../lib/seo'
import Breadcrumbs from '../components/Breadcrumbs'
import NotFound from './NotFound'

function Inline({ text }: { text: string }) {
  const parts = text.split('`')
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="px-1.5 py-0.5 rounded bg-white/[0.07] font-mono text-[0.9em] text-signal">
            {part}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

function Block({ block }: { block: PostBlock }) {
  switch (block.t) {
    case 'h2':
      return <h2 className="display text-3xl text-white pt-4">{block.text}</h2>
    case 'p':
      return (
        <p className="text-white/75 leading-relaxed">
          <Inline text={block.text} />
        </p>
      )
    case 'ul':
      return (
        <ul className="list-disc pl-6 space-y-2 text-white/75 leading-relaxed marker:text-signal">
          {block.items.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      )
    case 'code':
      return (
        <pre className="overflow-x-auto rounded-lg border border-white/[0.12] bg-[#0a0a0a] p-4 text-xs leading-relaxed text-white/80">
          <code className="font-mono" data-lang={block.lang}>
            {block.code}
          </code>
        </pre>
      )
  }
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined
  const path = post ? `/blog/${post.slug}` : '/blog'
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post?.h1 ?? 'Post', path },
  ]

  usePageMeta(post?.title ?? 'Post not found | Kulshresth Jangid', post?.description, {
    canonical: post ? absoluteUrl(path) : undefined,
    noindex: !post,
    og: post ? { title: post.title, description: post.description, type: 'article' } : undefined,
    jsonLd: post
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: post.h1,
            description: post.description,
            url: absoluteUrl(path),
            mainEntityOfPage: absoluteUrl(path),
            image: absoluteUrl('/og-image.png'),
            datePublished: post.datePublished,
            dateModified: post.dateModified,
            author: AUTHOR,
            publisher: PUBLISHER,
            keywords: post.tags.join(', '),
            inLanguage: 'en',
          },
          breadcrumbLd(crumbs),
        ]
      : undefined,
  })

  if (!post) return <NotFound />

  const project = projects.find((p) => p.id === post.projectId)
  const service = getService(post.serviceSlug)

  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 py-12 space-y-6">
      <motion.header initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="display text-4xl sm:text-5xl text-white leading-[1.08]">{post.h1}</h1>
        <p className="text-sm font-mono text-white/55">
          By <span>Kulshresth Jangid</span>
          {' · '}
          Published <time dateTime={post.datePublished}>{post.datePublished}</time>
          {post.dateModified !== post.datePublished && (
            <>
              {' · '}Updated <time dateTime={post.dateModified}>{post.dateModified}</time>
            </>
          )}
        </p>
      </motion.header>

      {post.body.map((block, i) => (
        <Block key={i} block={block} />
      ))}

      <aside className="mt-10 rounded-xl border border-white/[0.12] bg-surface/60 p-5 space-y-2" aria-label="Related">
        <p className="text-sm text-white/75 leading-relaxed">
          {project && (
            <>
              This post expands on the{' '}
              <Link to={`/projects/${project.id}`} className="text-signal hover:underline">
                {project.title} case study
              </Link>
              .{' '}
            </>
          )}
          {service && (
            <>
              If you need this kind of work, see my{' '}
              <Link to={`/services/${service.slug}`} className="text-signal hover:underline">
                {service.navLabel} service
              </Link>
              .
            </>
          )}
        </p>
      </aside>
    </article>
  )
}
