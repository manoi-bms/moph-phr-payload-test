import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import AuthBar from './components/AuthBar'
import AuthModal from './components/AuthModal'

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <AuthProvider>
      <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
        <AuthBar onLoginClick={() => setShowAuthModal(true)} />
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar will go here (Task 5) */}
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select an endpoint from the sidebar
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        {/* HistoryBar will go here (Task 8) */}
      </div>
    </AuthProvider>
  )
}
