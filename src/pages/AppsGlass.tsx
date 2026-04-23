import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'
import AppNodeCard from '../components/AppNodeCard'
import GlassCard from '../components/GlassCard'
import { appServices } from '../data/apps'

export default function Apps() {
  usePageMeta(
    'Service Registry — tic-tac-toe Gateway | Kulshresth Jangid',
    'Live service registry. tic-tac-toe (entry point) proxies echo-post frontend at /lumen and smart-server backend at :8080. Lumen SaaS platform and supporting infrastructure.',
  )
  const onlineCount = appServices.filter((s) => s.status === 'ONLINE').length
  const degradedCount = appServices.filter((s) => s.status === 'DEGRADED').length

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-10"
      >
        {/* Header */}
        <div>
          <p className="text-xs font-mono text-white/20 mb-2 tracking-[0.25em] uppercase">
            // applications gateway
          </p>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Service Registry</h1>
          <p className="text-white/40 text-sm max-w-lg leading-relaxed">
            All services behind the <span className="text-white/70 font-mono">tic-tac-toe</span> entry point.
            Lumen (echo-post) is the primary application — all surrounding services support it at the infrastructure layer.
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: String(appServices.length), label: 'REGISTERED' },
            { value: String(onlineCount), label: 'ONLINE' },
            { value: degradedCount > 0 ? String(degradedCount) : '0', label: 'DEGRADED' },
            { value: 'Nginx', label: 'PROXY / TLS' },
          ].map(({ value, label }) => (
            <GlassCard key={label} padding="sm" className="text-center">
              <div
                className={`text-xl font-black font-mono text-white`}
              >
                {value}
              </div>
              <div className="text-[11px] text-white/20 mt-0.5 font-mono tracking-widest">
                {label}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Nginx route map */}
        <GlassCard className="overflow-x-auto">
          <h2 className="text-sm font-semibold text-white mb-5 font-mono flex items-center gap-2">
            <span className="text-white/30">$</span> route map
          </h2>
          <table className="w-full text-xs font-mono min-w-[480px]">
            <thead>
              <tr className="text-white/20 border-b border-white/[0.06]">
                <th className="text-left pb-2.5 pr-8">SERVICE</th>
                <th className="text-left pb-2.5 pr-8">ROUTE</th>
                <th className="text-left pb-2.5 pr-8">STATUS</th>
                <th className="text-left pb-2.5">VERSION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {appServices.map((app) => (
                <tr key={app.id}>
                  <td className="py-2.5 pr-8 text-white/60">{app.name}</td>
                  <td className="py-2.5 pr-8 text-white/35 font-mono">
                    {app.externalUrl ?? app.route}
                  </td>
                  <td className="py-2.5 pr-8">
                    <span className="text-white/50">{app.status}</span>
                  </td>
                  <td className="py-2.5 text-white/20">v{app.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        {/* Service node cards */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-5 font-mono flex items-center gap-2">
            <span className="text-white/30">$</span> service nodes
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {appServices.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
              >
                <AppNodeCard app={app} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
