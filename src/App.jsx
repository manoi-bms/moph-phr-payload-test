import { useState, useCallback, useEffect, useRef } from 'react'
import { AuthProvider } from './context/AuthContext'
import { EndpointProvider, useEndpoint } from './context/EndpointContext'
import { HistoryProvider } from './context/HistoryContext'
import { useHistory } from './context/HistoryContext'
import { useAuth } from './context/AuthContext'
import AuthBar from './components/AuthBar'
import AuthModal from './components/AuthModal'
import EndpointSidebar from './components/EndpointSidebar'
import RequestPanel from './components/RequestPanel'
import ResponsePanel from './components/ResponsePanel'
import HistoryBar from './components/HistoryBar'
import { sendRequest } from './utils/apiClient'
import { useToast } from './components/shared/Toast'

function MainContent() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [sending, setSending] = useState(false)
  const [response, setResponse] = useState(null)
  const { selectedEndpoint, selectEndpoint, setRequestBody } = useEndpoint()
  const { token, proxyBase, isAuthenticated } = useAuth()
  const { addEntry } = useHistory()
  const { showToast, ToastContainer } = useToast()
  const prevAuth = useRef(isAuthenticated)

  // Show toast on successful auth
  useEffect(() => {
    if (isAuthenticated && !prevAuth.current) {
      showToast('Authenticated successfully', 'success')
    }
    prevAuth.current = isAuthenticated
  }, [isAuthenticated, showToast])

  const handleSend = useCallback(async (data) => {
    if (!selectedEndpoint) return

    // Check for JSON parse error from RequestPanel
    if (data.jsonError) {
      showToast(`JSON Parse Error: ${data.jsonError}`, 'error', 5000)
      setResponse({
        status: 0,
        statusText: 'JSON Parse Error',
        data: { error: `Invalid JSON: ${data.jsonError}` },
        elapsed: 0,
        url: null,
        error: data.jsonError,
      })
      return
    }

    setSending(true)
    setResponse(null)

    try {
      const result = await sendRequest({
        method: selectedEndpoint.method,
        path: selectedEndpoint.path,
        body: data.body,
        queryParams: data.queryParams,
        token,
        proxyBase,
      })
      setResponse(result)

      // Alert user about processing warnings (server returns 200 but data has issues)
      if (result.data?.processing_warning?.length > 0) {
        const count = result.data.processing_warning.length
        showToast(
          `${count} processing warning${count > 1 ? 's' : ''} — payload accepted but has validation issues that need fixing`,
          'warning',
          8000
        )
      }

      addEntry({
        endpointId: selectedEndpoint.id,
        endpointName: selectedEndpoint.name,
        method: selectedEndpoint.method,
        path: selectedEndpoint.path,
        status: result.status,
        elapsed: result.elapsed,
        requestBody: data.body || JSON.stringify(data.queryParams || {}),
        responseData: result.data,
      })
    } catch (err) {
      setResponse({
        status: 0,
        statusText: 'Error',
        data: null,
        elapsed: 0,
        url: null,
        error: err.message,
      })
    } finally {
      setSending(false)
    }
  }, [selectedEndpoint, token, proxyBase, addEntry, showToast])

  const handleReplay = useCallback((entry) => {
    selectEndpoint(entry.endpointId)
    // Need to set requestBody after a tick since selectEndpoint also sets it
    setTimeout(() => {
      setRequestBody(entry.requestBody)
      setResponse({
        status: entry.status,
        statusText: entry.status > 0 ? 'OK' : 'Error',
        data: entry.responseData,
        elapsed: entry.elapsed,
        url: null,
        error: entry.status === 0 ? 'Replayed from history' : null,
      })
    }, 0)
  }, [selectEndpoint, setRequestBody])

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      <AuthBar onLoginClick={() => setShowAuthModal(true)} />
      <div className="flex-1 flex overflow-hidden">
        <EndpointSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden" style={{ minHeight: 0 }}>
            <div className="h-1/2 flex flex-col overflow-hidden">
              <RequestPanel onSend={handleSend} sending={sending} />
            </div>
            <div className="h-1/2 flex flex-col overflow-hidden">
              <ResponsePanel response={response} loading={sending} />
            </div>
          </div>
        </main>
      </div>
      <HistoryBar onReplay={handleReplay} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      {ToastContainer}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <EndpointProvider>
        <HistoryProvider>
          <MainContent />
        </HistoryProvider>
      </EndpointProvider>
    </AuthProvider>
  )
}
