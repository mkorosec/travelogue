import { createContext, useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "travelogue_theme"

function loadTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "light") return false
  } catch { /* localStorage unavailable */ }
  return true
}

function applyTheme(isDark) {
  document.documentElement.classList.toggle("dark", isDark)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.content = isDark ? "#0b1121" : "#f8fafc"
}

const ThemeContext = createContext(null)

export { ThemeContext }

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(loadTheme)

  useEffect(() => {
    applyTheme(isDark)
  }, [isDark])

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light")
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
