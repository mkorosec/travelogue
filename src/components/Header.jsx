import { Globe2 } from "lucide-react"
import ShareButton from "./ShareButton"

export default function Header() {
  return (
    <header className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-[var(--color-travel-border)] bg-[var(--color-travel-bg)] sticky top-0 z-20 flex-shrink-0">
      <div className="flex items-center gap-2.5 flex-1">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0">
          <Globe2 className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-base font-bold tracking-tight text-white leading-none">Travelogue</h1>
          <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Your travel map</p>
        </div>
      </div>
      <ShareButton />
    </header>
  )
}
