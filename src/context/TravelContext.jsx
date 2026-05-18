import { createContext, useReducer, useCallback } from "react"
import { STATUS, COUNTRY_CONTINENT, TOTAL_COUNTRIES } from "../data/countries"

const STORAGE_KEY = "travelogue_data"

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        visited: new Set(parsed.visited || []),
        wantToGo: new Set(parsed.wantToGo || []),
      }
    }
  } catch {
    // localStorage may be unavailable in some environments
  }
  return { visited: new Set(), wantToGo: new Set() }
}

function saveState(visited, wantToGo) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    visited: [...visited],
    wantToGo: [...wantToGo],
  }))
}

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE": {
      const code = action.code
      const visited = new Set(state.visited)
      const wantToGo = new Set(state.wantToGo)

      if (visited.has(code)) {
        visited.delete(code)
        wantToGo.add(code)
      } else if (wantToGo.has(code)) {
        wantToGo.delete(code)
      } else {
        visited.add(code)
      }

      saveState(visited, wantToGo)
      return { visited, wantToGo }
    }
    case "SET_VISITED": {
      const visited = new Set(action.codes)
      const wantToGo = new Set([...state.wantToGo].filter(c => !visited.has(c)))
      saveState(visited, wantToGo)
      return { visited, wantToGo }
    }
    case "SET_WANT": {
      const wantToGo = new Set(action.codes)
      const visited = new Set([...state.visited].filter(c => !wantToGo.has(c)))
      saveState(visited, wantToGo)
      return { visited, wantToGo }
    }
    case "CLEAR_ALL": {
      saveState(new Set(), new Set())
      return { visited: new Set(), wantToGo: new Set() }
    }
    case "MARK_CONTINENT": {
      const continent = action.continent
      const visited = new Set(state.visited)
      const wantToGo = new Set(state.wantToGo)
      for (const [code, cont] of Object.entries(COUNTRY_CONTINENT)) {
        if (cont === continent) {
          visited.add(code)
          wantToGo.delete(code)
        }
      }
      saveState(visited, wantToGo)
      return { visited, wantToGo }
    }
    default:
      return state
  }
}

const TravelContext = createContext(null)

export { TravelContext }

export function TravelProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)

  const toggle = useCallback((code) => dispatch({ type: "TOGGLE", code }), [])
  const setVisited = useCallback((codes) => dispatch({ type: "SET_VISITED", codes }), [])
  const setWant = useCallback((codes) => dispatch({ type: "SET_WANT", codes }), [])
  const clearAll = useCallback(() => dispatch({ type: "CLEAR_ALL" }), [])
  const markContinent = useCallback((continent) => dispatch({ type: "MARK_CONTINENT", continent }), [])

  const getStatus = useCallback((code) => {
    if (state.visited.has(code)) return STATUS.VISITED
    if (state.wantToGo.has(code)) return STATUS.WANT
    return STATUS.NONE
  }, [state.visited, state.wantToGo])

  const continentStats = {}
  for (const [code, cont] of Object.entries(COUNTRY_CONTINENT)) {
    if (!continentStats[cont]) {
      continentStats[cont] = { total: 0, visited: 0, want: 0 }
    }
    continentStats[cont].total++
    if (state.visited.has(code)) continentStats[cont].visited++
    if (state.wantToGo.has(code)) continentStats[cont].want++
  }

  const value = {
    visited: state.visited,
    wantToGo: state.wantToGo,
    visitedCount: state.visited.size,
    wantCount: state.wantToGo.size,
    totalCountries: TOTAL_COUNTRIES,
    progress: TOTAL_COUNTRIES > 0 ? (state.visited.size / TOTAL_COUNTRIES) * 100 : 0,
    continentStats,
    toggle,
    setVisited,
    setWant,
    clearAll,
    markContinent,
    getStatus,
  }

  return (
    <TravelContext.Provider value={value}>
      {children}
    </TravelContext.Provider>
  )
}
