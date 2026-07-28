import { useState, memo } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useTravel } from "../hooks/useTravel"
import { STATUS } from "../data/countries"
import { numericToA3 } from "../data/mapping"
import { decodeShareData } from "../data/share"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"

const STATUS_STYLE = {
  [STATUS.NONE]: { fill: "var(--color-travel-unvisited)", stroke: "var(--color-travel-border-hi)", hover: "var(--color-travel-border-hi)" },
  [STATUS.VISITED]: { fill: "var(--color-travel-visited)", stroke: "#047857", hover: "#10b981" },
  [STATUS.WANT]: { fill: "var(--color-travel-want)", stroke: "#b45309", hover: "#f59e0b" },
}

const SHARED_MUTED = {
  [STATUS.NONE]: { fill: "#0c1320", stroke: "#1a2440", hover: "#1a2440" },
}

function CountryTooltip({ name, status, x, y, isShared }) {
  const prefix = isShared ? "Shared: " : ""
  const label =
    status === STATUS.VISITED ? `${prefix}Visited` :
    status === STATUS.WANT ? `${prefix}Want to go` : `${prefix}Not visited`

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      role="tooltip"
      className="fixed z-50 pointer-events-none px-3 py-2 rounded-xl bg-[var(--color-travel-surface)] border border-[var(--color-travel-border)] shadow-xl text-sm"
      style={{ left: x + 12, top: y - 10 }}
    >
      <p className="font-semibold text-[var(--color-travel-text-hi)] text-sm leading-tight">{name}</p>
      <p className="text-xs mt-0.5" style={{
        color: status === STATUS.VISITED ? "#34d399" : status === STATUS.WANT ? "#fbbf24" : "var(--color-travel-text-lo)"
      }}>
        {label}
      </p>
    </motion.div>
  )
}

const GeographyShape = memo(function GeographyShape({
  geo, status, onClick, setTooltip, readOnly, isShared,
}) {
  const style = readOnly && !isShared ? SHARED_MUTED : STATUS_STYLE
  const s = style[status] || STATUS_STYLE[STATUS.NONE]
  const code = numericToA3(geo.id)

  return (
    <Geography
      geography={geo}
      onMouseEnter={(evt) => {
        if (!code) return
        const { clientX, clientY } = evt
        setTooltip({ name: geo.properties.name, status, x: clientX, y: clientY, isShared })
      }}
      onMouseLeave={() => setTooltip(null)}
      onClick={() => {
        if (!readOnly && code) onClick(code)
      }}
      style={{
        default: {
          fill: s.fill,
          stroke: s.stroke,
          strokeWidth: 0.5,
          outline: "none",
          transition: "fill 0.3s ease, stroke 0.3s ease",
          cursor: readOnly ? "default" : "pointer",
        },
        hover: {
          fill: s.hover,
          stroke: s.hover,
          strokeWidth: 1,
          outline: "none",
          transition: "fill 0.15s ease",
          cursor: readOnly ? "default" : "pointer",
        },
        pressed: {
          fill: s.hover,
          stroke: s.hover,
          strokeWidth: 1,
          outline: "none",
        },
      }}
    />
  )
})

export default function WorldMap() {
  const { getStatus, toggle } = useTravel()
  const [tooltip, setTooltip] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const sharedData = decodeShareData()
  const readOnly = sharedData !== null

  const getCountryStatus = (code) => {
    if (readOnly) {
      if (sharedData.visited.has(code)) return STATUS.VISITED
      if (sharedData.wantToGo.has(code)) return STATUS.WANT
      return STATUS.NONE
    }
    return getStatus(code)
  }

  const isShared = (code) => {
    if (!readOnly) return false
    return sharedData.visited.has(code) || sharedData.wantToGo.has(code)
  }

  return (
    <div className="relative flex-1 min-h-0 map-mobile rounded-2xl border border-[var(--color-travel-border)] overflow-hidden">
      <AnimatePresence>
        {!loaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--color-travel-bg)]"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[var(--color-travel-text-lo)] animate-spin" />
              <span className="text-sm text-[var(--color-travel-text-lo)]">Loading map...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140, center: [15, 20] }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          zoom={1}
          minZoom={1}
          maxZoom={8}
          translateExtent={[[-200, -100], [1000, 700]]}
          onMoveEnd={() => {}}
        >
          <rect width={800} height={500} style={{ fill: "transparent" }} />
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              if (!loaded && geographies.length > 0) {
                setTimeout(() => setLoaded(true), 0)
              }
              return geographies.map((geo) => {
                const code = numericToA3(geo.id)
                const status = code ? getCountryStatus(code) : STATUS.NONE

                return (
                  <GeographyShape
                    key={geo.rsmKey}
                    geo={geo}
                    status={status}
                    onClick={toggle}
                    setTooltip={setTooltip}
                    readOnly={readOnly}
                    isShared={isShared(code)}
                  />
                )
              })
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <AnimatePresence>
        {tooltip && <CountryTooltip {...tooltip} />}
      </AnimatePresence>

      {readOnly && (
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[var(--color-travel-surface)]/90 border border-[var(--color-travel-border)] text-xs text-[var(--color-travel-text-lo)] font-medium">
          View-only mode
        </div>
      )}

      <div className="absolute bottom-20 sm:bottom-4 left-4 flex items-center gap-3 bg-[var(--color-travel-surface)]/90 rounded-xl px-3 py-2 border border-[var(--color-travel-border)]">
        <LegendItem color="#059669" label="Visited" />
        <LegendItem color="#d97706" label="Want to go" />
        <LegendItem color="var(--color-travel-unvisited)" label="Not visited" />
      </div>

      <div className="absolute bottom-4 right-4 bg-[var(--color-travel-surface)]/90 rounded-xl px-3 py-2 border border-[var(--color-travel-border)] text-xs text-[var(--color-travel-text-lo)] hidden sm:block">
        Scroll to zoom · Drag to pan
      </div>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
      <span className="text-xs text-[var(--color-travel-text-lo)] font-medium">{label}</span>
    </div>
  )
}
