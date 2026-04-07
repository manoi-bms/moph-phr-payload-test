import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { EndpointProvider } from './context/EndpointContext'
import AuthBar from './components/AuthBar'
import AuthModal from './components/AuthModal'
import EndpointSidebar from './components/EndpointSidebar'

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <AuthProvider>
      <EndpointProvider>
        <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
          <AuthBar onLoginClick={() => setShowAuthModal(true)} />
          <div className="flex-1 flex overflow-hidden">
            <EndpointSidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
              {/* RequestPanel + ResponsePanel will go here */}
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select an endpoint from the sidebar
              </div>
            </main>
          </div>
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
          {/* HistoryBar will go here (Task 8) */}
        </div>
      </EndpointProvider>
    </AuthProvider>
  )
}
