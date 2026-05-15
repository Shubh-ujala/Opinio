import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import useAuthStore from '../store/authStore.js'
import api from '../api/axios.js'

export const Route = createFileRoute('/register')({
  validateSearch: (search) => ({
    returnTo: search.returnTo ?? '/dashboard',
  }),
  component: Register
})

function Register() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const { returnTo } = Route.useSearch()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      const token = res.data.token
      localStorage.setItem('token', token)
      const meRes = await api.get('/auth/me')
      login(token, meRes.data.user)
      navigate({ to: returnTo })
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh',
      padding: '2rem 0'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--social-bg)',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Sign up to start creating polls
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: 'var(--text-h)' }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
              style={{ display: 'block', width: '100%', padding: '10px 12px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: 'var(--text-h)' }}>
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              style={{ display: 'block', width: '100%', padding: '10px 12px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: 'var(--text-h)' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              required
              style={{ display: 'block', width: '100%', padding: '10px 12px', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '10px', borderRadius: '6px', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ padding: '12px', marginTop: '0.5rem', fontSize: '15px' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', margin: '1rem 0 0', fontSize: '14px', color: 'var(--text)' }}>
            Already have an account?{' '}
            <Link to="/login" search={{ returnTo }} style={{ fontWeight: 600 }}>
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}