import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-gradient-to-r from-emerald-900/60 via-slate-900/80 to-amber-900/60 border-b border-slate-700/50 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 px-6 py-3 max-w-full">
          <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center flex-shrink-0">
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">
              Viewing a shared map
            </p>
            <p className="text-xs text-slate-400">
              {sharedVisited > 0 && (
                <span className="text-emerald-400 font-medium">{sharedVisited} visited</span>
              )}
              {sharedVisited > 0 && sharedWant > 0 && (
                <span className="text-slate-600"> · </span>
              )}
              {sharedWant > 0 && (
                <span className="text-amber-400 font-medium">{sharedWant} want to go</span>
              )}
              <span className="text-slate-600"> · </span>
              <span>Your own data is preserved</span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isImported && (
              <button
                onClick={handleImport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Import to my map
              </button>
            )}
            {isImported && (
              <span className="text-xs text-emerald-400 font-medium px-2">Already imported</span>
            )}
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
