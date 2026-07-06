export default function StatusBadge({
  active,
  activeText,
  inactiveText,
  danger,
  warn
}: {
  active?: boolean
  activeText: string
  inactiveText: string
  danger?: boolean
  warn?: boolean
}) {
  const cls = active ? (danger ? 'badge danger' : warn ? 'badge warn' : 'badge ok') : 'badge off'
  return <span className={cls}>{active ? activeText : inactiveText}</span>
}
