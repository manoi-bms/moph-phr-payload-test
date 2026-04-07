import { useState } from 'react'
import { getEndpointsByGroup, getGroupLabel } from '../config/endpoints'
import { useEndpoint } from '../context/EndpointContext'
import { MethodBadge } from './shared/Badge'

const GROUPS = ['upload', 'retrieval', 'utility']

function GroupSection({ group }) {
  const [collapsed, setCollapsed] = useState(false)
  const { selectedEndpoint, selectEndpoint } = useEndpoint()
  const groupEndpoints = getEndpointsByGroup(group)
  const label = getGroupLabel(group)

  return (
    <div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:bg-gray-700/50"
      >
        <span>{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded-full">{groupEndpoints.length}</span>
          <svg
            className={`w-3 h-3 transition-transform ${collapsed ? '' : 'rotate-90'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
      {!collapsed && (
        <div className="pb-1">
          {groupEndpoints.map(ep => {
            const isSelected = selectedEndpoint?.id === ep.id
            return (
              <button
                key={ep.id}
                onClick={() => selectEndpoint(ep.id)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors ${
                  isSelected
                    ? 'bg-indigo-600/20 border-l-2 border-indigo-500 text-gray-100'
                    : 'border-l-2 border-transparent text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'
                }`}
                title={ep.description}
              >
                <MethodBadge method={ep.method} />
                <span className="truncate">{ep.name}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function EndpointSidebar() {
  return (
    <aside className="w-64 bg-gray-800/50 border-r border-gray-700 flex flex-col overflow-y-auto shrink-0">
      <div className="px-3 py-2 border-b border-gray-700">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Endpoints</h2>
      </div>
      {GROUPS.map(group => (
        <GroupSection key={group} group={group} />
      ))}
    </aside>
  )
}
