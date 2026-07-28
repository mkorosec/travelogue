import { motion } from "framer-motion"
import { useTravel } from "../hooks/useTravel"
import { CONTINENTS } from "../data/countries"

export default function StatsCard() {
  const { visitedCount, wantCount, totalCountries, progress, continentStats } = useTravel()

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <motion.span
            key={visitedCount}
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold text-[var(--color-travel-text-hi)] tabular-nums"
          >
            {visitedCount}
            <span className="text-base font-normal text-[var(--color-travel-text)]"> / {totalCountries}</span>
          </motion.span>
          <span className="text-sm font-semibold text-emerald-400 tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-2 rounded-full bg-[var(--color-travel-border)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(progress, 1)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
          />
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-[var(--color-travel-text)]">{visitedCount} visited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            <span className="text-[var(--color-travel-text)]">{wantCount} want to go</span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold text-[var(--color-travel-text-lo)] uppercase tracking-wider">By continent</h4>
        {Object.entries(CONTINENTS).map(([code, cont]) => {
          const stats = continentStats[code]
          if (!stats) return null
          const pct = stats.total > 0 ? (stats.visited / stats.total) * 100 : 0
          return (
            <ContinentBar key={code} continent={cont} visited={stats.visited} pct={pct} />
          )
        })}
      </div>
    </div>
  )
}

function ContinentBar({ continent, visited, pct }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: continent.color }} />
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-xs text-[var(--color-travel-text)] font-medium truncate">{continent.name}</span>
        <div className="flex-1 h-1.5 rounded-full bg-[var(--color-travel-border)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: continent.color }}
          />
        </div>
        <span className="text-xs text-[var(--color-travel-text-lo)] tabular-nums flex-shrink-0 w-8 text-right">{visited}</span>
      </div>
    </div>
  )
}
