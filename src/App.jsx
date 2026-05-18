import { TravelProvider } from "./context/TravelContext"
import Header from "./components/Header"
import WorldMap from "./components/WorldMap"
import Sidebar from "./components/Sidebar"
import MobileSheet from "./components/MobileSheet"
import ShareBanner from "./components/ShareBanner"
import FirstVisitPrompt from "./components/FirstVisitPrompt"

export default function App() {
  return (
    <TravelProvider>
      <div className="h-dvh flex flex-col bg-[var(--color-travel-bg)]">
        <Header />
        <ShareBanner />
        <div className="flex-1 flex min-h-0 relative">
          <WorldMap />
          <Sidebar />
          <MobileSheet />
        </div>
        <FirstVisitPrompt />
      </div>
    </TravelProvider>
  )
}
