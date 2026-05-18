import { useContext } from "react"
import { TravelContext } from "../context/TravelContext"

export function useTravel() {
  const ctx = useContext(TravelContext)
  if (!ctx) throw new Error("useTravel must be used within TravelProvider")
  return ctx
}
