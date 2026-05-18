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
    status === STATUS.VISITED ? "var(--color-travel-visited-text)" :
    status === STATUS.WANT ? "var(--color-travel-want-text)" : "var(--color-travel-text-lo)"

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Search countries..."
          className="w-full pl-9 pr-9 py-3 bg-[var(--color-travel-border)] border border-[var(--color-travel-border-hi)] rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[var(--color-travel-surface-hi)] text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {focused && results.length > 0 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-[var(--color-travel-surface)] border border-[var(--color-travel-border)] rounded-xl overflow-hidden shadow-2xl shadow-black/30 z-50">
          {results.map((item, i) => (
            <button
              key={item.code}
              onMouseDown={() => handleSelect(item)}
              className={`w-full flex items-center gap-3 px-3 py-3 text-left text-sm transition-colors min-h-[44px] ${
                i === selectedIdx ? "bg-[var(--color-travel-surface-hi)]" : "hover:bg-[var(--color-travel-surface-hi)]/60"
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
