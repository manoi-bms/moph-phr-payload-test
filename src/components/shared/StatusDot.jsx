export default function StatusDot({ active, className = '' }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${active ? 'bg-green-400' : 'bg-red-400'} ${className}`}
    />
  )
}
