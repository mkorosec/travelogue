import { useState } from "react"
import { TravelProvider } from "./context/TravelContext"
import { ThemeProvider } from "./context/ThemeContext"
import Header from "./components/Header"
import WorldMap from "./components/WorldMap"
import Sidebar from "./components/Sidebar"
import MobileSheet from "./components/MobileSheet"
import ShareBanner from "./components/ShareBanner"
import FirstVisitPrompt from "./components/FirstVisitPrompt"
import Celebration from "./components/Celebration"

export default function App() {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

  return (
    <ThemeProvider>
      <TravelProvider>
        <div className="h-dvh flex flex-col">
          <Header />
          <ShareBanner />
          <div className="flex-1 flex min-h-0 relative">
            <WorldMap />
            <Sidebar />
            <MobileSheet open={mobileSheetOpen} setOpen={setMobileSheetOpen} />
          </div>
          <FirstVisitPrompt />
          <Celebration />
        </div>
      </TravelProvider>
    </ThemeProvider>
  )
}
