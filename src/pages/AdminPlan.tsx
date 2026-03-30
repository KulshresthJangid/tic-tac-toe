import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { signOut } from '../lib/adminAuth'

// ─── Primitives ─────────────────────────────────────────────────────────────

function Pill({ label, accent }: { label: string; accent: 'purple' | 'teal' | 'amber' | 'coral' }) {
  const styles = {
    purple: 'bg-[#1a1830] text-[#8b82e8] border-[#2e2860]/50',
    teal:   'bg-[#0d1f1b] text-[#3db896] border-[#1a4035]/50',
    amber:  'bg-[#1e1608] text-[#c98a2a] border-[#3d2e10]/50',
    coral:  'bg-[#1e0e08] text-[#d96040] border-[#4a2010]/50',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${styles[accent]}`}>
      {label}
    </span>
  )
}

function SectionHeader({ pill, accent, title }: {
  pill: string; accent: 'purple' | 'teal' | 'amber' | 'coral'; title: string
}) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/[0.05]">
      <Pill label={pill} accent={accent} />
      <span className="text-sm font-medium text-white/70">{title}</span>
    </div>
  )
}

function Card({ label, value, sub, accent }: {
  label: string; value: string; sub: string; accent?: 'purple' | 'teal' | 'amber' | 'coral'
}) {
  const borderColors = {
    purple: 'border-l-[#534AB7]',
    teal:   'border-l-[#0F6E56]',
    amber:  'border-l-[#854F0B]',
    coral:  'border-l-[#993C1D]',
  }
  return (
    <div className={`bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4 ${accent ? `border-l-2 ${borderColors[accent]}` : ''}`}>
      <div className="text-[11px] text-white/30 mb-1 tracking-wide uppercase">{label}</div>
      <div className="text-sm font-medium text-white/85 leading-snug mb-1">{value}</div>
      <div className="text-xs text-white/40 leading-relaxed">{sub}</div>
    </div>
  )
}

function RuleTag({ text, type }: { text: string; type: 'stop' | 'go' }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-white/[0.04] last:border-0">
      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5 ${
        type === 'stop' ? 'bg-red-950/60 text-red-400/80' : 'bg-green-950/50 text-green-400/70'
      }`}>
        {type}
      </span>
      <span className="text-xs text-white/55 leading-relaxed">{text}</span>
    </div>
  )
}

const timelineItems = [
  { period: 'Month 1–2 — Foundations', title: 'Lock the stack. Kill the scatter.', desc: 'Pick ONE side project — finish it. Pick ONE OSS repo. Set up freelance profile. Block social media during work hours.', dot: 'bg-[#534AB7]' },
  { period: 'Month 3–4 — First signal', title: 'Deploy chat app. Land first freelance inquiry.', desc: 'Ship the chat app publicly. Write a case study on YouTube. Apply to 5 freelance gigs/week. Get first OSS PR merged.', dot: 'bg-[#534AB7]' },
  { period: 'Month 5–6 — First income outside MNC', title: 'First freelance rupee earned.', desc: 'The psychological unlock. Even ₹10k from a side client changes how you see yourself. Begin system design study seriously.', dot: 'bg-[#0F6E56]' },
  { period: 'Month 7–9 — Compound', title: 'Reputation starts doing work for you.', desc: 'OSS profile visible. YouTube has 10+ meaningful videos. 1–2 repeat freelance clients. You propose architecture at MNC, not just execute.', dot: 'bg-[#0F6E56]' },
  { period: 'Month 10–12 — Leverage', title: 'Renegotiate or move. Income diversified.', desc: 'OSS + freelance + system design depth → negotiate a raise or switch for 40–60% more. No longer dependent on one income source.', dot: 'bg-[#993C1D]' },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminPlan() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        {/* Back + header */}
        <div className="mb-10">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/25 hover:text-white/50 transition-colors mb-5"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            back to dashboard
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono text-white/25 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded">ADMIN · PLAN</span>
          </div>
          <h1 className="text-xl font-semibold text-white/90">The Kulshresth System</h1>
          <p className="text-sm text-white/35 mt-1">One identity. Four pillars. No scatter.</p>
        </div>

        {/* CAREER */}
        <section className="mb-10">
          <SectionHeader pill="Career" accent="purple" title="Engineer → Architect" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Card accent="purple" label="Primary aim" value="AI-augmented backend architect" sub="Not AI replacement. You build the systems that use AI. Java + Node + TypeScript + LLM APIs. Bulletproof for 10 years." />
            <Card accent="purple" label="Why future-proof" value="AI needs engineers who understand systems" sub="AI can write code. It cannot design scalable multi-tenant architecture. That's your moat. Deepen it." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Card label="0–3 months at MNC" value="Become the system guy" sub="Own architecture decisions. Propose improvements. Get noticed for thinking, not just shipping." />
            <Card label="3–6 months" value="System design depth" sub="Study Designing Data-Intensive Apps. Pick 2 system design topics/week. Write about them publicly." />
            <Card label="6–12 months" value="Senior / lead positioning" sub="Internal promotion or strategic switch. Salary jump target: 40–60%." />
          </div>
        </section>

        <div className="border-t border-white/[0.04] mb-10" />

        {/* SIDE HUSTLE */}
        <section className="mb-10">
          <SectionHeader pill="Side hustle" accent="coral" title="Moonlighting + Open Source = Income" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Card accent="coral" label="Moonlighting path" value="Freelance backend contracts" sub="Upwork / Toptal / LinkedIn. Target: 1 client, 10hrs/week. Java or Node.js APIs. ₹50k–₹1L/month extra in 3–4 months." />
            <Card accent="coral" label="Open source path" value="Pick one repo, go deep" sub="Don't scatter. Pick a Java or Node OSS project (Quarkus, Fastify, OpenTelemetry). Consistent PRs = GitHub credibility = job offers." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Card label="Month 1–2" value="Pick the repo" sub="Explore issues. Fix docs, then small bugs. Ship 3 PRs minimum." />
            <Card label="Month 3–4" value="First freelance client" sub="Build profile. Apply to 5 postings/day. Under-promise, over-deliver." />
            <Card label="Month 5–6" value="Stack income streams" sub="MNC salary + freelance client + OSS reputation. Three pillars. Not one employer." />
          </div>
        </section>

        <div className="border-t border-white/[0.04] mb-10" />

        {/* PHYSIQUE */}
        <section className="mb-10">
          <SectionHeader pill="Physique" accent="teal" title="Already training → Now engineer it" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Card accent="teal" label="New aim" value="Athletic + functional build" sub="Strength + low body fat + energy for late-night deep work. Look like someone who moves well and doesn't burn out." />
            <Card accent="teal" label="The system" value="4 days lift, 2 days conditioning" sub="Push / Pull / Legs / Full-body. Add 20 min Zone 2 cardio twice a week. Sleep 7h minimum." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Card label="Nutrition" value="High protein, track loosely" sub="1.8–2g protein per kg bodyweight. Hit protein and stop eating junk." />
            <Card label="Metric" value="Progress photo every 4 weeks" sub="Measure strength PRs, not just weight. Engineer the progression." />
            <Card label="Link to career" value="Gym = mental reset" sub="Your best late-night sessions happen after you've moved. Protect the habit like a deployment pipeline." />
          </div>
        </section>

        <div className="border-t border-white/[0.04] mb-10" />

        {/* MIND */}
        <section className="mb-10">
          <SectionHeader pill="Mind" accent="amber" title="Kill brain rot. Build deep capacity." />
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4">
              <div className="text-[11px] text-white/30 mb-3 uppercase tracking-wide">Stop doing</div>
              <RuleTag type="stop" text="Reels before work or after midnight" />
              <RuleTag type="stop" text="Passive Netflix without purpose" />
              <RuleTag type="stop" text="Watching 5 tutorials, building 0" />
              <RuleTag type="stop" text="Switching projects mid-momentum" />
            </div>
            <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4">
              <div className="text-[11px] text-white/30 mb-3 uppercase tracking-wide">Start doing</div>
              <RuleTag type="go" text="Phone in another room during deep work" />
              <RuleTag type="go" text="1 book/month (tech or biography)" />
              <RuleTag type="go" text="Write publicly: blog or YouTube scripts" />
              <RuleTag type="go" text="Sunday planning session (30 min)" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card accent="amber" label="Daily structure" value="Time-blocked deep work" sub="Morning: MNC work. Evening: gym. Night (9–12): side hustle / OSS / learning. Reels are the reward after output, never before." />
            <Card accent="amber" label="Input quality" value="Replace passive with active" sub="Podcasts while commuting (Lex Fridman, Lenny's Podcast, SE Daily). YouTube only if you build from it this week." />
          </div>
        </section>

        <div className="border-t border-white/[0.04] mb-10" />

        {/* TIMELINE */}
        <section className="mb-10">
          <SectionHeader pill="Roadmap" accent="purple" title="12-month arc" />
          <div className="flex flex-col gap-0">
            {timelineItems.map((item, i) => (
              <div key={i} className="flex gap-0">
                <div className="flex flex-col items-center min-w-[28px]">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.dot}`} />
                  {i < timelineItems.length - 1 && (
                    <div className="w-px bg-white/[0.06] flex-1 mt-1" />
                  )}
                </div>
                <div className="pb-6 pl-3 flex-1">
                  <div className="text-[11px] text-white/30 font-mono mb-0.5">{item.period}</div>
                  <div className="text-sm font-medium text-white/80 mb-1">{item.title}</div>
                  <div className="text-xs text-white/40 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-white/[0.04] mb-10" />

        <div className="grid grid-cols-2 gap-3">
          <Card label="The one rule" value="One primary system at a time" sub="Chat app first. Everything else orbits it. No new project until it ships. Execute instead of explore when clarity drops." />
          <Card label="How you measure success" value="Not hours. Outputs." sub="PRs merged. Videos published. Clients acquired. Salary increased. Track weekly. If the number isn't moving, change approach — not goal." />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/[0.04] flex items-center justify-between">
          <Link to="/admin" className="text-[11px] font-mono text-white/[0.18] hover:text-white/40 transition-colors">
            ← dashboard
          </Link>
          <button
            onClick={() => { signOut(); window.location.href = '/admin' }}
            className="text-[11px] font-mono text-white/[0.18] hover:text-white/40 transition-colors"
          >
            sign out
          </button>
        </div>
      </motion.div>
    </div>
  )
}
