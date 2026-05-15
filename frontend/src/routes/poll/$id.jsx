import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import api from '../../api/axios'

export const Route = createFileRoute('/poll/$id')({
  component: PollPage
})

function PollPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()

  const [poll, setPoll]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    fetchPoll()
  }, [id])

  const fetchPoll = async () => {
    try {
      const res = await api.get(`/polls/${id}`)
      setPoll(res.data)
    } catch (err) {
      const status = err.response?.status
      const msg    = err.response?.data?.error?.message || err.response?.data?.error || 'This poll could not be found.'
      navigate({ to: '/error', search: { code: String(status ?? 404), message: msg } })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading poll...</div>
  if (!poll)   return null

  // ── Three states ──
  if (poll.isPublished)         return <ResultsView id={id} poll={poll} />
  if (poll.status === 'closed') return <ClosedMessage poll={poll} />
  return <PollForm poll={poll} id={id} />
}

// ─────────────────────────────────────────
// Poll Form — shown when poll is active
// ─────────────────────────────────────────
function PollForm({ poll, id }) {
  const navigate = useNavigate()
  const [answers, setAnswers]   = useState({})  // { questionId: optionId }
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Check required questions
    const unanswered = poll.questions.filter(
      q => q.isRequired && !answers[q._id]
    )
    if (unanswered.length > 0) {
      setError(`Please answer all required questions`)
      return
    }

    // Convert object → array for API
    const payload = Object.entries(answers).map(([questionId, optionId]) => ({
      questionId,
      optionId
    }))

    setLoading(true)
    try {
      await api.post(`/responses/${id}`, { answers: payload })
      setSubmitted(true)
    } catch (err) {
      const status  = err.response?.status
      const raw     = err.response?.data?.error
      const message = (typeof raw === 'object' ? raw?.message : raw) || 'Failed to submit your response.'
      const hint    = status === 401 ? 'This poll requires you to be logged in to vote.' : ''
      navigate({ to: '/error', search: { code: String(status ?? 500), message, hint, returnTo: `/poll/${id}` } })
    } finally {
      setLoading(false)
    }
  }

  // Thank you screen after submit
  if (submitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <h2>✓ Response submitted!</h2>
        <p style={{ color: '#555', marginTop: '0.5rem' }}>
          Thank you for taking the time to respond to <strong>{poll.title}</strong>.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>

      {/* Poll header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>{poll.title}</h2>
        {poll.description && (
          <p style={{ color: 'var(--text)', marginTop: '0.5rem' }}>{poll.description}</p>
        )}
        <p style={{ fontSize: '13px', color: 'var(--text)', opacity: 0.8, marginTop: '0.5rem' }}>
          Closes: {new Date(poll.expiresAt).toLocaleString()}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {poll.questions.map((question, qIndex) => (
          <div
            key={question._id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '1rem',
              background: 'var(--bg)'
            }}
          >
            {/* Question text */}
            <p style={{ fontWeight: 500, marginBottom: '1rem', margin: '0 0 1rem 0' }}>
              {qIndex + 1}. {question.text}
              {question.isRequired && (
                <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
              )}
            </p>

            {/* Options — radio buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {question.options.map(option => (
                <label
                  key={option._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    border: `1px solid ${answers[question._id] === option._id ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: answers[question._id] === option._id ? 'var(--accent-bg)' : 'var(--bg)',
                    transition: 'all 0.15s'
                  }}
                >
                  <input
                    type="radio"
                    name={question._id}
                    value={option._id}
                    checked={answers[question._id] === option._id}
                    onChange={() => handleSelect(question._id, option._id)}
                  />
                  {option.text}
                </label>
              ))}
            </div>
          </div>
        ))}

        {error && (
          <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 24px', fontSize: '15px' }}
        >
          {loading ? 'Submitting...' : 'Submit Response'}
        </button>
      </form>
    </div>
  )
}

// ─────────────────────────────────────────
// Closed Message — poll expired or closed
// ─────────────────────────────────────────
function ClosedMessage({ poll }) {
  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
      <h2>This poll is closed</h2>
      <p style={{ color: 'var(--text)', marginTop: '0.5rem' }}>
        <strong>{poll.title}</strong> is no longer accepting responses.
      </p>
      <p style={{ fontSize: '13px', color: 'var(--text)', opacity: 0.8, marginTop: '0.5rem' }}>
        Expired: {new Date(poll.expiresAt).toLocaleString()}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────
// Results View — shown after poll is published
// ─────────────────────────────────────────
function ResultsView({ id, poll }) {
  const [results, setResults]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    api.get(`/polls/${id}/results`)
      .then(res => setResults(res.data))
      .catch(() => setError('Could not load results'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Loading results...</div>
  if (error)   return <div>{error}</div>

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>{results.title}</h2>
        {results.description && (
          <p style={{ color: 'var(--text)', marginTop: '0.5rem' }}>{results.description}</p>
        )}
        <p style={{ fontSize: '13px', color: 'var(--text)', opacity: 0.8, marginTop: '0.5rem' }}>
          Total responses: <strong>{results.totalResponses}</strong>
        </p>
      </div>

      {/* Per question results */}
      {results.questions.map((question, qIndex) => {
        const totalVotes = question.options.reduce((sum, o) => sum + o.count, 0)

        return (
          <div
            key={question._id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '1rem',
              background: 'var(--bg)'
            }}
          >
            <p style={{ fontWeight: 500, marginBottom: '1rem' }}>
              {qIndex + 1}. {question.text}
            </p>

            {question.options.map(option => {
              const pct = totalVotes > 0
                ? Math.round((option.count / totalVotes) * 100)
                : 0

              return (
                <div key={option._id} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span>{option.text}</span>
                    <span style={{ color: 'var(--text)' }}>{option.count} votes ({pct}%)</span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ background: 'var(--code-bg)', borderRadius: '4px', height: '8px' }}>
                    <div style={{
                      background: 'var(--accent)',
                      borderRadius: '4px',
                      height: '8px',
                      width: `${pct}%`,
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}