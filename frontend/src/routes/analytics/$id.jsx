import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import api from '../../api/axios'
import { authGuard } from '../../utils/authGuard'
import useSocket from '../../hooks/useSocket'

export const Route = createFileRoute('/analytics/$id')({
  beforeLoad: authGuard,
  component: Analytics
})

function Analytics() {
  const { id }   = Route.useParams()
  const navigate = useNavigate()

  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [total, setTotal]       = useState(0)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished]   = useState(false)

  // ── Fetch analytics on mount ──
  useEffect(() => {
    fetchAnalytics()
  }, [id])

  const fetchAnalytics = async () => {
    try {
      const res = await api.get(`/polls/${id}/analytics`)
      setData(res.data)
      setTotal(res.data.totalResponses)
      setPublished(res.data.poll.isPublished)
    } catch (err) {
      if (err.response?.status === 403) {
        navigate({ to: '/dashboard' })
      } else {
        const status  = err.response?.status
        const raw     = err.response?.data?.error
        const message = (typeof raw === 'object' ? raw?.message : raw) || 'Failed to load analytics.'
        navigate({ to: '/error', search: { code: String(status ?? 500), message } })
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Socket.io live updates ──
  useSocket(id, {
    onUpdate: ({ totalResponses }) => {
      setTotal(totalResponses)
      fetchAnalytics()
    },
    onPublished: () => {
      setPublished(true)
      fetchAnalytics()
    }
  })

  // ── Publish handler ──
  const handlePublish = async () => {
    const confirm = window.confirm(
      'Once published, results will be visible to everyone and no new responses will be accepted. Continue?'
    )
    if (!confirm) return

    setPublishing(true)
    try {
      await api.post(`/polls/${id}/publish`)
      setPublished(true)
      fetchAnalytics()
    } catch (err) {
      const status  = err.response?.status
      const raw     = err.response?.data?.error
      const message = (typeof raw === 'object' ? raw?.message : raw) || 'Failed to publish results.'
      navigate({ to: '/error', search: { code: String(status ?? 500), message } })
    } finally {
      setPublishing(false)
    }
  }

  const getPollStatus = (poll) => {
    if (poll.isPublished)                      return { label: 'Published', color: '#16a34a' }
    if (new Date(poll.expiresAt) < new Date()) return { label: 'Expired',   color: '#dc2626' }
    return                                            { label: 'Active',    color: '#2563eb' }
  }

  if (loading) return <div>Loading analytics...</div>
  if (!data)   return null

  const status = getPollStatus(data.poll)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h2 style={{ margin: 0 }}>{data.poll.title}</h2>
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
          {data.poll.description && (
            <p style={{ color: 'var(--text)', margin: '4px 0 0' }}>{data.poll.description}</p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={() => navigate({ to: '/dashboard' })}>
            ← Dashboard
          </button>
          {!published && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              style={{
                background: '#16a34a',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              {publishing ? 'Publishing...' : 'Publish Results'}
            </button>
          )}
          {published && (
            <span style={{
              background: '#dcfce7',
              color: '#16a34a',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500
            }}>
              ✓ Results Published
            </span>
          )}
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <SummaryCard
          label="Total Responses"
          value={total}
          color="var(--accent)"
          live={!published}
        />
        <SummaryCard
          label="Total Questions"
          value={data.questions.length}
          color="#7c3aed"
        />
        <SummaryCard
          label="Expires"
          value={new Date(data.poll.expiresAt).toLocaleDateString()}
          color="#d97706"
        />
      </div>

      {/* ── Per question charts ── */}
      {data.questions.map((question, qIndex) => {
        const chartData = question.options.map(o => ({
          name: o.text,
          votes: o.count
        }))

        const totalVotes = question.options.reduce((sum, o) => sum + o.count, 0)

        return (
          <div
            key={question._id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.25rem',
              background: 'var(--bg)'
            }}
          >
            {/* Question header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <p style={{ fontWeight: 500, margin: 0 }}>
                Q{qIndex + 1}. {question.text}
                {question.isRequired && (
                  <span style={{ color: '#ef4444', marginLeft: '4px', fontSize: '12px' }}>required</span>
                )}
              </p>
              <span style={{ fontSize: '13px', color: 'var(--text)', opacity: 0.8 }}>
                {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
              </span>
            </div>

            {/* Bar chart */}
            {totalVotes === 0 ? (
              <p style={{ color: 'var(--text)', opacity: 0.8, fontSize: '13px', textAlign: 'center', padding: '2rem 0' }}>
                No responses yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [value, 'Votes']}
                    contentStyle={{ fontSize: '13px' }}
                  />
                  <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Option breakdown below chart */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              {question.options.map(option => {
                const pct = totalVotes > 0
                  ? Math.round((option.count / totalVotes) * 100)
                  : 0
                return (
                  <div
                    key={option._id}
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '3px 0', color: 'var(--text)' }}
                  >
                    <span>{option.text}</span>
                    <span>{option.count} votes — {pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* ── Share section ── */}
      <div style={{
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '1.25rem',
        background: 'var(--social-bg)',
        marginTop: '1rem'
      }}>
        <p style={{ fontWeight: 500, margin: '0 0 8px' }}>Share poll link</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            readOnly
            value={`${window.location.origin}/poll/${id}`}
            style={{ flex: 1, padding: '7px 10px', fontSize: '13px', color: 'var(--text-h)', background: 'var(--bg)' }}
          />
          <button onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/poll/${id}`)
          }}>
            Copy
          </button>
        </div>
      </div>

    </div>
  )
}

// ─────────────────────────────────────────
// Summary card component
// ─────────────────────────────────────────
function SummaryCard({ label, value, color, live }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '1.25rem',
      background: 'var(--bg)',
      textAlign: 'center'
    }}>
      <p style={{ fontSize: '12px', color: 'var(--text)', opacity: 0.8, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
        {live && (
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#16a34a',
            marginLeft: '6px',
            verticalAlign: 'middle'
          }} />
        )}
      </p>
      <p style={{ fontSize: '28px', fontWeight: 600, color, margin: 0 }}>
        {value}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────
// Chart colors
// ─────────────────────────────────────────
const COLORS = ['#2563eb', '#7c3aed', '#16a34a', '#d97706', '#dc2626', '#0891b2']