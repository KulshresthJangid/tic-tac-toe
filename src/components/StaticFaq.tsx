import type { FaqItem } from './FaqList'

/**
 * FAQ with every answer present in the DOM (native <details>), so the text is
 * in the prerendered HTML and matches the FAQPage JSON-LD. FaqList only mounts
 * the open answer, which is fine on the homepage but not for landing pages.
 */
export default function StaticFaq({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <details key={item.q} className="group rounded-xl border border-white/[0.12] bg-surface/60">
          <summary className="cursor-pointer list-none px-5 py-4 text-white font-medium hover:text-signal transition-colors flex items-center justify-between gap-4">
            <h3 className="font-medium">{item.q}</h3>
            <span aria-hidden className="text-white/50 transition-transform group-open:rotate-45 text-xl leading-none">
              +
            </span>
          </summary>
          <p className="px-5 pb-5 text-white/70 leading-relaxed">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
