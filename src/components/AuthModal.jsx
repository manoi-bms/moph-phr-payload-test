import { useState } from 'react'
import Modal from './shared/Modal'
import Spinner from './shared/Spinner'
import { useAuth } from '../context/AuthContext'
import { formatFixedToken, loginMophAccount } from '../utils/auth'

const TABS = [
  { id: 'login', label: 'Login' },
  { id: 'jwt', label: 'Paste JWT' },
  { id: 'fixed', label: 'Fixed Token' },
]

export default function AuthModal({ isOpen, onClose }) {
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login form state
  const [user, setUser] = useState('')
  const [passwordHash, setPasswordHash] = useState('')
  const [hospitalCode, setHospitalCode] = useState('00000')

  // JWT paste state
  const [jwtText, setJwtText] = useState('')

  // Fixed token state
  const [fixedHcode, setFixedHcode] = useState('00000')
  const [fixedToken, setFixedToken] = useState('{F5168AEE-5F6E-4479-8514-988FBB167155}')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await loginMophAccount({ user, passwordHash, hospitalCode })
      login(token, 'login')
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasteJwt = (e) => {
    e.preventDefault()
    const trimmed = jwtText.trim()
    if (!trimmed) return
    login(trimmed, 'jwt')
    onClose()
  }

  const handleFixedToken = (e) => {
    e.preventDefault()
    if (!fixedHcode || !fixedToken) return
    login(formatFixedToken(fixedHcode, fixedToken), 'fixed')
    onClose()
  }

  const inputClass = 'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400'
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1'
  const btnPrimaryClass = 'w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-medium text-white flex items-center justify-center gap-2'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Authentication">
      {/* Tab buttons */}
      <div className="flex gap-1 mb-4 bg-gray-700/50 rounded-lg p-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setError('') }}
            className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Login tab */}
      {activeTab === 'login' && (
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className={labelClass}>Username</label>
            <input type="text" className={inputClass} value={user} onChange={e => setUser(e.target.value)} placeholder="cvp_user" />
          </div>
          <div>
            <label className={labelClass}>Password Hash</label>
            <input type="text" className={inputClass} value={passwordHash} onChange={e => setPasswordHash(e.target.value)} placeholder="FFFFFFFFFFFFFFFF" />
          </div>
          <div>
            <label className={labelClass}>Hospital Code</label>
            <input type="text" className={inputClass} value={hospitalCode} onChange={e => setHospitalCode(e.target.value)} placeholder="00000" />
          </div>
          <button type="submit" className={btnPrimaryClass} disabled={loading || !user || !passwordHash}>
            {loading && <Spinner size="sm" />}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}

      {/* Paste JWT tab */}
      {activeTab === 'jwt' && (
        <form onSubmit={handlePasteJwt} className="space-y-3">
          <div>
            <label className={labelClass}>JWT Token</label>
            <textarea
              className={`${inputClass} h-32 resize-none font-mono text-xs`}
              value={jwtText}
              onChange={e => setJwtText(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
          </div>
          <button type="submit" className={btnPrimaryClass} disabled={!jwtText.trim()}>
            Set Token
          </button>
        </form>
      )}

      {/* Fixed Token tab */}
      {activeTab === 'fixed' && (
        <form onSubmit={handleFixedToken} className="space-y-3">
          <div>
            <label className={labelClass}>Hospital Code (5 digits)</label>
            <input type="text" className={inputClass} value={fixedHcode} onChange={e => setFixedHcode(e.target.value)} placeholder="00000" />
          </div>
          <div>
            <label className={labelClass}>Token</label>
            <input type="text" className={inputClass} value={fixedToken} onChange={e => setFixedToken(e.target.value)} placeholder="{AAAA-BBBB-CCCC-DDDD}" />
          </div>
          <div className="p-2 bg-gray-700/50 rounded text-xs font-mono text-gray-400 break-all">
            Bearer {formatFixedToken(fixedHcode, fixedToken)}
          </div>
          <button type="submit" className={btnPrimaryClass} disabled={!fixedHcode || !fixedToken}>
            Set Fixed Token
          </button>
        </form>
      )}
    </Modal>
  )
}
