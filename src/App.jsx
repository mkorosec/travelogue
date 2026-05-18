import { TravelProvider } from "./context/TravelContext"
import Header from "./components/Header"
import WorldMap from "./components/WorldMap"
import Sidebar from "./components/Sidebar"
import ShareBanner from "./components/ShareBanner"

export default function App() {
  return (
    <TravelProvider>
      <div className="h-dvh flex flex-col bg-slate-950">
        <Header />
        <ShareBanner />
        <div className="flex-1 flex min-h-0">
          <WorldMap />
          <Sidebar />
        </div>
      </div>
    </TravelProvider>
  )
}
