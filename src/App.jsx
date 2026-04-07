import { useState, useCallback } from 'react'
import { AuthProvider } from './context/AuthContext'
import { EndpointProvider, useEndpoint } from './context/EndpointContext'
import { useAuth } from './context/AuthContext'
import AuthBar from './components/AuthBar'
import AuthModal from './components/AuthModal'
import EndpointSidebar from './components/EndpointSidebar'
import RequestPanel from './components/RequestPanel'
import ResponsePanel from './components/ResponsePanel'
import { sendRequest } from './utils/apiClient'

function MainContent() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [sending, setSending] = useState(false)
  const [response, setResponse] = useState(null)
  const { selectedEndpoint } = useEndpoint()
  const { token, proxyBase } = useAuth()

  const handleSend = useCallback(async (data) => {
    if (!selectedEndpoint) return

    // Check for JSON parse error from RequestPanel
    if (data.jsonError) {
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
  }, [selectedEndpoint, token, proxyBase])

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
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <EndpointProvider>
        <MainContent />
      </EndpointProvider>
    </AuthProvider>
  )
}
