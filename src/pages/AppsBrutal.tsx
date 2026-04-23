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
    <div className="max-w-7xl mx-auto px-6 py-12 font-mono selection:bg-primary selection:text-black">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "linear" }}
        className="space-y-16"
      >
        {/* Header */}
        <div>
          <p className="text-sm font-bold text-primary mb-2 tracking-widest uppercase">
            // applications gateway
          </p>
          <h1 className="text-5xl font-black text-white mb-6 tracking-tighter uppercase border-b-4 border-secondary inline-block pb-2">
            Service Registry
          </h1>
          <p className="text-white text-lg font-bold max-w-2xl leading-relaxed">
            All services behind the <span className="text-primary uppercase bg-white/10 px-1">tic-tac-toe</span> entry point.
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
            <GlassCard key={label} padding="sm" className="text-center group hover:bg-white transition-none">
              <div
                className={`text-4xl font-black font-mono text-white group-hover:text-black`}
              >
                {value}
              </div>
              <div className="text-sm text-primary font-bold tracking-widest uppercase mt-2 group-hover:text-black">
                {label}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Nginx route map */}
        <GlassCard className="overflow-x-auto p-0 border-4 border-white transition-none">
          <h2 className="text-2xl font-black text-white bg-black border-b-4 border-white p-4 uppercase">
            Route Map
          </h2>
          <table className="w-full text-base font-bold min-w-[480px]">
            <thead className="bg-white text-black">
              <tr>
                <th className="text-left py-3 px-4 uppercase border-r-2 border-black">SERVICE</th>
                <th className="text-left py-3 px-4 uppercase border-r-2 border-black">ROUTE</th>
                <th className="text-left py-3 px-4 uppercase border-r-2 border-black">STATUS</th>
                <th className="text-left py-3 px-4 uppercase">VERSION</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-white">
              {appServices.map((app) => (
                <tr key={app.id} className="hover:bg-primary hover:text-black transition-none group text-white">
                  <td className="py-3 px-4 uppercase group-hover:text-black">{app.name}</td>
                  <td className="py-3 px-4">
                    {app.externalUrl ?? app.route}
                  </td>
                  <td className="py-3 px-4">
                    <span className="uppercase">{app.status}</span>
                  </td>
                  <td className="py-3 px-4">v{app.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        {/* Service node cards */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6 uppercase border-l-4 border-secondary pl-4">
            Service Nodes
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appServices.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
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
