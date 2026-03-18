import { motion } from 'framer-motion'
import AppNodeCard from '../components/AppNodeCard'
import GlassCard from '../components/GlassCard'
import { appServices } from '../data/apps'

export default function Apps() {
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
          <p className="text-xs font-mono text-cyan-500 mb-2 tracking-[0.2em] uppercase">
            // applications gateway
          </p>
          <h1 className="text-3xl font-bold text-white mb-2">Service Registry</h1>
          <p className="text-slate-400 text-base max-w-xl leading-relaxed">
            All deployed applications and services behind this server. Each service runs in an
            isolated container proxied by Nginx. The Social SaaS platform is the flagship
            deployment — surrounding services support it at the infrastructure layer.
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: String(appServices.length), label: 'REGISTERED' },
            { value: String(onlineCount), label: 'ONLINE', highlight: true },
            { value: degradedCount > 0 ? String(degradedCount) : '0', label: 'DEGRADED' },
            { value: 'Nginx', label: 'PROXY / TLS' },
          ].map(({ value, label, highlight }) => (
            <GlassCard key={label} padding="sm" className="text-center">
              <div
                className={`text-xl font-bold font-mono ${
                  highlight ? 'text-emerald-400' : 'text-white'
                }`}
              >
                {value}
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5 font-mono tracking-widest">
                {label}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Nginx route map */}
        <GlassCard className="overflow-x-auto">
          <h2 className="text-sm font-semibold text-white mb-5 font-mono flex items-center gap-2">
            <span className="text-cyan-500">$</span> nginx route map
          </h2>
          <table className="w-full text-xs font-mono min-w-[480px]">
            <thead>
              <tr className="text-slate-600 border-b border-white/[0.06]">
                <th className="text-left pb-2.5 pr-8">SERVICE</th>
                <th className="text-left pb-2.5 pr-8">ROUTE</th>
                <th className="text-left pb-2.5 pr-8">STATUS</th>
                <th className="text-left pb-2.5">VERSION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {appServices.map((app) => (
                <tr key={app.id}>
                  <td className="py-2.5 pr-8 text-slate-200">{app.name}</td>
                  <td className="py-2.5 pr-8 text-cyan-500">
                    {app.externalUrl ?? app.route}
                  </td>
                  <td className="py-2.5 pr-8">
                    <span
                      className={
                        app.status === 'ONLINE'
                          ? 'text-emerald-400'
                          : app.status === 'DEGRADED'
                          ? 'text-amber-400'
                          : 'text-red-400'
                      }
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-600">v{app.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        {/* Service node cards */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-5 font-mono flex items-center gap-2">
            <span className="text-cyan-500">$</span> service nodes
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
