export async function exportMapAsPng() {
  const svgEl = document.querySelector(".rsm-svg")
  if (!svgEl) throw new Error("Map not found")

  const rect = svgEl.parentElement.getBoundingClientRect()
  const width = Math.round(rect.width)
  const height = Math.round(rect.height)
  const scale = 2

  const rootStyle = getComputedStyle(document.documentElement)
  const bg = rootStyle.getPropertyValue("--color-travel-bg").trim() || "#0b1121"
  const unvisited = rootStyle.getPropertyValue("--color-travel-unvisited").trim() || "#1e293b"
  const borderHi = rootStyle.getPropertyValue("--color-travel-border-hi").trim() || "#334155"
  const visited = rootStyle.getPropertyValue("--color-travel-visited").trim() || "#059669"
  const want = rootStyle.getPropertyValue("--color-travel-want").trim() || "#d97706"

  const colorMap = {
    "--color-travel-unvisited": unvisited,
    "--color-travel-border-hi": borderHi,
    "--color-travel-visited": visited,
    "--color-travel-want": want,
  }

  const clone = svgEl.cloneNode(true)
  clone.setAttribute("width", width)
  clone.setAttribute("height", height)

  const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
  bgRect.setAttribute("width", "100%")
  bgRect.setAttribute("height", "100%")
  bgRect.setAttribute("fill", bg)
  clone.insertBefore(bgRect, clone.firstChild)

  const srcPaths = svgEl.querySelectorAll("path")
  const dstPaths = clone.querySelectorAll("path")

  for (let i = 0; i < dstPaths.length; i++) {
    const src = srcPaths[i]
    const dst = dstPaths[i]
    if (!src || !dst) continue

    const cs = window.getComputedStyle(src)
    const fill = resolveVar(cs.getPropertyValue("fill"), colorMap)
    const stroke = resolveVar(cs.getPropertyValue("stroke"), colorMap)

    if (fill && fill !== "none") dst.setAttribute("fill", fill)
    else dst.setAttribute("fill", unvisited)

    if (stroke && stroke !== "none") dst.setAttribute("stroke", stroke)
    else dst.setAttribute("stroke", borderHi)

    dst.setAttribute("stroke-width", cs.getPropertyValue("stroke-width") || "0.5")
  }

  const data = new XMLSerializer().serializeToString(clone)
  const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" })
  const url = URL.createObjectURL(svgBlob)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = width * scale
      canvas.height = height * scale
      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0, width * scale, height * scale)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Failed to create PNG"))
      }, "image/png")
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load SVG"))
    }
    img.src = url
  })
}

function resolveVar(value, colorMap) {
  if (!value) return null
  const m = value.match(/^var\((--[^)]+)\)/)
  if (m) return colorMap[m[1].trim()] || null
  return value
}
