import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, List, Trash2, ChevronUp, Info } from "lucide-react"
import StatsCard from "./StatsCard"
import SearchInput from "./SearchInput"
import CountryList from "./CountryList"
import ClearConfirmation from "./ClearConfirmation"
import AboutPanel from "./AboutPanel"
import { useTravel } from "../hooks/useTravel"

export default function MobileSheet({ open, setOpen }) {
  const [tab, setTab] = useState("stats")
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const { visitedCount, wantCount, progress } = useTravel()

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setOpen(true)}
            className="mobile-toggle fixed bottom-0 left-0 right-0 z-30 mx-3 mb-3 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--color-travel-surface)]/95 backdrop-blur-md border border-[var(--color-travel-border)] shadow-lg shadow-black/20 active:scale-[0.98] transition-transform"
            aria-label="Open stats"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-[var(--color-travel-text-hi)] tabular-nums">{visitedCount}</span>
              </div>
              {wantCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-[var(--color-travel-text-hi)] tabular-nums">{wantCount}</span>
                </div>
              )}
              <span className="text-sm text-[var(--color-travel-text-lo)] ml-1">
                · {Math.round(progress)}%
              </span>
            </div>
            <ChevronUp className="w-4 h-4 text-[var(--color-travel-text-lo)] flex-shrink-0" />
          </motion.button>
        )}
      </AnimatePresence>

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
              className="mobile-toggle fixed inset-x-0 bottom-0 z-30 max-h-[75vh]
                bg-[var(--color-travel-surface)] border-t border-[var(--color-travel-border)]
                rounded-t-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-8 h-1 rounded-full bg-[var(--color-travel-border-hi)]" />
              </div>

              <div className="flex items-center gap-1 px-4 pb-2 border-b border-[var(--color-travel-border)] flex-shrink-0">
                <SheetTab active={tab === "stats"} onClick={() => setTab("stats")} icon={<BarChart3 className="w-4 h-4" />} label="Stats" />
                <SheetTab active={tab === "list"} onClick={() => setTab("list")} icon={<List className="w-4 h-4" />} label="List" />
                <SheetTab active={tab === "about"} onClick={() => setTab("about")} icon={<Info className="w-4 h-4" />} label="About" />
                <div className="flex-1" />
                <div className="flex items-center gap-1.5 px-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-[var(--color-travel-text-lo)] tabular-nums">{visitedCount}</span>
                  <div className="w-2 h-2 rounded-full bg-amber-500 ml-1" />
                  <span className="text-xs font-medium text-[var(--color-travel-text-lo)] tabular-nums">{wantCount}</span>
                </div>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="p-2.5 rounded-xl text-[var(--color-travel-text-lo)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
          ? "bg-[var(--color-travel-surface-hi)] text-[var(--color-travel-text-hi)]"
          : "text-[var(--color-travel-text-lo)] hover:text-[var(--color-travel-text)]"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
