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
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter..."
          className="w-full pl-8 pr-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-slate-600 transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-1">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" count={counts.all} />
        <FilterChip active={filter === "visited"} onClick={() => setFilter("visited")} label="Visited" count={counts.visited} color="emerald" />
        <FilterChip active={filter === "want"} onClick={() => setFilter("want")} label="Want" count={counts.want} color="amber" />
        <FilterChip active={filter === "none"} onClick={() => setFilter("none")} label="None" count={counts.none} color="slate" />
        {Object.entries(CONTINENTS).map(([code, cont]) => (
          <FilterChip key={code} active={filter === code} onClick={() => setFilter(code)} label={cont.name} count={null} />
        ))}
      </div>

      <div className="space-y-0.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-0.5">
        <AnimatePresence>
          {filtered.map(([code, name]) => {
            const status = getStatus(code)
            return (
              <motion.div
                key={code}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <CountryRow code={code} name={name} status={status} />
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="text-sm text-slate-600 text-center py-8">No countries found</p>
        )}
      </div>
    </div>
  )
}

function CountryRow({ code, name, status }) {
  const { toggle } = useTravel()

  const icon = status === STATUS.VISITED
    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    : status === STATUS.WANT
    ? <Heart className="w-4 h-4 text-amber-400" />
    : <Circle className="w-4 h-4 text-slate-600" />

  return (
    <button
      onClick={() => toggle(code)}
      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors text-left group"
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
        active
          ? "bg-slate-700 text-white"
          : "bg-slate-800/40 text-slate-500 hover:text-slate-300 hover:bg-slate-800"
      }`}
    >
      {label}
      {count !== null && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          active ? "bg-slate-600 text-slate-200" : "bg-slate-800 text-slate-500"
        }`}>
          {count}
        </span>
      )}
    </button>
  )
}
