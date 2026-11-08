import type { Testimonial } from '../types'

export const testimonials: Testimonial[] = [
  {
    id: 'vidosh-sahu',
    name: 'Vidosh Sahu',
    role: 'Assistant VP, Engineering',
    company: 'CarDekho Group',
    relationship: 'Senior engineering leadership at CarDekho',
    quote:
      "Kulshresth was the engineer you'd hand the ugly latency problem to and not have to think about again. The caching redesign on our search APIs cut p99 by 40% — but what stuck with me was that he came with a diagnosis, not just a fix, and the rollout didn't touch our on-call at all.",
    linkedinUrl: 'https://in.linkedin.com/in/vidoshsahu',
    approved: true,
  },
  {
    id: 'abhinav-faujdar',
    name: 'Abhinav Faujdar',
    role: 'Software Engineer',
    company: 'Stealth Startup',
    relationship: 'Fellow engineer, Jaipur',
    quote:
      "I've watched Kulshresth go from shipping features to owning entire systems — Kaizex is not a side project, it's a real multi-tenant platform he built pipeline by pipeline. Give him a vague problem and he'll come back with the schema, the failure modes, and the rollback plan.",
    linkedinUrl: 'https://in.linkedin.com/in/abhinav-faujdar',
    approved: true,
  },
  {
    id: 'nikhil-saini',
    name: 'Nikhil Saini',
    role: 'Founder',
    company: 'Bombaywala Marketing',
    relationship: 'Client / freelance engagement',
    quote:
      "We didn't need a contractor who just takes tickets — we needed someone who'd push back when a request didn't make sense for the business. Kulshresth did that, shipped fast, and was easy to reach when something broke. That combination is rarer than it should be.",
    approved: true,
  },
  {
    id: 'rishabh-mandawariya',
    name: 'Rishabh Mandawariya',
    role: 'Software Engineer, Frontend',
    company: '—',
    relationship: 'Frontend collaborator',
    quote:
      "Working across the frontend/backend boundary with Kulshresth was easy in a way that's rare — the API contracts were documented before I asked, and when I found an edge case, the fix showed up the same day instead of a week later.",
    approved: true,
  },
  {
    id: 'vishal-upadhyay',
    name: 'Vishal Upadhyay',
    role: 'Software Engineer',
    company: '—',
    relationship: 'Engineering collaborator',
    quote:
      "I've genuinely never worked with a dev this versatile. DevOps, QA, automation, backend, frontend — he just picks it up and runs with it like it's his specialty, not a stretch. If there's such a thing as a true master of all trades, it's him.",
    approved: true,
  },
  {
    id: 'prashant-sankhla',
    name: 'Prashant Sankhla',
    role: 'Engineer',
    company: '—',
    relationship: 'Colleague',
    quote:
      "Calm under a production incident, which is honestly the whole job sometimes. Kulshresth traces a bug methodically instead of guessing, and he writes the postmortem so the next person doesn't have to relearn the same lesson.",
    approved: true,
  },
]
