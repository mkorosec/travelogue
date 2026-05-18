import { useState, useMemo, useRef } from "react"
import { Search, X } from "lucide-react"
import { useTravel } from "../hooks/useTravel"
import { COUNTRY_NAMES, STATUS } from "../data/countries"

export default function SearchInput({ onSelect }) {
  const { getStatus } = useTravel()
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef(null)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return Object.entries(COUNTRY_NAMES)
      .filter(([, name]) => name.toLowerCase().includes(q))
      .slice(0, 8)
      .map(([code, name]) => ({ code, name, status: getStatus(code) }))
  }, [query, getStatus])

  const handleChange = (e) => {
    setQuery(e.target.value)
    setSelectedIdx(0)
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIdx(i => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && results[selectedIdx]) {
      handleSelect(results[selectedIdx])
    } else if (e.key === "Escape") {
      setFocused(false)
      inputRef.current?.blur()
    }
  }

  const handleSelect = (item) => {
    onSelect?.(item)
    setQuery("")
    setFocused(false)
    inputRef.current?.blur()
  }

  const statusColor = (status) =>
    status === STATUS.VISITED ? "#34d399" :
    status === STATUS.WANT ? "#fbbf24" : "#64748b"

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Search countries..."
          className="w-full pl-9 pr-8 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-emerald-500/50 focus:bg-slate-800/80 focus:ring-2 focus:ring-emerald-500/10"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-slate-700/50 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {focused && results.length > 0 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-slate-800 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl shadow-black/30 z-50 backdrop-blur-xl">
          {results.map((item, i) => (
            <button
              key={item.code}
              onMouseDown={() => handleSelect(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                i === selectedIdx ? "bg-slate-700/60" : "hover:bg-slate-800/60"
              }`}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColor(item.status) }} />
              <span className="font-medium text-slate-200">{item.name}</span>
              <span className="text-xs ml-auto flex-shrink-0" style={{ color: statusColor(item.status) }}>
                {item.status === STATUS.VISITED ? "Visited" :
                 item.status === STATUS.WANT ? "Want to go" : "Not visited"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
