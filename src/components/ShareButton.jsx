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
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
          enabled:bg-slate-800 enabled:hover:bg-slate-700 enabled:text-slate-300 enabled:hover:text-white
          disabled:opacity-40 disabled:cursor-not-allowed"
        title={total === 0 ? "Mark some countries first" : "Share your map"}
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700/50 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden backdrop-blur-xl"
          >
            <div className="p-4 space-y-3">
              <p className="text-sm font-semibold text-white">Share your map</p>
              <p className="text-xs text-slate-400">
                This link shows a read-only view of your {total} marked countries.
                Anyone with the link can see it — no account needed.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-slate-300 bg-slate-900 rounded-lg px-3 py-2 truncate font-mono border border-slate-700/50 select-all">
                  {url}
                </code>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
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
        )}
      </AnimatePresence>
    </div>
  )
}
