const HASH_PREFIX = "share="

export function encodeShareData(visited, wantToGo) {
  const payload = JSON.stringify({
    v: [...visited],
    w: [...wantToGo],
  })
  return btoa(payload)
}

export function decodeShareData() {
  try {
    const hash = window.location.hash.slice(1)
    if (!hash.startsWith(HASH_PREFIX)) return null
    const encoded = hash.slice(HASH_PREFIX.length)
    const json = atob(encoded)
    const data = JSON.parse(json)
    if (!data.v && !data.w) return null
    return {
      visited: new Set(data.v || []),
      wantToGo: new Set(data.w || []),
    }
  } catch {
    return null
  }
}

export function buildShareUrl(visited, wantToGo) {
  const base = window.location.origin + window.location.pathname
  const encoded = encodeShareData(visited, wantToGo)
  return `${base}#${HASH_PREFIX}${encoded}`
}
