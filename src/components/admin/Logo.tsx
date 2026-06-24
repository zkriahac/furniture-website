export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
      <img src="/admin-logo.svg" alt="Mobilyam" style={{ width: 36, height: 36 }} />
      <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: 'currentColor' }}>
        Mobilyam
      </span>
    </div>
  )
}
