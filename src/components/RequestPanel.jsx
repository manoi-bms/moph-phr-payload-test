import { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react'
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
  const { isAuthenticated, envHost } = useAuth()

  // For GET endpoints with queryParams
  const [queryParams, setQueryParams] = useState({})

  // Debounced JSON validation
  const [jsonValid, setJsonValid] = useState(null) // null = no check, true = valid, false = invalid
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!selectedEndpoint || selectedEndpoint.method === 'GET') {
      setJsonValid(null)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (!requestBody.trim()) {
        setJsonValid(null)
        return
      }
      try {
        JSON.parse(requestBody)
        setJsonValid(true)
      } catch {
        setJsonValid(false)
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [requestBody, selectedEndpoint])

  const handleEditorChange = useCallback((value) => {
    setRequestBody(value || '')
  }, [setRequestBody])

  const handleParamChange = useCallback((key, value) => {
    setQueryParams(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleSend = useCallback(() => {
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
  }, [selectedEndpoint, onSend, queryParams, requestBody])

  // Ctrl+Enter / Cmd+Enter keyboard shortcut to send
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (!sending) handleSend()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSend, sending])

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
        <span className="font-mono text-sm flex-1 truncate">
          <span className="text-gray-500">{envHost}</span>
          <span className="text-gray-200">{selectedEndpoint.path}</span>
        </span>
        {jsonValid !== null && selectedEndpoint.method !== 'GET' && (
          <span
            data-testid="json-validity"
            className={`text-sm font-bold ${jsonValid ? 'text-green-400' : 'text-red-400'}`}
            title={jsonValid ? 'Valid JSON' : 'Invalid JSON'}
          >
            {jsonValid ? '\u2713' : '\u2717'}
          </span>
        )}
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
          title={selectedEndpoint.authRequired && !isAuthenticated ? 'Authentication required' : 'Send request (Ctrl+Enter)'}
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
