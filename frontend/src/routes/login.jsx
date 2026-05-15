import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";

import useAuthStore from "../store/authStore";
import api from "../api/axios";

export const Route = createFileRoute("/login")({
  validateSearch: (search) => ({
    returnTo: search.returnTo ?? '/dashboard',
  }),
  component: Login,
});

function Login() {
  const { login, user } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { returnTo } = Route.useSearch();

  if (user) {
    navigate({ to: returnTo });
    return null;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const token = res.data.token;
      localStorage.setItem('token', token);
      const meRes = await api.get('/auth/me');
      login(token, meRes.data.user);
      navigate({ to: returnTo });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '70vh' 
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
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Please log in to your account
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: 'var(--text-h)' }}>
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
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
              placeholder="••••••••"
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
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <p style={{ textAlign: 'center', margin: '1rem 0 0', fontSize: '14px', color: 'var(--text)' }}>
            Don't have an account?{' '}
            <Link to="/register" search={{ returnTo }} style={{ fontWeight: 600 }}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
