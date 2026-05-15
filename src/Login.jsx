import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, User, Loader2, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { login, loginMfa } from './services/api';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorTimer, setErrorTimer] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mfaRequired) {

        const res = await loginMfa(userId, mfaToken);

        onLoginSuccess();
      } else {

        const res = await login(username, password);

        if (res.status === 'mfa_required') {
          setMfaRequired(true);
          setUserId(res.userId);

        } else {
          onLoginSuccess();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      
      // Clear existing timer if any
      if (errorTimer) clearTimeout(errorTimer);
      
      // Set new timer to clear error after 4 seconds
      const timer = setTimeout(() => {
        setError('');
      }, 4000);
      setErrorTimer(timer);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      backgroundImage: 'url("/login/login.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-inter), sans-serif',
      alignItems: 'stretch',
      justifyContent: 'flex-end',
      paddingRight: 0
    }}>
      {/* Dark overlay for base background readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />

      {/* Glass Portal (Right Half) */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{ 
          position: 'relative', 
          zIndex: 10,
          width: '50%', 
          minHeight: '100vh',
          background: 'rgba(2, 12, 4, 0.4)', 
          backdropFilter: 'blur(80px)', 
          WebkitBackdropFilter: 'blur(80px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0 10%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'left'
        }}
      >
        <div style={{ marginBottom: '3.5rem' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.8rem', 
            fontWeight: 600, 
            margin: 0, 
            letterSpacing: '-0.03em',
            lineHeight: 1.1
          }}>
            Welcome back
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.75rem', fontSize: '1rem', fontWeight: 400 }}>
            Please enter your details.
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.85rem', marginBottom: '2rem' }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {!mfaRequired ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ color: 'white', fontSize: '1rem', fontWeight: 600 }}>E-mail</label>
                <input 
                  type="text" 
                  placeholder="Enter your e-mail" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  style={{ 
                    width: '100%', 
                    background: 'transparent', 
                    border: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.15)', 
                    padding: '0.5rem 0 1rem 0', 
                    color: 'white', 
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }} 
                  onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.8)'}
                  onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.15)'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ color: 'white', fontSize: '1rem', fontWeight: 600 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ 
                      width: '100%', 
                      background: 'transparent', 
                      border: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.15)', 
                      padding: '0.5rem 0 1rem 0', 
                      color: 'white', 
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }} 
                    onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.8)'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.15)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 0, top: '40%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500 }}>
                  <input type="checkbox" style={{ accentColor: '#000', width: '16px', height: '16px', borderRadius: '4px' }} /> Remember me
                </label>
                <button type="button" style={{ background: 'none', border: 'none', color: 'white', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Forgot password?</button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>Security Verification</h3>
              <input 
                type="text" 
                placeholder="000000" 
                maxLength={6}
                value={mfaToken}
                onChange={e => setMfaToken(e.target.value)}
                required
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid white', color: 'white', fontSize: '2.5rem', textAlign: 'center', outline: 'none', letterSpacing: '0.4em', fontWeight: 700 }} 
              />
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9rem' }}>Enter the 6-digit code from your app</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '1.5rem',
              padding: '1.15rem',
              background: '#000000',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            {loading ? <Loader2 size={24} className="animate-spin mx-auto" /> : (mfaRequired ? 'Verify & Login' : 'Log in')}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <button 
            type="button"
            onClick={() => {
              const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
              window.location.href = `${baseUrl}/auth/google`;
            }}
            style={{ 
              padding: '1rem',
              background: 'white',
              color: '#1f2937',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.target.style.background = 'white'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.95rem' }}>
            Don't have an account? <span style={{ color: 'white', fontWeight: 700, cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>Register here</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
