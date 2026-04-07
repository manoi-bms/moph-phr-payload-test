import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { EndpointProvider } from './context/EndpointContext'
import AuthBar from './components/AuthBar'
import AuthModal from './components/AuthModal'
import EndpointSidebar from './components/EndpointSidebar'
import RequestPanel from './components/RequestPanel'

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSend = (data) => {
    // Temporary: just log to console. Will be connected to apiClient in Task 7.
    console.log('Send request:', data)
  }

  return (
    <AuthProvider>
      <EndpointProvider>
        <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
          <AuthBar onLoginClick={() => setShowAuthModal(true)} />
          <div className="flex-1 flex overflow-hidden">
            <EndpointSidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
              <RequestPanel onSend={handleSend} sending={sending} />
              {/* ResponsePanel will go here (Task 7) */}
            </main>
          </div>
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
          {/* HistoryBar will go here (Task 8) */}
        </div>
      </EndpointProvider>
    </AuthProvider>
  )
}
