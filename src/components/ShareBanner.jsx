import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, Download, X } from "lucide-react"
import { useTravel } from "../hooks/useTravel"
import { decodeShareData } from "../data/share"

export default function ShareBanner() {
  const { setVisited, setWant, visited, wantToGo } = useTravel()
  const [dismissed, setDismissed] = useState(false)

  const sharedData = decodeShareData()

  if (!sharedData || dismissed) return null

  const sharedVisited = sharedData.visited.size
  const sharedWant = sharedData.wantToGo.size
  const isImported = [...sharedData.visited].every(c => visited.has(c))
    && [...sharedData.wantToGo].every(c => wantToGo.has(c))

  const handleImport = () => {
    const mergedVisited = new Set([...visited, ...sharedData.visited])
    const mergedWant = new Set([...wantToGo, ...sharedData.wantToGo])
    for (const code of sharedData.visited) mergedWant.delete(code)
    setVisited([...mergedVisited])
    setWant([...mergedWant])
    setDismissed(true)
    window.location.hash = ""
  }

  const handleDismiss = () => {
    setDismissed(true)
    window.location.hash = ""
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-emerald-900/30 via-[var(--color-travel-bg)] to-amber-900/30 border-b border-[var(--color-travel-border)] flex-shrink-0"
    >
      <div className="flex items-center gap-3 px-4 sm:px-6 py-2.5 max-w-full">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-travel-surface-hi)] flex items-center justify-center flex-shrink-0">
          <Eye className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--color-travel-text-hi)]">
            Viewing a shared map
          </p>
          <p className="text-xs text-[var(--color-travel-text-lo)]">
            {sharedVisited > 0 && (
              <span className="text-emerald-400 font-medium">{sharedVisited} visited</span>
            )}
            {sharedVisited > 0 && sharedWant > 0 && (
              <span className="text-[var(--color-travel-text-lo)]"> · </span>
            )}
            {sharedWant > 0 && (
              <span className="text-amber-400 font-medium">{sharedWant} want to go</span>
            )}
            <span className="text-[var(--color-travel-text-lo)]"> · </span>
            <span className="hidden sm:inline">Your own data is preserved</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isImported ? (
            <button
              onClick={handleImport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import to my map</span>
              <span className="sm:hidden">Import</span>
            </button>
          ) : (
            <span className="text-xs text-emerald-400 font-medium px-2 hidden sm:inline">Already imported</span>
          )}
          <button
            onClick={handleDismiss}
            className="p-2 rounded-lg hover:bg-[var(--color-travel-surface-hi)] text-[var(--color-travel-text-lo)] hover:text-[var(--color-travel-text)] transition-colors"
            aria-label="Dismiss shared map"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
