import { useState, memo } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps"
import { motion, AnimatePresence } from "framer-motion"
import { useTravel } from "../hooks/useTravel"
import { STATUS } from "../data/countries"
import { numericToA3 } from "../data/mapping"
import { decodeShareData } from "../data/share"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const STATUS_STYLE = {
  [STATUS.NONE]: { fill: "#1e293b", stroke: "#334155", hover: "#334155" },
  [STATUS.VISITED]: { fill: "#059669", stroke: "#047857", hover: "#10b981" },
  [STATUS.WANT]: { fill: "#d97706", stroke: "#b45309", hover: "#f59e0b" },
}

const SHARED_STATUS_STYLE = {
  [STATUS.NONE]: { fill: "#0f172a", stroke: "#1e293b", hover: "#1e293b" },
  [STATUS.VISITED]: { fill: "#059669", stroke: "#047857", hover: "#10b981" },
  [STATUS.WANT]: { fill: "#d97706", stroke: "#b45309", hover: "#f59e0b" },
}

function CountryTooltip({ name, status, x, y, isShared }) {
  const prefix = isShared ? "Shared: " : ""
  const statusLabel =
    status === STATUS.VISITED ? `${prefix}Visited` :
    status === STATUS.WANT ? `${prefix}Want to go` : `${prefix}Not visited`

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      className="fixed z-50 pointer-events-none px-3 py-2 rounded-xl bg-slate-800/95 backdrop-blur-md border border-slate-700/50 shadow-xl text-sm"
      style={{ left: x + 12, top: y - 10 }}
    >
      <p className="font-semibold text-white text-sm leading-tight">{name}</p>
      <p className="text-xs mt-0.5" style={{
        color: status === STATUS.VISITED ? "#34d399" : status === STATUS.WANT ? "#fbbf24" : "#64748b"
      }}>
        {statusLabel}
      </p>
    </motion.div>
  )
}

const GeographyShape = memo(function GeographyShape({
  geo, status, onClick, setTooltip, readOnly, isShared,
}) {
  const style = readOnly && !isShared ? SHARED_STATUS_STYLE : STATUS_STYLE
  const s = style[status]
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
          fill: readOnly ? s.hover : s.hover,
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
    <div className="relative flex-1 min-h-0 bg-slate-950 rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl shadow-black/30">
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
            {({ geographies }) =>
              geographies.map((geo) => {
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
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <AnimatePresence>
        {tooltip && <CountryTooltip {...tooltip} />}
      </AnimatePresence>

      {readOnly && (
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/50 text-xs text-slate-400 font-medium">
          View-only mode
        </div>
      )}

      <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-slate-900/90 backdrop-blur-md rounded-xl px-4 py-2.5 border border-slate-700/50">
        <LegendItem color="#059669" label="Visited" />
        <LegendItem color="#d97706" label="Want to go" />
        <LegendItem color="#1e293b" label="Not visited" />
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md rounded-xl px-3 py-2 border border-slate-700/50 text-xs text-slate-400">
        <span>Scroll to zoom</span>
        <span className="text-slate-600">·</span>
        <span>Drag to pan</span>
      </div>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-sm" style={{ background: color, border: `1px solid ${color}` }} />
      <span className="text-xs text-slate-400 font-medium">{label}</span>
    </div>
  )
}
