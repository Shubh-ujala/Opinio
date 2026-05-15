import { createRootRoute, Outlet, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'

function RootLayout() {
  const { user, loading, logout, initAuth } = useAuthStore()
  const navigate = useNavigate()

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Run once when app loads — checks token
  useEffect(() => {
    initAuth()
  }, [])

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  if (loading) return <div>Loading...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <nav style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--nav-bg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <Link to="/" style={{
          fontWeight: '700',
          fontSize: '1.5rem',
          color: 'var(--accent)',
          letterSpacing: '-0.5px'
        }}>
          Opinio
        </Link>
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--code-bg)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              width: '50px',
              height: '26px',
              padding: '2px',
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
            }}
            title="Toggle Theme"
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'var(--accent)',
              transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(0)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </button>

          {user ? (
            <>
              <span style={{ color: 'var(--text)', fontWeight: 500 }}>Hi, {user.name}</span>
              <Link to="/create" style={{ fontWeight: 600 }}>Create Poll</Link>
              <button onClick={handleLogout} style={{ padding: '6px 12px' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontWeight: 600 }}>Login</Link>
              <Link to="/register" style={{ fontWeight: 600 }}>Register</Link>
            </>
          )}
        </div>
      </nav>
      <main style={{ padding: '2rem', flex: 1, maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
    </div>
  )
}

export const Route = createRootRoute({ component: RootLayout })