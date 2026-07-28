import { Share2, Globe, Heart, CheckCircle2, Smartphone } from "lucide-react"

export default function AboutPanel() {
  return (
    <div className="space-y-5 text-sm">
      <Section
        icon={<Globe className="w-4 h-4" />}
        title="How to use"
        body="Tap any country on the map to mark it as visited. Tap again to mark it as want to go. Tap a third time to clear. Your data is saved automatically in your browser."
      />

      <Section
        icon={<Share2 className="w-4 h-4" />}
        title="Sharing"
        body="Use the Share button in the header to generate a link that anyone can open to view your map — no account needed. You can also export your map as a PNG image."
      />

      <Section
        icon={<Heart className="w-4 h-4" />}
        title="Trip planning"
        body="Mark countries you'd like to visit as 'want to go', then share the link with friends. Everyone can see your wishlist and suggest destinations."
        items={[
          { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />, text: "Share where you've been" },
          { icon: <Heart className="w-3.5 h-3.5 text-amber-400" />, text: "Share where you want to go" },
          { icon: <Globe className="w-3.5 h-3.5 text-blue-400" />, text: "Ask friends for their travel lists" },
        ]}
      />

      <div className="border-t border-[var(--color-travel-border)] pt-4">
        <h4 className="text-xs font-semibold text-[var(--color-travel-text-lo)] uppercase tracking-wider mb-2">About</h4>
        <p className="text-xs text-[var(--color-travel-text)] leading-relaxed">
          Travelogue is a free, open-source digital scratch map. Built with React, react-simple-maps, and Framer Motion.
          No accounts, no servers — your data lives entirely in your browser using localStorage.
        </p>
        <div className="flex items-center gap-2 mt-3 text-xs text-[var(--color-travel-text-lo)]">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Works offline · Install as app</span>
        </div>
      </div>
    </div>
  )
}

function Section({ icon, title, body, items }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[var(--color-travel-text-hi)]">{icon}</span>
        <h4 className="text-sm font-semibold text-[var(--color-travel-text-hi)]">{title}</h4>
      </div>
      <p className="text-xs text-[var(--color-travel-text)] leading-relaxed">{body}</p>
      {items && (
        <div className="mt-2 space-y-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-[var(--color-travel-text)]">
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
