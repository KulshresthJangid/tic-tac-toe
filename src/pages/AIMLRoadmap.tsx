import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'

/* ─── Design tokens ──────────────────────────────────────────────── */
const C = {
  bg:        '#000000',
  surface:   '#0a0a0a',
  surface2:  '#111111',
  border:    '#1c1c1c',
  borderMid: '#252525',
  white:     '#ffffff',
  whiteOff:  'rgba(255,255,255,0.85)',
  gray:      'rgba(255,255,255,0.55)',
  grayDim:   'rgba(255,255,255,0.35)',
  grayDeep:  'rgba(255,255,255,0.18)',
  muted:     'rgba(255,255,255,0.1)',
}

/* ─── Status system ──────────────────────────────────────────────── */
type PhaseStatus = 0 | 1 | 2

const STATUS_LABELS: Record<PhaseStatus, string> = {
  0: '🔒 Locked',
  1: '🔄 In Progress',
  2: '✅ Done',
}

const STATUS_COLORS: Record<PhaseStatus, { border: string; color: string; bg: string }> = {
  0: { border: '#1c1c1c',   color: 'rgba(255,255,255,0.18)', bg: '#0a0a0a' },
  1: { border: '#f59e0b',   color: '#f59e0b',                bg: 'rgba(245,158,11,0.04)' },
  2: { border: '#22c55e',   color: '#22c55e',                bg: 'rgba(34,197,94,0.04)' },
}

const PHASE_ACCENTS = ['#6366f1', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']

/* ─── Data ───────────────────────────────────────────────────────── */
interface Milestone {
  label: string
  proof: string
}

interface Phase {
  id: string
  num: string
  title: string
  subtitle: string
  skills: string[]
  resources: string[]
  milestones: Milestone[]
  weeks: string
  hours: number
}

const phases: Phase[] = [
  {
    id: 'foundations',
    num: '01',
    title: 'Foundations',
    subtitle: 'Python, NumPy, Pandas, classical ML, and model evaluation — before any neural nets',
    skills: ['Python', 'NumPy', 'Pandas', 'EDA', 'Scikit-learn', 'XGBoost', 'Optuna', 'HuggingFace pipelines', 'Jupyter', 'conda'],
    resources: [
      'Jake VanderPlas "Python Data Science Handbook" Ch2-3 (free online)',
      'Kaggle "Pandas" micro-course (free, course.kaggle.com)',
      'Scikit-learn "Getting Started" + "Model Evaluation" docs',
      'XGBoost docs + Optuna "10-minute intro" docs',
      'HuggingFace "NLP Course" Ch1-2 (free, course.huggingface.co)',
    ],
    milestones: [
      { label: 'ML environment scaffolded', proof: 'GitHub repo: conda env, requirements.txt, .env, .gitignore' },
      { label: 'NumPy vectorized ops — zero Python loops', proof: 'Notebook: matrix multiply, broadcasting rules, sigmoid' },
      { label: 'Full EDA on Titanic or Iris dataset', proof: 'Notebook: distributions, correlation heatmap, outlier detection' },
      { label: 'Scikit-learn Pipeline + XGBoost comparison', proof: 'classification_report comparison + Kaggle screenshot' },
      { label: 'HuggingFace: 3 pipelines (sentiment, NER, summarization)', proof: 'Notebook demonstrating all 3 pipelines' },
    ],
    weeks: 'Week 1–2',
    hours: 14,
  },
  {
    id: 'deep-learning',
    num: '02',
    title: 'Deep Learning',
    subtitle: 'PyTorch from raw tensors to full training loops, CNNs, and transfer learning',
    skills: ['PyTorch', 'autograd', 'Dataset / DataLoader', 'CNN', 'BatchNorm', 'Dropout', 'ResNet', 'Transfer Learning', 'torchvision'],
    resources: [
      'PyTorch "60 Minute Blitz" (first 2 sections) — official docs',
      'PyTorch "torch.utils.data" Dataset + DataLoader docs',
      'PyTorch "Training a Classifier" official tutorial (CIFAR-10)',
      'cs231n "Convolutional Networks" notes (cs231n.github.io)',
      'PyTorch "Transfer Learning Tutorial" official docs',
    ],
    milestones: [
      { label: 'Manual 2-layer net via autograd — no nn.Module', proof: 'Single .py file, forward + backward implemented by hand' },
      { label: 'Custom Dataset + DataLoader for any CSV', proof: 'GitHub commit with transforms pipeline' },
      { label: 'Full training loop: loss → optimizer → val → checkpoint', proof: '.py training script (not notebook)' },
      { label: 'CNN on CIFAR-10: 70%+ val accuracy with BatchNorm + Dropout', proof: 'GitHub repo: training script + eval results' },
      { label: 'ResNet-18 fine-tuned on custom 2-class image dataset', proof: 'README with accuracy table' },
    ],
    weeks: 'Week 2–4',
    hours: 11,
  },
  {
    id: 'nlp-transformers',
    num: '03',
    title: 'NLP & Transformers',
    subtitle: 'BERT fine-tuning, shipping models to HuggingFace Hub, and deploying live demos',
    skills: ['HuggingFace Transformers', 'Trainer API', 'BERT', 'DistilBERT', 'tokenizers', 'push_to_hub()', 'Gradio', 'HuggingFace Spaces'],
    resources: [
      'HuggingFace "NLP Course" Ch3 + Trainer API docs',
      'HuggingFace "Model Card Guidebook" (best practices)',
      'Gradio docs "Quickstart" + "Sharing Your App to Spaces"',
    ],
    milestones: [
      { label: 'BERT fine-tuned on text classification (10 epochs)', proof: 'GitHub repo + model pushed to HuggingFace Hub' },
      { label: 'Model card: training data, metrics, limitations, usage', proof: 'Live HuggingFace model page' },
      { label: 'Gradio interface deployed to HuggingFace Spaces', proof: 'Live HuggingFace Space URL' },
    ],
    weeks: 'Week 1 (intensive weekend)',
    hours: 6,
  },
  {
    id: 'llm-engineering',
    num: '04',
    title: 'LLM Engineering',
    subtitle: 'RAG from scratch, prompt engineering patterns, local LLM inference, and LoRA fine-tuning',
    skills: ['RAG', 'FAISS', 'sentence-transformers', 'LangChain', 'LlamaIndex', 'prompt engineering', 'chain-of-thought', 'LoRA', 'PEFT', 'quantization', 'llama.cpp', 'FastAPI'],
    resources: [
      'LlamaIndex "Starter Tutorial" + FAISS docs "Getting Started"',
      'Anthropic "Prompt Engineering Guide" + OpenAI "Prompt Engineering" docs',
      'LangChain docs "LCEL" (understand tradeoffs vs direct API)',
      'HuggingFace PEFT docs "LoRA" + trl SFTTrainer docs',
      'llama.cpp README + HuggingFace "bitsandbytes" quantization docs',
    ],
    milestones: [
      { label: 'RAG pipeline from scratch: chunk → embed → FAISS index → generate', proof: 'GitHub repo: rag-from-scratch' },
      { label: 'Prompt engineering benchmark: few-shot, CoT, output parsing', proof: 'Notebook with eval results comparing approaches' },
      { label: 'Semantic search API over a document corpus', proof: 'GitHub repo: semantic-search-api + FastAPI endpoint' },
      { label: 'Quantized LLM running locally (GGUF format)', proof: 'Benchmark table: VRAM + speed vs full precision in README' },
      { label: 'LoRA fine-tune on mistral-7b or phi-2', proof: 'HuggingFace Hub model + model card' },
    ],
    weeks: 'Week 4–8',
    hours: 9,
  },
  {
    id: 'mlops',
    num: '05',
    title: 'MLOps & Production',
    subtitle: 'Experiment tracking, reproducible structure, CI/CD for ML, and the full end-to-end capstone',
    skills: ['MLflow', 'FastAPI', 'Streamlit', 'Docker', 'GitHub Actions', 'Great Expectations', 'production project structure', 'HuggingFace Spaces'],
    resources: [
      'MLflow "Quickstart" docs (mlflow.org)',
      'Cookie Cutter Data Science README + Real Python "Jupyter to Python"',
      'Streamlit docs "Get Started" + deploy to Streamlit Cloud (free)',
      'GitHub Actions "Building and Testing Python" CI quickstart',
    ],
    milestones: [
      { label: 'MLflow: log metrics, params, artifacts on any existing training script', proof: 'GitHub commit with MLflow runs directory' },
      { label: 'Notebook → production scripts: data/, models/, src/, tests/, Makefile', proof: 'GitHub repo with proper structure' },
      { label: 'Streamlit dashboard: upload CSV → auto EDA → filter → chart → download', proof: 'Live Streamlit Cloud app URL' },
      { label: 'AI system capstone: ingest → fine-tune → FastAPI / Gradio → deployed demo', proof: 'Full GitHub repo + published blog post on dev.to' },
    ],
    weeks: 'Week 3–9',
    hours: 9,
  },
]

const STORAGE_KEY = 'aiml_journey_status'

/* ─── Component ──────────────────────────────────────────────────── */
export default function AIMLRoadmap() {
  usePageMeta(
    'My AI/ML Journey — Kulshresth Jangid',
    'A 5-phase structured AI/ML learning roadmap: Python foundations → classical ML → deep learning → LLM engineering → MLOps. Tracked publicly.',
    { canonical: 'https://buildwithkulshresth.com/ai-ml' },
  )

  const [statuses, setStatuses] = useState<Record<string, PhaseStatus>>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
    catch { return {} }
  })

  const cycleStatus = (id: string) => {
    const current = (statuses[id] ?? 0) as PhaseStatus
    const next = ((current + 1) % 3) as PhaseStatus
    const updated = { ...statuses, [id]: next }
    setStatuses(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
  }

  const doneCount = phases.filter(p => (statuses[p.id] ?? 0) === 2).length
  const inProgressCount = phases.filter(p => (statuses[p.id] ?? 0) === 1).length
  const totalHours = phases.reduce((s, p) => s + p.hours, 0)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
      >
        {/* ── Header ── */}
        <div>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.7rem',
            color: C.grayDeep,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}>
            // ai-ml
          </p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
            fontWeight: 900,
            color: C.white,
            margin: 0,
            lineHeight: 1.2,
          }}>
            My AI/ML Journey
          </h1>
          <p style={{
            fontSize: '0.9rem',
            color: C.gray,
            marginTop: '0.75rem',
            lineHeight: 1.65,
            maxWidth: 580,
          }}>
            A structured 5-phase plan to go from Python foundations to shipping LLM-powered systems.
            9 weeks. Every milestone has a proof requirement. Tracked publicly.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '1.5rem' }}>
            {[
              { label: 'Phases',      val: `${phases.length}`,    accent: C.white },
              { label: 'In Progress', val: `${inProgressCount}`,  accent: '#f59e0b' },
              { label: 'Completed',   val: `${doneCount}`,        accent: '#22c55e' },
              { label: 'Total Hours', val: `${totalHours}h`,      accent: C.white },
            ].map(({ label, val, accent }) => (
              <div key={label}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: accent,
                }}>
                  {val}
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.58rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.grayDeep,
                  marginTop: '0.15rem',
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Phase cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {phases.map((phase, idx) => {
            const status = (statuses[phase.id] ?? 0) as PhaseStatus
            const sc = STATUS_COLORS[status]
            const accent = PHASE_ACCENTS[idx]

            return (
              <div
                key={phase.id}
                style={{
                  border: `1px solid ${status > 0 ? sc.border : C.border}`,
                  borderLeft: `3px solid ${accent}`,
                  borderRadius: 4,
                  background: sc.bg,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                <div style={{ padding: '1.1rem 1.25rem 1.15rem' }}>

                  {/* Phase header row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: '0.75rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', minWidth: 0 }}>
                      {/* Phase number */}
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: accent,
                        letterSpacing: '0.05em',
                        paddingTop: '0.05rem',
                        flexShrink: 0,
                      }}>
                        {phase.num}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        {/* Title */}
                        <h2 style={{
                          fontSize: '0.98rem',
                          fontWeight: 700,
                          color: status > 0 ? sc.color : C.whiteOff,
                          margin: 0,
                          lineHeight: 1.3,
                        }}>
                          {phase.title}
                        </h2>
                        {/* Subtitle */}
                        <p style={{
                          fontSize: '0.78rem',
                          color: C.grayDim,
                          margin: '0.3rem 0 0',
                          lineHeight: 1.55,
                        }}>
                          {phase.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Meta + status */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '0.4rem',
                      flexShrink: 0,
                    }}>
                      <button
                        onClick={() => cycleStatus(phase.id)}
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '0.22rem 0.65rem',
                          border: `1px solid ${sc.border}`,
                          borderRadius: 2,
                          color: sc.color,
                          background: 'transparent',
                          cursor: 'pointer',
                          letterSpacing: '0.03em',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s',
                        }}
                      >
                        {STATUS_LABELS[status]}
                      </button>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.58rem',
                        color: C.grayDeep,
                        whiteSpace: 'nowrap',
                      }}>
                        {phase.hours}h · {phase.weeks}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                    {phase.skills.map(skill => (
                      <span
                        key={skill}
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.6rem',
                          padding: '0.15rem 0.5rem',
                          border: `1px solid ${C.border}`,
                          borderRadius: 2,
                          color: C.grayDim,
                          background: C.surface,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Milestones */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.55rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: C.grayDeep,
                      marginBottom: '0.55rem',
                    }}>
                      Milestones
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {phase.milestones.map(ms => (
                        <div key={ms.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                          <span style={{
                            color: accent,
                            fontSize: '0.55rem',
                            marginTop: '0.2rem',
                            flexShrink: 0,
                          }}>
                            ▸
                          </span>
                          <div>
                            <span style={{ fontSize: '0.78rem', color: C.gray, lineHeight: 1.5 }}>
                              {ms.label}
                            </span>
                            <span style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '0.59rem',
                              color: C.grayDeep,
                              display: 'block',
                              marginTop: '0.1rem',
                            }}>
                              proof: {ms.proof}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resources */}
                  <div>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.55rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: C.grayDeep,
                      marginBottom: '0.45rem',
                    }}>
                      Resources
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {phase.resources.map(r => (
                        <div key={r} style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start' }}>
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.58rem',
                            color: C.grayDeep,
                            flexShrink: 0,
                            paddingTop: '0.1rem',
                          }}>
                            —
                          </span>
                          <span style={{ fontSize: '0.76rem', color: C.grayDim, lineHeight: 1.5 }}>
                            {r}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>

        {/* ── Footer note ── */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1.25rem' }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.66rem',
            color: C.grayDeep,
            margin: 0,
          }}>
            // click any status badge to cycle 🔒 → 🔄 → ✅ · progress saved in your browser
          </p>
        </div>
      </motion.div>
    </div>
  )
}
