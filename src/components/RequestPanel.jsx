import { useState, useCallback, lazy, Suspense } from 'react'
import { useEndpoint } from '../context/EndpointContext'
import { useAuth } from '../context/AuthContext'
import { MethodBadge } from './shared/Badge'
import Spinner from './shared/Spinner'

// Lazy load Monaco editor for performance
const Editor = lazy(() => import('@monaco-editor/react'))

function MonacoFallback() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-900">
      <Spinner size="lg" className="text-gray-500" />
    </div>
  )
}

export default function RequestPanel({ onSend, sending }) {
  const { selectedEndpoint, requestBody, setRequestBody, resetTemplate } = useEndpoint()
  const { isAuthenticated } = useAuth()

  // For GET endpoints with queryParams
  const [queryParams, setQueryParams] = useState({})

  const handleEditorChange = useCallback((value) => {
    setRequestBody(value || '')
  }, [setRequestBody])

  const handleParamChange = useCallback((key, value) => {
    setQueryParams(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleSend = () => {
    if (!selectedEndpoint) return
    if (selectedEndpoint.method === 'GET' && selectedEndpoint.queryParams) {
      onSend({ queryParams })
    } else {
      // Validate JSON before sending
      try {
        if (requestBody.trim()) {
          JSON.parse(requestBody)
        }
        onSend({ body: requestBody })
      } catch (e) {
        onSend({ body: requestBody, jsonError: e.message })
      }
    }
  }

  if (!selectedEndpoint) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-900/50">
        <div className="text-center">
          <div className="text-4xl mb-2 opacity-30">&#x2190;</div>
          <p>Select an endpoint from the sidebar</p>
        </div>
      </div>
    )
  }

  const isGetWithParams = selectedEndpoint.method === 'GET' && selectedEndpoint.queryParams

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* URL bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700 bg-gray-800 shrink-0">
        <MethodBadge method={selectedEndpoint.method} />
        <span className="font-mono text-sm text-gray-300 flex-1 truncate">{selectedEndpoint.path}</span>
        <span className="text-xs text-gray-500 hidden sm:inline">{selectedEndpoint.description}</span>
        <button
          onClick={resetTemplate}
          className="px-2 py-1 rounded text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
          title="Reset to default template"
        >
          Reset
        </button>
        <button
          onClick={handleSend}
          disabled={sending || (selectedEndpoint.authRequired && !isAuthenticated)}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-medium text-white flex items-center gap-2 transition-colors"
          title={selectedEndpoint.authRequired && !isAuthenticated ? 'Authentication required' : 'Send request'}
        >
          {sending && <Spinner size="sm" />}
          Send
        </button>
      </div>

      {/* Auth warning */}
      {selectedEndpoint.authRequired && !isAuthenticated && (
        <div className="px-3 py-1.5 bg-yellow-900/30 border-b border-yellow-700/50 text-xs text-yellow-400 shrink-0">
          This endpoint requires authentication. Please login first.
        </div>
      )}

      {/* Editor or Query Params */}
      {isGetWithParams ? (
        <div className="flex-1 overflow-y-auto p-4 bg-gray-900/50">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Query Parameters</h3>
          <div className="space-y-3">
            {selectedEndpoint.queryParams.map(param => (
              <div key={param}>
                <label className="block text-xs font-medium text-gray-400 mb-1">{param}</label>
                <input
                  type="text"
                  value={queryParams[param] || ''}
                  onChange={(e) => handleParamChange(param, e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
                  placeholder={param === 'hospital_code' ? '00000' : param === 'date' ? 'yyyy-mm-dd' : param === 'month' ? 'yyyy-mm' : ''}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <Suspense fallback={<MonacoFallback />}>
            <Editor
              height="100%"
              language="json"
              theme="vs-dark"
              value={requestBody}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                renderWhitespace: 'selection',
                bracketPairColorization: { enabled: true },
              }}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
}
