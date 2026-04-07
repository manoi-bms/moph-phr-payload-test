const METHOD_STYLES = {
  GET: 'bg-blue-600 text-blue-100',
  POST: 'bg-green-600 text-green-100',
  PUT: 'bg-yellow-600 text-yellow-100',
  DELETE: 'bg-red-600 text-red-100',
}

const STATUS_STYLES = {
  success: 'bg-green-600 text-green-100',
  warning: 'bg-yellow-600 text-yellow-100',
  error: 'bg-red-600 text-red-100',
  info: 'bg-blue-600 text-blue-100',
}

export function MethodBadge({ method }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${METHOD_STYLES[method] || 'bg-gray-600 text-gray-100'}`}>
      {method}
    </span>
  )
}

export function StatusBadge({ status, children }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[status] || 'bg-gray-600 text-gray-100'}`}>
      {children}
    </span>
  )
}

export function StatusCodeBadge({ code }) {
  let style = 'bg-gray-600 text-gray-100'
  if (code >= 200 && code < 300) style = 'bg-green-600 text-green-100'
  else if (code >= 400 && code < 500) style = 'bg-yellow-600 text-yellow-100'
  else if (code >= 500) style = 'bg-red-600 text-red-100'

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${style}`}>
      {code}
    </span>
  )
}
