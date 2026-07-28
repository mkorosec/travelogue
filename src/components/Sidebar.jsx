import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, BarChart3, List, Trash2, Globe, Info } from "lucide-react"
import StatsCard from "./StatsCard"
import SearchInput from "./SearchInput"
import CountryList from "./CountryList"
import ClearConfirmation from "./ClearConfirmation"
import AboutPanel from "./AboutPanel"
import { useTravel } from "../hooks/useTravel"

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [tab, setTab] = useState("stats")
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const { visitedCount, wantCount } = useTravel()

  return (
    <>
      <motion.button
        animate={{ right: collapsed ? 34 : 346 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={() => setCollapsed(!collapsed)}
        className="sidebar-desktop absolute top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-[var(--color-travel-surface-hi)] border border-[var(--color-travel-border)] flex items-center justify-center text-[var(--color-travel-text-lo)] hover:text-[var(--color-travel-text-hi)] hover:bg-[var(--color-travel-border-hi)] transition-colors shadow-md"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </motion.button>

      <motion.aside
        animate={{ width: collapsed ? 48 : 360 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="sidebar-desktop relative flex flex-col bg-[var(--color-travel-surface)] border-l border-[var(--color-travel-border)] overflow-hidden flex-shrink-0 h-full"
      >
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center gap-1 p-3 border-b border-[var(--color-travel-border)]">
                <TabButton active={tab === "stats"} onClick={() => setTab("stats")} icon={<BarChart3 className="w-4 h-4" />} label="Stats" />
                <TabButton active={tab === "list"} onClick={() => setTab("list")} icon={<List className="w-4 h-4" />} label="List" />
                <TabButton active={tab === "about"} onClick={() => setTab("about")} icon={<Info className="w-4 h-4" />} label="About" />
                <div className="flex-1" />
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="p-2 rounded-lg text-[var(--color-travel-text-lo)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label="Clear all data"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                  {tab === "stats" ? (
                    <motion.div
                      key="stats"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      <SearchInput onSelect={() => {}} />
                      <StatsCard />
                    </motion.div>
                  ) : tab === "list" ? (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CountryList />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AboutPanel />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-3 border-t border-[var(--color-travel-border)] flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-[var(--color-travel-text)] tabular-nums">{visitedCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-[var(--color-travel-text)] tabular-nums">{wantCount}</span>
                </div>
                <div className="flex-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <div className="flex flex-col items-center py-4 gap-5">
            <button
              onClick={() => { setCollapsed(false); setTab("stats") }}
              className={`p-2.5 rounded-xl transition-colors ${tab === "stats" ? "text-emerald-400 bg-emerald-500/10" : "text-[var(--color-travel-text-lo)] hover:text-[var(--color-travel-text)]"}`}
              aria-label="Stats"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setCollapsed(false); setTab("list") }}
              className={`p-2.5 rounded-xl transition-colors ${tab === "list" ? "text-emerald-400 bg-emerald-500/10" : "text-[var(--color-travel-text-lo)] hover:text-[var(--color-travel-text)]"}`}
              aria-label="Country list"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setCollapsed(false); setTab("about") }}
              className={`p-2.5 rounded-xl transition-colors ${tab === "about" ? "text-emerald-400 bg-emerald-500/10" : "text-[var(--color-travel-text-lo)] hover:text-[var(--color-travel-text)]"}`}
              aria-label="About"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.aside>

      {showClearConfirm && (
        <ClearConfirmation
          onConfirm={() => setShowClearConfirm(false)}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </>
  )
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
        active
          ? "bg-[var(--color-travel-surface-hi)] text-[var(--color-travel-text-hi)]"
          : "text-[var(--color-travel-text-lo)] hover:text-[var(--color-travel-text)] hover:bg-[var(--color-travel-surface-hi)]/50"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
