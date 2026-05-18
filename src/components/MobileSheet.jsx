import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, List, X, Trash2 } from "lucide-react"
import StatsCard from "./StatsCard"
import SearchInput from "./SearchInput"
import CountryList from "./CountryList"
import ClearConfirmation from "./ClearConfirmation"
import { useTravel } from "../hooks/useTravel"

export default function MobileSheet() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState("stats")
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const { visitedCount, wantCount } = useTravel()

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="mobile-toggle fixed bottom-5 right-5 z-40 w-14 h-14 rounded-2xl
          bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40
          flex items-center justify-center transition-colors active:scale-95"
        aria-label="Open stats"
      >
        {open ? <X className="w-6 h-6" /> : <BarChart3 className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mobile-toggle fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="mobile-toggle fixed inset-x-0 bottom-0 z-30 max-h-[70vh]
                bg-[var(--color-travel-bg)] border-t border-[var(--color-travel-border)]
                rounded-t-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-8 h-1 rounded-full bg-[var(--color-travel-border-hi)]" />
              </div>

              <div className="flex items-center gap-1 px-4 pb-2 border-b border-[var(--color-travel-border)] flex-shrink-0">
                <SheetTab active={tab === "stats"} onClick={() => setTab("stats")} icon={<BarChart3 className="w-4 h-4" />} label="Stats" />
                <SheetTab active={tab === "list"} onClick={() => setTab("list")} icon={<List className="w-4 h-4" />} label="List" />
                <div className="flex-1" />
                <div className="flex items-center gap-1.5 px-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-slate-400 tabular-nums">{visitedCount}</span>
                  <div className="w-2 h-2 rounded-full bg-amber-500 ml-1" />
                  <span className="text-xs font-medium text-slate-400 tabular-nums">{wantCount}</span>
                </div>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="p-2.5 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label="Clear all data"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 pb-safe">
                <AnimatePresence mode="wait">
                  {tab === "stats" ? (
                    <motion.div
                      key="stats"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showClearConfirm && (
        <ClearConfirmation
          onConfirm={() => setShowClearConfirm(false)}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </>
  )
}

function SheetTab({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
        active
          ? "bg-[var(--color-travel-surface-hi)] text-white"
          : "text-slate-500 hover:text-slate-300"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
