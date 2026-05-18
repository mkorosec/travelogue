import { motion } from "framer-motion"
import { useTravel } from "../hooks/useTravel"
import { CONTINENTS } from "../data/countries"

export default function StatsCard() {
  const { visitedCount, wantCount, totalCountries, progress, continentStats } = useTravel()

  const radius = 64
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center py-2">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
            <circle cx="80" cy="80" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
            <motion.circle
              cx="80" cy="80" r={radius} fill="none"
              stroke="url(#progressGradient)" strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={Math.round(progress)}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-white tabular-nums"
            >
              {Math.round(progress)}%
            </motion.span>
            <span className="text-xs text-slate-500 font-medium mt-0.5">of the world</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatBox
          value={visitedCount}
          label="Visited"
          color="#10b981"
          delay={0}
        />
        <StatBox
          value={wantCount}
          label="Want to go"
          color="#f59e0b"
          delay={0.1}
        />
        <StatBox
          value={totalCountries - visitedCount - wantCount}
          label="Remaining"
          color="#64748b"
          delay={0.2}
        />
        <StatBox
          value={totalCountries}
          label="Total"
          color="#6366f1"
          delay={0.3}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-0.5">Continents</p>
        {Object.entries(CONTINENTS).map(([code, cont]) => {
          const stats = continentStats[code]
          if (!stats) return null
          const pct = stats.total > 0 ? (stats.visited / stats.total) * 100 : 0
          return (
            <ContinentBar key={code} continent={cont} visited={stats.visited} total={stats.total} pct={pct} />
          )
        })}
      </div>
    </div>
  )
}

function StatBox({ value, label, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/30"
    >
      <motion.p
        key={value}
        initial={{ y: -4, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-xl font-bold tabular-nums"
        style={{ color }}
      >
        {value}
      </motion.p>
      <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
    </motion.div>
  )
}

function ContinentBar({ continent, visited, total, pct }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 group"
    >
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: continent.color }} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-400 font-medium truncate">{continent.name}</span>
          <span className="text-xs text-slate-500 tabular-nums ml-2 flex-shrink-0">{visited}/{total}</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: continent.color, opacity: 0.8 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
