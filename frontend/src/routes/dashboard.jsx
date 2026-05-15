import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import useAuthStore from '../store/authStore.js'
import api from '../api/axios.js'
import { authGuard } from '../utils/authGuard.js'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: authGuard,
  component: Dashboard
})

function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [polls, setPolls]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [copied, setCopied]     = useState(null) // stores poll id of copied link

  useEffect(() => {
    fetchPolls()
  }, [])

  const fetchPolls = async () => {
    try {
      const res = await api.get('/polls/mine')
      setPolls(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getPollStatus = (poll) => {
    if (poll.isPublished)                          return { label: 'Published', color: '#16a34a' }
    if (new Date(poll.expiresAt) < new Date())     return { label: 'Expired',   color: '#dc2626' }
    return                                                { label: 'Active',    color: '#2563eb' }
  }

  const handleCopyLink = (pollId) => {
    navigator.clipboard.writeText(`${window.location.origin}/poll/${pollId}`)
    setCopied(pollId)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) return <div>Loading your polls...</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Polls</h2>
        <button onClick={() => navigate({ to: '/create' })}>
          + Create Poll
        </button>
      </div>

      {/* Empty state */}
      {polls.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text)' }}>
          <p>You haven't created any polls yet.</p>
          <button
            onClick={() => navigate({ to: '/create' })}
            style={{ marginTop: '1rem' }}
          >
            Create your first poll
          </button>
        </div>
      )}

      {/* Poll list */}
      {polls.map(poll => {
        const status = getPollStatus(poll)
        return (
          <div
            key={poll._id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '1rem',
              background: 'var(--bg)'
            }}
          >
            {/* Poll title + status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>{poll.title}</h3>
              <span style={{
                background: status.color,
                color: '#fff',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 500
              }}>
                {status.label}
              </span>
            </div>

            {/* Poll meta info */}
            <div style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '1rem', display: 'flex', gap: '1.5rem' }}>
              <span>Responses: <strong>{poll.responseCount}</strong></span>
              <span>Questions: <strong>{poll.questions.length}</strong></span>
              <span>Expires: <strong>{new Date(poll.expiresAt).toLocaleDateString()}</strong></span>
              <span>Mode: <strong>{poll.isAnonymous ? 'Anonymous' : 'Authenticated'}</strong></span>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => handleCopyLink(poll._id)}>
                {copied === poll._id ? '✓ Copied!' : 'Copy Link'}
              </button>
              <button onClick={() => navigate({ to: '/analytics/$id', params: { id: poll._id } })}>
                View Analytics
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}