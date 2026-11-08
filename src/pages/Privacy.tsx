import { usePageMeta } from '../hooks/usePageMeta'

const EMAIL = 'jangidkulshresth@gmail.com'

const sections = [
  {
    title: 'What I collect',
    body: [
      'If you use the contact form I receive your name, email address, budget range and the project summary you type in. Nothing else is required.',
      'If you book a call, the booking is handled by Calendly. They collect the details you give them, and their privacy policy applies to that data.',
      'This site is served through Cloudflare, which records standard technical request data such as IP address, browser and pages requested, and may run privacy focused traffic analytics.',
    ],
  },
  {
    title: 'How I use it',
    body: [
      'I use your details only to reply to your enquiry and, if we work together, to run the project. I do not sell your data, share it for advertising, or add you to a mailing list.',
    ],
  },
  {
    title: 'Who else touches it',
    body: [
      'Form submissions pass through Web3Forms, which delivers them to my email. Bookings go through Calendly. Hosting and delivery run through Cloudflare and my own server. These providers process data only to provide those services.',
    ],
  },
  {
    title: 'Cookies',
    body: [
      'This site does not set its own tracking cookies. Third party services such as Calendly or Cloudflare may set cookies of their own when you use them.',
    ],
  },
  {
    title: 'Keeping and deleting your data',
    body: [
      'I keep enquiry emails for as long as they are useful for the conversation or the project, and as long as the law requires for any paid work. Ask me and I will delete what I hold about you.',
    ],
  },
  {
    title: 'Client work',
    body: [
      'Paid engagements are covered by a written agreement that sets out scope, ownership of the code and confidentiality. I am happy to sign your NDA before we discuss anything sensitive.',
    ],
  },
]

export default function Privacy() {
  usePageMeta(
    'Privacy | Kulshresth Jangid',
    'How this site handles the details you send through the contact form, Calendly bookings and standard hosting logs.',
    { canonical: 'https://buildwithkulshresth.com/privacy' },
  )

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
      <p className="eyebrow mb-4">Legal</p>
      <h1 className="display text-5xl sm:text-6xl text-white leading-[1.05]">Privacy</h1>
      <p className="mt-6 text-white/65 leading-relaxed">
        Short version: I only collect what you choose to send me, I use it to reply to you, and I do not sell it. Last updated November 2026.
      </p>

      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="display text-3xl text-white">{s.title}</h2>
            <div className="mt-3 space-y-3">
              {s.body.map((p) => (
                <p key={p} className="text-white/65 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-14 text-white/65">
        Questions or deletion requests:{' '}
        <a href={`mailto:${EMAIL}`} className="text-signal hover:underline">
          {EMAIL}
        </a>
      </p>
    </div>
  )
}
