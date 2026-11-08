import { usePageMeta } from '../hooks/usePageMeta'
import { EMAIL } from '../lib/contact'

const sections = [
  {
    title: 'Using this site',
    body: [
      'This site describes my freelance backend engineering services. It is provided for general information and is not an offer that binds either of us until we sign a written agreement.',
    ],
  },
  {
    title: 'Client engagements',
    body: [
      'Paid work is covered by a written agreement that sets out scope, milestones, price, timeline, payment terms and what happens if scope changes. If anything on this site differs from that agreement, the agreement wins.',
      'Timelines such as "3 weeks" describe a typical MVP scope. They become commitments only when they are written into your agreement.',
    ],
  },
  {
    title: 'Ownership of the work',
    body: [
      'Unless your agreement says otherwise, you own the code, documentation and infrastructure configuration built for you once it is delivered. I keep no rights over it and add no licensing strings.',
    ],
  },
  {
    title: 'Confidentiality',
    body: [
      'I treat what you share as confidential. I am happy to sign your NDA before we discuss anything sensitive, or to send a standard one.',
    ],
  },
  {
    title: 'Results and case studies',
    body: [
      'The figures on this site, such as latency and deployment improvements, come from work I did for past employers. Results on your project depend on your system, your data and your goals, so they are examples and not guarantees.',
    ],
  },
  {
    title: 'Limits of liability',
    body: [
      'To the extent the law allows, I am not liable for indirect or consequential losses arising from use of this website. Liability for client work is set out in the engagement agreement.',
    ],
  },
  {
    title: 'Changes',
    body: ['I may update these terms. The date below shows when they last changed.'],
  },
]

export default function Terms() {
  usePageMeta(
    'Terms of Service | Kulshresth Jangid',
    'Terms for using this site and for freelance backend engineering engagements: written agreements, code ownership, confidentiality and results.',
    { canonical: 'https://buildwithkulshresth.com/terms' },
  )

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
      <p className="eyebrow mb-4">Legal</p>
      <h1 className="display text-5xl sm:text-6xl text-white leading-[1.05]">Terms of Service</h1>
      <p className="mt-6 text-white/70 leading-relaxed">
        Plain language terms for this website and for working with me. Last updated November 2026.
      </p>

      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="display text-3xl text-white">{s.title}</h2>
            <div className="mt-3 space-y-3">
              {s.body.map((p) => (
                <p key={p} className="text-white/70 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-14 text-white/70">
        Questions:{' '}
        <a href={`mailto:${EMAIL}`} className="text-signal hover:underline">
          {EMAIL}
        </a>
      </p>
    </div>
  )
}
