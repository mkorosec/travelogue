import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, Check, Copy } from "lucide-react"
import { useTravel } from "../hooks/useTravel"
import { buildShareUrl } from "../data/share"

export default function ShareButton() {
  const { visited, wantToGo, visitedCount, wantCount } = useTravel()
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const total = visitedCount + wantCount
  const url = total > 0 ? buildShareUrl(visited, wantToGo) : ""

  const handleCopy = async () => {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={total === 0}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors
          enabled:bg-[var(--color-travel-surface-hi)] enabled:hover:bg-[var(--color-travel-border-hi)] enabled:text-slate-300 enabled:hover:text-white
          disabled:opacity-40 disabled:cursor-not-allowed"
        title={total === 0 ? "Mark some countries first" : "Share your map"}
        aria-label="Share map"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-sm bg-[var(--color-travel-surface)] border border-[var(--color-travel-border)] rounded-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <p className="text-sm font-semibold text-white">Share your map</p>
                <p className="text-xs text-slate-400">
                  Anyone with this link can view your {total} marked countries — no account needed.
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-slate-300 bg-[var(--color-travel-bg)] rounded-lg px-3 py-2.5 truncate font-mono border border-[var(--color-travel-border)] select-all">
                    {url}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="flex-shrink-0 p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    aria-label="Copy share link"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-emerald-400 font-medium"
                  >
                    Copied to clipboard
                  </motion.p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
