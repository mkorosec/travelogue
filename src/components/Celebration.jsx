import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy } from "lucide-react"
import { useTravel } from "../hooks/useTravel"

export default function Celebration() {
  const { milestone, dismissMilestone } = useTravel()

  useEffect(() => {
    if (!milestone) return
    const timer = setTimeout(dismissMilestone, 4000)
    return () => clearTimeout(timer)
  }, [milestone, dismissMilestone])

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-gradient-to-br from-amber-500/20 via-[var(--color-travel-surface)] to-emerald-500/20 border border-[var(--color-travel-border)] rounded-2xl shadow-2xl shadow-black/30 px-6 py-4 flex items-center gap-4 backdrop-blur-md">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
            </motion.div>
            <div>
              <p className="text-sm font-bold text-[var(--color-travel-text-hi)]">
                {milestone.count} {milestone.count === 1 ? "country" : "countries"}!
              </p>
              <p className="text-xs text-[var(--color-travel-text-lo)]">
                You've seen {milestone.progress}% of the world
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
