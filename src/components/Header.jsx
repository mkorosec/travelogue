import { Globe2 } from "lucide-react"
import ShareButton from "./ShareButton"

export default function Header() {
  return (
    <header className="flex items-center gap-3 px-6 py-4 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Globe2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white leading-none">Travelogue</h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Your World, Marked</p>
        </div>
      </div>
      <ShareButton />
    </header>
  )
}
