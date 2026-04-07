import { useState } from 'react'
import { useHistory } from '../context/HistoryContext'
import { MethodBadge, StatusCodeBadge } from './shared/Badge'

export default function HistoryBar({ onReplay }) {
  const { entries, clearHistory } = useHistory()
  const [expanded, setExpanded] = useState(false)

  if (entries.length === 0 && !expanded) return null

  return (
    <div className="shrink-0 border-t border-gray-700 bg-gray-800">
      {/* Toggle bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-1.5 text-xs text-gray-400 hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          <span>History ({entries.length})</span>
        </div>
        {entries.length > 0 && expanded && (
          <button
            onClick={(e) => { e.stopPropagation(); clearHistory() }}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            Clear
          </button>
        )}
      </button>

      {/* Expanded list */}
      {expanded && (
        <div className="max-h-48 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="px-4 py-3 text-xs text-gray-600 text-center">No requests yet</div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-gray-700">
                  <th className="px-3 py-1 text-left font-medium">Time</th>
                  <th className="px-3 py-1 text-left font-medium">Method</th>
                  <th className="px-3 py-1 text-left font-medium">Endpoint</th>
                  <th className="px-3 py-1 text-left font-medium">Status</th>
                  <th className="px-3 py-1 text-right font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr
                    key={entry.id}
                    onClick={() => onReplay(entry)}
                    className="cursor-pointer hover:bg-gray-700/50 border-b border-gray-700/50 transition-colors"
                  >
                    <td className="px-3 py-1.5 text-gray-500 whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-3 py-1.5">
                      <MethodBadge method={entry.method} />
                    </td>
                    <td className="px-3 py-1.5 text-gray-300 truncate max-w-[200px]">
                      {entry.endpointName}
                    </td>
                    <td className="px-3 py-1.5">
                      {entry.status > 0 ? (
                        <StatusCodeBadge code={entry.status} />
                      ) : (
                        <span className="text-red-400">ERR</span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-gray-500 text-right whitespace-nowrap">
                      {entry.elapsed}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
