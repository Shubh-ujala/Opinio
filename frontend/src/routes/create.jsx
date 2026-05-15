import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import api from '../api/axios.js'
import { authGuard } from '../utils/authGuard.js'

export const Route = createFileRoute('/create')({
  beforeLoad: authGuard,
  component: CreatePoll
})

function CreatePoll() {
  const navigate = useNavigate()

  // Poll metadata
  const [title, setTitle]             = useState('')
  const [description, setDescription] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [expiresAt, setExpiresAt]     = useState('')

  // Questions array — core of this form
  const [questions, setQuestions] = useState([
    {
      text: '',
      isRequired: false,
      options: [{ text: '' }, { text: '' }]  // start with 2 empty options
    }
  ])

  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  // ─── Question helpers ──────────────────────────
  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { text: '', isRequired: false, options: [{ text: '' }, { text: '' }] }
    ])
  }

  const removeQuestion = (qIndex) => {
    setQuestions(prev => prev.filter((_, i) => i !== qIndex))
  }

  const updateQuestion = (qIndex, field, value) => {
    setQuestions(prev => {
      const updated = [...prev]
      updated[qIndex] = { ...updated[qIndex], [field]: value }
      return updated
    })
  }

  // ─── Option helpers ────────────────────────────
  const addOption = (qIndex) => {
    setQuestions(prev => {
      const updated = [...prev]
      updated[qIndex].options = [...updated[qIndex].options, { text: '' }]
      return updated
    })
  }

  const removeOption = (qIndex, oIndex) => {
    setQuestions(prev => {
      const updated = [...prev]
      updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex)
      return updated
    })
  }

  const updateOption = (qIndex, oIndex, value) => {
    setQuestions(prev => {
      const updated = [...prev]
      updated[qIndex].options[oIndex] = { text: value }
      return updated
    })
  }

  // ─── Validation ────────────────────────────────
  const validate = () => {
    if (!title.trim())     return 'Poll title is required'
    if (!expiresAt)        return 'Expiry date is required'
    if (new Date(expiresAt) <= new Date()) return 'Expiry must be a future date'
    if (questions.length === 0) return 'Add at least one question'

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.text.trim()) return `Question ${i + 1} text is required`
      if (q.options.length < 2) return `Question ${i + 1} needs at least 2 options`
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim())
          return `Question ${i + 1}, option ${j + 1} cannot be empty`
      }
    }
    return null
  }

  // ─── Submit ────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      await api.post('/polls', {
        title,
        description,
        isAnonymous,
        expiresAt,
        questions
      })
      navigate({ to: '/dashboard' })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create poll')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Create a Poll</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>

        {/* ── Poll metadata ── */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem', background: 'var(--bg)' }}>
          <h3 style={{ marginTop: 0 }}>Poll Details</h3>

          <div style={{ marginBottom: '1rem' }}>
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Team feedback Q3"
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Description (optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What is this poll about?"
              rows={3}
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Expires at *</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={e => setExpiresAt(e.target.value)}
              style={{ display: 'block', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="anon"
              checked={isAnonymous}
              onChange={e => setIsAnonymous(e.target.checked)}
            />
            <label htmlFor="anon">Allow anonymous responses</label>
          </div>
        </div>

        {/* ── Questions ── */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Questions</h3>
            <button type="button" onClick={addQuestion}>
              + Add Question
            </button>
          </div>

          {questions.map((question, qIndex) => (
            <div
              key={qIndex}
              style={{
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '1.25rem',
                marginBottom: '1rem',
                background: 'var(--social-bg)'
              }}
            >
              {/* Question header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <strong>Question {qIndex + 1}</strong>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Question text */}
              <div style={{ marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  value={question.text}
                  onChange={e => updateQuestion(qIndex, 'text', e.target.value)}
                  placeholder={`Question ${qIndex + 1}`}
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Required toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <input
                  type="checkbox"
                  id={`required-${qIndex}`}
                  checked={question.isRequired}
                  onChange={e => updateQuestion(qIndex, 'isRequired', e.target.checked)}
                />
                <label htmlFor={`required-${qIndex}`}>Mark as required</label>
              </div>

              {/* Options */}
              <div style={{ marginLeft: '1rem' }}>
                <label style={{ fontSize: '13px', color: 'var(--text)' }}>Options</label>
                {question.options.map((option, oIndex) => (
                  <div
                    key={oIndex}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}
                  >
                    <span style={{ color: 'var(--text)', fontSize: '13px', minWidth: '20px' }}>
                      {oIndex + 1}.
                    </span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      style={{ flex: 1, padding: '6px 8px', boxSizing: 'border-box' }}
                    />
                    {question.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  style={{ marginTop: '8px', fontSize: '13px' }}
                >
                  + Add option
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Error + Submit ── */}
        {error && (
          <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Poll'}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: '/dashboard' })}
            style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}