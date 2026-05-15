import { useState, useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import useAuthStore from '../store/authStore'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        animation: 'fadeUp 0.6s ease-out forwards',
        opacity: 0,
        transform: 'translateY(20px)'
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'var(--social-bg)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--accent)',
          marginBottom: '2rem'
        }}>
          The new standard for gathering opinions
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: 'var(--text-h)',
          marginBottom: '1.5rem',
          fontWeight: 800
        }}>
          Create polls that <br />
          <span style={{
            background: 'linear-gradient(to right, var(--accent), #fcd34d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            people actually answer.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.1rem',
          lineHeight: 1.6,
          color: 'var(--text)',
          maxWidth: '600px',
          margin: '0 auto 2.5rem',
          opacity: 0.9
        }}>
          Opinio makes it incredibly easy to build beautiful, responsive polls in seconds. Share them anywhere, collect responses instantly, and analyze results in real-time.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {user ? (
            <button
              onClick={() => navigate({ to: '/dashboard' })}
              style={{
                padding: '14px 32px',
                fontSize: '1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow)'
              }}
            >
              Go to Dashboard <span>→</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate({ to: '/register' })}
                style={{
                  padding: '14px 32px',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow)'
                }}
              >
                Get Started for Free
              </button>
              <button
                onClick={() => navigate({ to: '/login' })}
                style={{
                  padding: '14px 32px',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: 'var(--text-h)',
                  border: '1px solid var(--border)',
                  boxShadow: 'none'
                }}
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>

      <InteractiveDemo />

      {/* How it Works Section */}
      <div style={{ width: '100%', maxWidth: '900px', marginTop: '8rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-h)', marginBottom: '4rem', fontWeight: 800 }}>
          How it works
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'var(--border)',
            zIndex: 0
          }} className="step-line" />

          <StepCard number="1" title="Create" desc="Build your poll in seconds with our intuitive, beautiful editor." />
          <StepCard number="2" title="Share" desc="Distribute the unique link to your audience, friends, or team." />
          <StepCard number="3" title="Analyze" desc="Watch the results roll in instantly on your live dashboard." />
        </div>
      </div>

      {/* Feature Grid */}
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        marginTop: '8rem',
        marginBottom: '6rem'
      }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-h)', marginBottom: '3rem', fontWeight: 800, textAlign: 'center' }}>
          Everything you need
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          textAlign: 'left'
        }}>
          <FeatureCard
            title="Real-time Analytics"
            desc="Watch responses flow in live with instant charts and automatic data calculation."
          />
          <FeatureCard
            title="Secure & Anonymous"
            desc="Force authentication for strict voting, or allow anonymous submissions for broad reach."
          />
          <FeatureCard
            title="Beautifully Designed"
            desc="A clean, responsive interface that works perfectly on any device, day or night."
          />
          <FeatureCard
            title="Share Anywhere"
            desc="Generate unique, short links instantly to distribute your polls on social media, email, or chat."
          />
        </div>
      </div>

      <footer style={{
        width: '100%',
        borderTop: '1px solid var(--border)',
        paddingTop: '2rem',
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'var(--text)',
        fontSize: '0.9rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>&copy; {new Date().getFullYear()} Opinio. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#" style={{ color: 'var(--text)', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: 'var(--text)', textDecoration: 'none' }}>Terms</a>
          <a href="#" style={{ color: 'var(--text)', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 768px) {
          .step-line {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ title, desc }) {
  return (
    <div style={{
      padding: '2rem',
      background: 'var(--social-bg)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default'
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem', color: 'var(--text-h)' }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.5 }}>
        {desc}
      </p>
    </div>
  )
}

function InteractiveDemo() {
  const [votes, setVotes] = useState({ a: 45, b: 20 })
  const [copied, setCopied] = useState(false)

  // Simulate live votes
  useEffect(() => {
    const interval = setInterval(() => {
      setVotes(prev => ({
        a: prev.a + Math.floor(Math.random() * 4),
        b: prev.b + Math.floor(Math.random() * 2)
      }))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const total = votes.a + votes.b
  const pctA = Math.round((votes.a / total) * 100)
  const pctB = Math.round((votes.b / total) * 100)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      display: 'flex',
      gap: '2rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '4rem',
      width: '100%',
      maxWidth: '800px',
      animation: 'fadeUp 0.8s ease-out forwards',
      opacity: 0,
      transform: 'translateY(20px)'
    }}>
      {/* Analytics Demo Card */}
      <div style={{
        flex: '1 1 300px',
        background: 'var(--social-bg)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h4 style={{ margin: 0, color: 'var(--text-h)' }}>Live Results</h4>
          <span style={{ fontSize: '11px', background: '#16a34a', color: '#fff', padding: '3px 8px', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Live
          </span>
        </div>

        {/* Option A */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: 'var(--text)' }}>
            <span>Option A</span>
            <span style={{ fontWeight: 600 }}>{pctA}%</span>
          </div>
          <div style={{ background: 'var(--code-bg)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${pctA}%`, background: 'var(--accent)', height: '100%', transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
          </div>
        </div>

        {/* Option B */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: 'var(--text)' }}>
            <span>Option B</span>
            <span style={{ fontWeight: 600 }}>{pctB}%</span>
          </div>
          <div style={{ background: 'var(--code-bg)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${pctB}%`, background: '#8b5cf6', height: '100%', transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
          </div>
        </div>
      </div>

      {/* Share Demo Card */}
      <div style={{
        flex: '1 1 300px',
        background: 'var(--social-bg)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h4 style={{ margin: '0 0 1rem', color: 'var(--text-h)' }}>Share your poll</h4>
        <p style={{ margin: '0 0 1.25rem', fontSize: '14px', color: 'var(--text)', lineHeight: 1.5 }}>
          Instantly generate a unique link to gather responses from anyone, anywhere.
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            readOnly
            value="fe-opinio.vercel.app/poll/x8b2"
            style={{
              flex: 1,
              padding: '10px 12px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              color: 'var(--text-h)',
              fontSize: '13px',
              fontFamily: 'var(--mono)'
            }}
          />
          <button
            onClick={handleCopy}
            style={{
              padding: '10px 16px',
              background: copied ? '#16a34a' : 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              fontWeight: 500,
              fontSize: '14px'
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}

function StepCard({ number, title, desc }) {
  return (
    <div style={{
      flex: '1 1 200px',
      position: 'relative',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 1
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'var(--accent)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 0 0 10px var(--bg)'
      }}>
        {number}
      </div>
      <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.75rem', color: 'var(--text-h)' }}>{title}</h3>
      <p style={{ margin: 0, color: 'var(--text)', lineHeight: 1.6, fontSize: '1rem' }}>{desc}</p>
    </div>
  )
}
