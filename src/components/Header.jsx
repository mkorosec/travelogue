import { Globe2, Sun, Moon } from "lucide-react"
import ShareButton from "./ShareButton"
import { useTheme } from "../hooks/useTheme"

export default function Header() {
  const { isDark, toggle } = useTheme()

  return (
    <header className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-[var(--color-travel-border)] bg-[var(--color-travel-surface)]/80 backdrop-blur-sm sticky top-0 z-20 flex-shrink-0">
      <div className="flex items-center gap-2.5 flex-1">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0">
          <Globe2 className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-base font-bold tracking-tight text-[var(--color-travel-text-hi)] leading-none">Travelogue</h1>
          <p className="text-[10px] text-[var(--color-travel-text-lo)] font-medium tracking-wider uppercase">Your travel map</p>
        </div>
      </div>
      <button
        onClick={toggle}
        className="p-2.5 rounded-xl text-[var(--color-travel-text-lo)] hover:text-[var(--color-travel-text-hi)] hover:bg-[var(--color-travel-surface-hi)] transition-colors"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
      <ShareButton />
    </header>
  )
}
