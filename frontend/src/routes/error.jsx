import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/error')({
  validateSearch: (search) => ({
    message: search.message ?? 'Something went wrong.',
    code: search.code ?? '',
    hint: search.hint ?? '',
    returnTo: search.returnTo ?? '',
  }),
  component: ErrorPage,
})

const ERROR_META = {
  401: {
    title: 'Unauthorized',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    accent: '#d97706',
  },
  403: {
    title: 'Forbidden',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    accent: '#dc2626',
  },
  404: {
    title: 'Not Found',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    accent: '#4f46e5',
  },
  410: {
    title: 'Poll Expired',
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    accent: '#475569',
  },
  500: {
    title: 'Server Error',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    accent: '#dc2626',
  },
  default: {
    title: 'Error',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    accent: '#4f46e5',
  },
}

function ErrorPage() {
  const navigate = useNavigate()
  const { message, code, hint, returnTo } = useSearch({ from: '/error' })

  const meta = ERROR_META[code] ?? ERROR_META.default

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        animation: 'fadeUp 0.4s ease',
      }}>



        {/* Code badge */}
        {code && (
          <div style={{
            display: 'inline-block',
            background: meta.gradient,
            color: meta.accent,
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: '20px',
            marginBottom: '0.75rem',
          }}>
            Error {code} · {meta.title}
          </div>
        )}

        {/* Title */}
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#111827',
          margin: '0 0 0.75rem',
          lineHeight: 1.2,
        }}>
          {meta.title}
        </h1>

        {/* Message */}
        <p style={{
          fontSize: '1rem',
          color: '#4b5563',
          lineHeight: 1.6,
          margin: '0 0 0.5rem',
        }}>
          {message}
        </p>

        {/* Hint */}
        {hint && (
          <p style={{
            fontSize: '0.85rem',
            color: '#9ca3af',
            margin: '0 0 2rem',
          }}>
            {hint}
          </p>
        )}

        {/* Divider */}
        <div style={{
          width: '48px',
          height: '3px',
          background: meta.gradient,
          borderRadius: '4px',
          margin: '1.5rem auto',
        }} />

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              background: meta.accent,
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              background: 'transparent',
              color: meta.accent,
              border: `1.5px solid ${meta.accent}44`,
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.target.style.background = `${meta.accent}11`}
            onMouseLeave={e => e.target.style.background = 'transparent'}
          >
            ← Go Back
          </button>
        </div>

        {/* Login prompt for 401 */}
        {code === '401' && (
          <p style={{ marginTop: '1.5rem', fontSize: '13px', color: '#9ca3af' }}>
            <button
              onClick={() => navigate({ to: '/login', search: { returnTo } })}
              style={{
                background: 'none',
                border: 'none',
                color: meta.accent,
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '13px',
                textDecoration: 'underline',
              }}
            >
              Login
            </button>
            {' '}to access this resource.
          </p>
        )}

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
