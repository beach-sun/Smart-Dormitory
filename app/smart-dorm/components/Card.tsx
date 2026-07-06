export function Card({ title, value, unit, hint }: { title: string; value: string | number; unit?: string; hint?: string }) {
  return (
    <article className="metric-card">
      <div className="metric-head"><span>{title}</span><span>●</span></div>
      <div className="metric-value"><strong>{value}</strong>{unit ? <span className="metric-unit">{unit}</span> : null}</div>
      {hint ? <p className="muted">{hint}</p> : null}
    </article>
  )
}
