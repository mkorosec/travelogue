import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Navigation, Loader2 } from "lucide-react"
import { COUNTRY_NAMES } from "../data/countries"

const STORAGE_KEY = "travelogue_first_visit_done"

export default function FirstVisitPrompt() {
  const [show, setShow] = useState(() => {
    return !localStorage.getItem(STORAGE_KEY)
  })
  const [detectedCountry, setDetectedCountry] = useState(null)
  const [detecting, setDetecting] = useState(() => !!navigator?.geolocation)

  useEffect(() => {
    if (!show || !navigator?.geolocation) return

    let cancelled = false
    const timeout = setTimeout(() => { if (!cancelled) setDetecting(false) }, 5000)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (cancelled) return
        clearTimeout(timeout)
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3`
          )
          const data = await res.json()
          const countryCode = data?.address?.country_code?.toUpperCase()
          if (countryCode && COUNTRY_NAMES[countryCode]) {
            setDetectedCountry(countryCode)
          }
        } catch { /* GPS lookup unavailable */ }
        if (!cancelled) setDetecting(false)
      },
      () => { if (!cancelled) setDetecting(false) },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
    )

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [show])

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
            <h2 className="text-xl font-bold text-[var(--color-travel-text-hi)] mb-2">Your travel map</h2>
            <p className="text-sm text-[var(--color-travel-text)] leading-relaxed mb-5">
              Tap any country to mark it as <span className="text-emerald-400 font-semibold">visited</span>.
              Tap again to mark it as <span className="text-amber-400 font-semibold">want to go</span>.
              Your data stays on this device, no account needed.
            </p>

            {detecting && (
              <div className="flex items-center justify-center gap-2 mb-5 text-sm text-[var(--color-travel-text-lo)]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Detecting your location...
              </div>
            )}

            {!detecting && detectedCountry && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
              >
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">
                    You're in {COUNTRY_NAMES[detectedCountry]}!
                  </span>
                </div>
                <p className="text-xs text-[var(--color-travel-text-lo)]">
                  Find it on the map and tap to mark it as visited — it's your first country!
                </p>
              </motion.div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDismiss}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors active:scale-[0.98]"
              >
                Start exploring
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
