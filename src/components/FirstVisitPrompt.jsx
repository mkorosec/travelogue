import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin } from "lucide-react"

const STORAGE_KEY = "travelogue_first_visit_done"

export default function FirstVisitPrompt() {
  const [show, setShow] = useState(() => {
    return !localStorage.getItem(STORAGE_KEY)
  })

  if (!show) return null

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1")
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60" onClick={handleDismiss} />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-sm bg-[var(--color-travel-surface)] border border-[var(--color-travel-border)] rounded-2xl shadow-2xl p-6 sm:p-8 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
              <MapPin className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Your travel map</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tap any country to mark it as <span className="text-emerald-400 font-semibold">visited</span>.
              Tap again to mark it as <span className="text-amber-400 font-semibold">want to go</span>.
              Your data stays on this device, no account needed.
            </p>
            <button
              onClick={handleDismiss}
              className="mt-6 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors active:scale-[0.98]"
            >
              Start exploring
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
