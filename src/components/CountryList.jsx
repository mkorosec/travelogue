import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Circle, Heart, Search } from "lucide-react"
import { useTravel } from "../hooks/useTravel"
import { COUNTRY_NAMES, COUNTRY_CONTINENT, CONTINENTS, STATUS } from "../data/countries"

export default function CountryList() {
  const { visited, wantToGo, getStatus } = useTravel()
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    let entries = Object.entries(COUNTRY_NAMES)
    if (filter === "visited") entries = entries.filter(([code]) => visited.has(code))
    else if (filter === "want") entries = entries.filter(([code]) => wantToGo.has(code))
    else if (filter === "none") entries = entries.filter(([code]) => !visited.has(code) && !wantToGo.has(code))
    else if (filter !== "all") {
      entries = entries.filter(([code]) => COUNTRY_CONTINENT[code] === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      entries = entries.filter(([, name]) => name.toLowerCase().includes(q))
    }
    return entries
  }, [filter, search, visited, wantToGo])

  const counts = useMemo(() => {
    const c = { all: Object.keys(COUNTRY_NAMES).length, visited: visited.size, want: wantToGo.size, none: 0 }
    c.none = c.all - c.visited - c.want
    return c
  }, [visited, wantToGo])

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter countries..."
          className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-travel-border)] border border-[var(--color-travel-border-hi)] rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" count={counts.all} />
        <FilterChip active={filter === "visited"} onClick={() => setFilter("visited")} label="Visited" count={counts.visited} color="emerald" />
        <FilterChip active={filter === "want"} onClick={() => setFilter("want")} label="Want" count={counts.want} color="amber" />
        <FilterChip active={filter === "none"} onClick={() => setFilter("none")} label="None" count={counts.none} color="slate" />
        {Object.entries(CONTINENTS).map(([code, cont]) => (
          <FilterChip key={code} active={filter === code} onClick={() => setFilter(code)} label={cont.name} count={null} />
        ))}
      </div>

      <div className="space-y-0.5 max-h-[50vh] overflow-y-auto pr-0.5">
        <AnimatePresence>
          {filtered.map(([code, name]) => {
            const status = getStatus(code)
            return (
              <motion.div
                key={code}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <CountryRow code={code} name={name} status={status} />
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="text-sm text-slate-600 text-center py-10">No countries match</p>
        )}
      </div>
    </div>
  )
}

function CountryRow({ code, name, status }) {
  const { toggle } = useTravel()

  const icon = status === STATUS.VISITED
    ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
    : status === STATUS.WANT
    ? <Heart className="w-4 h-4 text-amber-400 flex-shrink-0" />
    : <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />

  return (
    <button
      onClick={() => toggle(code)}
      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[var(--color-travel-surface-hi)] transition-colors text-left group min-h-[44px]"
    >
      {icon}
      <span className={`text-sm flex-1 truncate ${
        status === STATUS.VISITED ? "text-emerald-300 font-medium" :
        status === STATUS.WANT ? "text-amber-300 font-medium" :
        "text-slate-400"
      }`}>
        {name}
      </span>
    </button>
  )
}

function FilterChip({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors min-h-[34px] ${
        active
          ? "bg-[var(--color-travel-border-hi)] text-white"
          : "bg-[var(--color-travel-surface-hi)] text-slate-500 hover:text-slate-300 hover:bg-[var(--color-travel-border)]"
      }`}
    >
      {label}
      {count !== null && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          active ? "bg-[var(--color-travel-surface)] text-slate-200" : "bg-[var(--color-travel-bg)] text-slate-500"
        }`}>
          {count}
        </span>
      )}
    </button>
  )
}
