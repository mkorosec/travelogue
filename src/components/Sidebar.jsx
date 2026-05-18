import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, BarChart3, List, Trash2, Globe } from "lucide-react"
import StatsCard from "./StatsCard"
import SearchInput from "./SearchInput"
import CountryList from "./CountryList"
import { useTravel } from "../hooks/useTravel"

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [tab, setTab] = useState("stats")
  const { visitedCount, wantCount, clearAll } = useTravel()

  return (
    <motion.aside
      animate={{ width: collapsed ? 48 : 360 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="relative flex flex-col bg-slate-900/60 backdrop-blur-xl border-l border-slate-800/60 overflow-hidden flex-shrink-0"
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 -left-3 z-10 w-7 h-7 rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-lg"
      >
        {collapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

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
            <div className="flex items-center gap-1 p-3 border-b border-slate-800/60">
              <TabButton active={tab === "stats"} onClick={() => setTab("stats")} icon={<BarChart3 className="w-4 h-4" />} label="Stats" />
              <TabButton active={tab === "list"} onClick={() => setTab("list")} icon={<List className="w-4 h-4" />} label="List" />
              <div className="flex-1" />
              <button
                onClick={clearAll}
                className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Clear all data"
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
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CountryList />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border-t border-slate-800/60 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-400">{visitedCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs text-slate-400">{wantCount}</span>
              </div>
              <div className="flex-1" />
              <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">localStorage</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {collapsed && (
        <div className="flex flex-col items-center py-4 gap-4">
          <button
            onClick={() => { setCollapsed(false); setTab("stats") }}
            className={`p-2 rounded-lg transition-all ${tab === "stats" ? "text-emerald-400 bg-emerald-500/10" : "text-slate-500 hover:text-slate-300"}`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setCollapsed(false); setTab("list") }}
            className={`p-2 rounded-lg transition-all ${tab === "list" ? "text-emerald-400 bg-emerald-500/10" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Globe className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.aside>
  )
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-slate-800 text-white shadow-sm"
          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
