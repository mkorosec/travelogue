import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { useTravel } from "../hooks/useTravel"

export default function ClearConfirmation({ onConfirm, onCancel }) {
  const { clearAll, visitedCount, wantCount } = useTravel()

  const handleClear = () => {
    clearAll()
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-sm bg-[var(--color-travel-surface)] border border-[var(--color-travel-border)] rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-[var(--color-travel-text-hi)]">Clear all data?</h3>
            <p className="text-sm text-[var(--color-travel-text)] mt-1">
              This will permanently erase {visitedCount > 0 && <span className="text-emerald-400 font-medium">{visitedCount} visited</span>}
              {visitedCount > 0 && wantCount > 0 && " and "}
              {wantCount > 0 && <span className="text-amber-400 font-medium">{wantCount} want-to-go</span>}
              {(visitedCount > 0 || wantCount > 0) && " "}countr{visitedCount + wantCount === 1 ? "y" : "ies"}.
              This cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-travel-surface-hi)] text-[var(--color-travel-text)] hover:bg-[var(--color-travel-border-hi)] text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors"
          >
            Clear everything
          </button>
        </div>
      </motion.div>
    </div>
  )
}
