// Renders text with `inline code` spans (backtick-delimited) as <code>.
export default function RichText({ text, className }) {
  if (!text) return null
  const parts = String(text).split(/(`[^`]+`)/g)
  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.startsWith('`') && p.endsWith('`') && p.length > 1 ? (
          <code key={i}>{p.slice(1, -1)}</code>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  )
}
