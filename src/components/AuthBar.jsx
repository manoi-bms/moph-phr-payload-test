import { useAuth } from '../context/AuthContext'
import StatusDot from './shared/StatusDot'

export default function AuthBar({ onLoginClick }) {
  const { isAuthenticated, authMethod, token, env, setEnv, envLabel, logout } = useAuth()

  const toggleEnv = () => setEnv(env === 'uat' ? 'prod' : 'uat')

  const methodLabels = {
    login: 'Login',
    jwt: 'JWT',
    fixed: 'Fixed Token',
    none: '',
  }

  const truncatedToken = token.length > 20 ? token.slice(0, 20) + '...' : token

  return (
    <header className="flex items-center justify-between px-4 h-12 bg-gray-800 border-b border-gray-700 shrink-0">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-bold text-gray-100 tracking-wide">MOPH PHR API Tester</h1>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <StatusDot active={isAuthenticated} />
        {isAuthenticated ? (
          <span className="text-gray-300">
            <span className="text-gray-400">{methodLabels[authMethod]}:</span>{' '}
            <span className="font-mono text-xs">{truncatedToken}</span>
          </span>
        ) : (
          <span className="text-gray-500">Not authenticated</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleEnv}
          className={`px-3 py-1 rounded text-xs font-bold ${
            env === 'uat'
              ? 'bg-orange-600/20 text-orange-400 border border-orange-600/40'
              : 'bg-blue-600/20 text-blue-400 border border-blue-600/40'
          }`}
        >
          {envLabel}
        </button>

        {isAuthenticated ? (
          <button
            onClick={logout}
            className="px-3 py-1 rounded text-xs font-medium bg-gray-700 hover:bg-gray-600 text-gray-300"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="px-3 py-1 rounded text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Login
          </button>
        )}
      </div>
    </header>
  )
}
