import { lazy, Suspense, useState, useCallback } from 'react'
import { StatusCodeBadge } from './shared/Badge'
import Spinner from './shared/Spinner'

const Editor = lazy(() => import('@monaco-editor/react'))

function MonacoFallback() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-900">
      <Spinner size="md" className="text-gray-500" />
    </div>
  )
}

function formatSize(charCount) {
  if (charCount < 1024) return `${charCount} chars`
  if (charCount < 1024 * 1024) return `${(charCount / 1024).toFixed(1)} KB`
  return `${(charCount / (1024 * 1024)).toFixed(1)} MB`
}

export default function ResponsePanel({ response, loading }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments where clipboard API is unavailable
      setCopied(false)
    }
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900/50 border-t border-gray-700">
        <div className="flex items-center gap-3 text-gray-400">
          <Spinner size="md" />
          <span className="text-sm">Sending request...</span>
        </div>
      </div>
    )
  }

  // Empty state
  if (!response) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900/50 border-t border-gray-700">
        <p className="text-sm text-gray-600">Response will appear here</p>
      </div>
    )
  }

  // Format response data
  let responseText
  if (response.error) {
    responseText = JSON.stringify({ error: response.error }, null, 2)
  } else if (typeof response.data === 'object' && response.data !== null) {
    responseText = JSON.stringify(response.data, null, 2)
  } else {
    responseText = String(response.data || '')
  }

  const statusColor = response.status >= 200 && response.status < 300
    ? 'text-green-400'
    : response.status >= 400 && response.status < 500
      ? 'text-yellow-400'
      : response.status >= 500
        ? 'text-red-400'
        : 'text-gray-400'

  return (
    <div className="flex-1 flex flex-col min-h-0 border-t border-gray-700">
      {/* Status bar */}
      <div className="flex items-center gap-3 px-3 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
        {response.status > 0 ? (
          <StatusCodeBadge code={response.status} />
        ) : (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-red-100">ERR</span>
        )}
        <span className={`text-sm ${statusColor}`}>{response.statusText}</span>
        <span className="text-xs text-gray-500">{response.elapsed}ms</span>
        <span className="text-xs text-gray-500">{formatSize(responseText.length)}</span>
        <button
          onClick={() => handleCopy(responseText)}
          className="px-2 py-0.5 rounded text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
          title="Copy response to clipboard"
          data-testid="copy-response"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        {response.url && (
          <span className="text-xs text-gray-600 font-mono truncate flex-1 text-right">{response.url}</span>
        )}
      </div>

      {/* Response body */}
      <div className="flex-1 min-h-0">
        <Suspense fallback={<MonacoFallback />}>
          <Editor
            height="100%"
            language="json"
            theme="vs-dark"
            value={responseText}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              wordWrap: 'on',
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              domReadOnly: true,
            }}
          />
        </Suspense>
      </div>
    </div>
  )
}
