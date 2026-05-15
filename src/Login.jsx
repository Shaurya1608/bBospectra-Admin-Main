import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, User, Loader2, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { login, loginMfa } from './services/api';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorTimer, setErrorTimer] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      
      if (errorTimer) clearTimeout(errorTimer);
      
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
      fontFamily: '"Inter", system-ui, sans-serif',
      alignItems: 'stretch',
      justifyContent: 'flex-end',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .glass-portal {
            width: 100% !important;
            padding: 0 1.5rem !important;
            justify-content: center !important;
            background: linear-gradient(135deg, rgba(2, 12, 4, 0.8) 0%, rgba(1, 8, 3, 0.95) 100%) !important;
          }
          .login-header h1 {
            font-size: 2rem !important;
          }
          .login-form {
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* Cinematic Darkening Overlay */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)' 
      }} />

      {/* Glass Portal (Right Side) */}
      <motion.div 
        className="glass-portal"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          position: 'relative', 
          zIndex: 10,
          width: '50%', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, rgba(2, 12, 4, 0.7) 0%, rgba(1, 8, 3, 0.85) 100%)', 
          backdropFilter: 'blur(100px)', 
          WebkitBackdropFilter: 'blur(100px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0 8%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '-20px 0 50px rgba(0,0,0,0.3)'
        }}
      >
        <div className="login-form" style={{ maxWidth: '360px', width: '100%', margin: '0 auto' }}>
          <div className="login-header" style={{ marginBottom: '2.5rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 style={{ 
                color: 'white', 
                fontSize: '2.4rem', 
                fontWeight: 800, 
                margin: 0, 
                letterSpacing: '-0.04em',
                lineHeight: 1
              }}>
                Welcome back
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', marginTop: '0.5rem', fontSize: '0.95rem', fontWeight: 400, letterSpacing: '-0.01em' }}>
                Enter your credentials to access the console.
              </p>
            </motion.div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.2)', 
                color: '#fca5a5', 
                padding: '0.85rem 1rem', 
                borderRadius: '0.75rem', 
                fontSize: '0.8rem', 
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Username</label>
              <input 
                type="text" 
                placeholder="Enter your username" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem',
                  padding: '0.9rem 1.25rem', 
                  color: 'white', 
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem',
                  padding: '0.9rem 1.25rem', 
                  color: 'white', 
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }} 
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit" 
              disabled={loading}
              style={{ 
                marginTop: '0.5rem',
                padding: '0.9rem',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'Sign In'}
            </motion.button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <motion.button 
              whileHover={{ scale: 1.01, background: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={() => {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                window.location.href = `${baseUrl}/auth/google`;
              }}
              style={{ 
                padding: '0.85rem',
                background: 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </motion.button>
          </form>

          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.85rem', fontWeight: 400 }}>
              Need an administrative account? <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}>Contact Support</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
