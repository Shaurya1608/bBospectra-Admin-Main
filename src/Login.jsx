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
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#0f172a',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Abstract Background Shapes */}
      <div className="bg-blur" style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '40%', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', filter: 'blur(100px)' }} />
      <div className="bg-blur" style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '40%', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', filter: 'blur(100px)' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card"
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          background: 'rgba(255, 255, 255, 0.03)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '2.5rem',
          borderRadius: '1.5rem',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img 
            src="/logo/biospectra-logo.jpg" 
            alt="Biospectra Logo" 
            style={{ 
              width: '80px', 
              height: '80px', 
              objectFit: 'contain',
              margin: '0 auto 1.5rem auto',
              display: 'block'
            }} 
          />
          <h2 style={{ color: 'white', margin: 0, fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Admin Access</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.4)', margin: '0.5rem 0 0 0', fontSize: '0.8rem', fontWeight: 500 }}>Editorial Management Console</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ 
              opacity: 1, 
              y: 0,
              x: [0, -5, 5, -5, 5, 0] 
            }}
            style={{ 
              background: '#ef4444', 
              color: '#ffffff', 
              padding: '1rem', 
              borderRadius: '0.75rem', 
              fontSize: '0.85rem', 
              fontWeight: 900, 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span style={{ color: '#ffffff', display: 'block' }}>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!mfaRequired ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.2)' }} />
                  <input 
                    type="text" 
                    placeholder="Enter username" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    style={{ 
                      width: '100%', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)', 
                      borderRadius: '0.75rem', 
                      padding: '0.75rem 1rem 0.75rem 2.75rem', 
                      color: 'white', 
                      fontSize: '0.85rem',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }} 
                  />
                </div>
              </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.2)' }} />
                  <input 
                    key={showPassword ? "text" : "password"}
                    type={showPassword ? "text" : "password"} 
                    placeholder={showPassword ? "Enter password" : "••••••••"} 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ 
                      width: '100%', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)', 
                      borderRadius: '0.75rem', 
                      padding: '0.75rem 3rem 0.75rem 2.75rem', 
                      color: 'white', 
                      fontSize: '0.85rem',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'rgba(16, 185, 129, 0.8)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Code</label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
                <input 
                  type="text" 
                  placeholder="6-digit code" 
                  maxLength={6}
                  value={mfaToken}
                  onChange={e => setMfaToken(e.target.value)}
                  required
                  style={{ 
                    width: '100%', 
                    background: 'rgba(16, 185, 129, 0.05)', 
                    border: '1px solid rgba(16, 185, 129, 0.2)', 
                    borderRadius: '0.75rem', 
                    padding: '0.75rem 1rem 0.75rem 2.75rem', 
                    color: 'white', 
                    fontSize: '1.2rem',
                    letterSpacing: '0.5em',
                    textAlign: 'center',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }} 
                />
              </div>
              <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.65rem', textAlign: 'center' }}>Enter the code from your Google Authenticator app</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '1rem',
              padding: '0.85rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s',
              boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)'
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Access Dashboard <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '0.65rem', fontWeight: 500 }}>
            Secure Transmission Protocol Enabled <br />
            © {new Date().getFullYear()} Madhawi Shyam Educational Trust
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
