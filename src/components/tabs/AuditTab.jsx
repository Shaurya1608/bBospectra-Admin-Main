import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Monitor, Smartphone, Globe, 
  Clock, XCircle, AlertCircle, Loader2, 
  MapPin, CheckCircle2, LogOut
} from 'lucide-react';
import { getSessions, terminateSession } from '../../services/api';

const AuditTab = ({ P }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await getSessions();
      setSessions(data.sessions);
    } catch (err) {
      setError('Failed to load active sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = async (sessionId) => {
    setTerminating(sessionId);
    try {
      await terminateSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (err) {
      alert('Failed to terminate session');
    } finally {
      setTerminating(null);
    }
  };

  const getDeviceIcon = (device) => {
    if (!device) return <Monitor size={18} />;
    const d = device.device?.toLowerCase() || '';
    if (d.includes('iphone') || d.includes('android') || d.includes('mobile')) {
      return <Smartphone size={18} />;
    }
    return <Monitor size={18} />;
  };

  return (
    <div className="audit-tab-container">
      <header style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: P.primaryDark, margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>Security Audit</h3>
        <p style={{ color: P.textMuted, margin: '0.25rem 0 0 0', fontSize: '0.8rem' }}>Monitor and manage active administrative sessions</p>
      </header>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: P.textMuted }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
            <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Analyzing active sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', background: 'white', borderRadius: '1.5rem', border: '1px dashed #e2e8f0' }}>
            <Shield size={40} style={{ margin: '0 auto 1rem auto', color: '#e2e8f0' }} />
            <p style={{ color: P.textMuted, fontSize: '0.8rem' }}>No active sessions found (how are you here?)</p>
          </div>
        ) : (
          <AnimatePresence>
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.5rem',
                  border: session.isCurrent ? `1px solid ${P.primary}40` : '1px solid #f1f5f9',
                  background: session.isCurrent ? `${P.primary}05` : 'white'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '12px', 
                    background: session.isCurrent ? P.primary : '#f8fafc',
                    color: session.isCurrent ? 'white' : P.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getDeviceIcon(session.device)}
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, color: P.text, fontSize: '0.9rem' }}>
                        {session.device?.browser || 'Unknown Browser'} on {session.device?.os || 'Unknown OS'}
                      </span>
                      {session.isCurrent && (
                        <span style={{ 
                          padding: '0.2rem 0.5rem', 
                          background: P.primary, 
                          color: 'white', 
                          fontSize: '0.6rem', 
                          fontWeight: 900, 
                          borderRadius: '100px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>Current Session</span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: P.textMuted, fontSize: '0.7rem' }}>
                        <MapPin size={12} />
                        {session.ipAddress || 'Private IP'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: P.textMuted, fontSize: '0.7rem' }}>
                        <Clock size={12} />
                        Active {new Date(session.lastActive).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>

                {!session.isCurrent && (
                  <button
                    onClick={() => handleTerminate(session.id)}
                    disabled={terminating === session.id}
                    style={{
                      padding: '0.6rem 1rem',
                      background: '#fff1f2',
                      color: '#e11d48',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ffe4e6'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff1f2'}
                  >
                    {terminating === session.id ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
                    Revoke Access
                  </button>
                )}
                {session.isCurrent && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: P.primary, fontSize: '0.75rem', fontWeight: 800 }}>
                    <CheckCircle2 size={16} />
                    Active Now
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 800, color: P.text }}>Security Tips</h4>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: P.textMuted, fontSize: '0.75rem', lineHeight: 1.6 }}>
          <li>Always revoke sessions from devices you don't recognize.</li>
          <li>We recommend having MFA (Multi-Factor Authentication) enabled for all administrative accounts.</li>
          <li>Sessions automatically expire after 30 days of inactivity.</li>
        </ul>
      </div>
    </div>
  );
};

export default AuditTab;
