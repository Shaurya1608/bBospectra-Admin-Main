import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, QrCode, Loader2, Smartphone, Shield, CheckCircle2, Lock, ArrowRight, AlertCircle, RefreshCw
} from 'lucide-react';

const SecurityTab = ({
  P,
  mfaQrCode,
  setMfaQrCode,
  mfaSetupToken,
  setMfaSetupToken,
  handleSetupMfa,
  handleVerifyMfaSetup,
  submitting
}) => {
  return (
    <motion.div
      key="security-tab"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        marginTop: '-2rem' 
      }}
    >
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '1.5rem',
        width: '100%',
        maxWidth: '850px'
      }}>
        {/* Left Side: Steps & Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '1.5rem', 
            padding: '1.5rem', 
            border: '1px solid rgba(19, 50, 21, 0.05)',
            boxShadow: '0 10px 30px rgba(19, 50, 21, 0.02)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#133215', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Smartphone size={18} className="text-[#92B775]" />
              Setup Journey
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { step: 1, title: 'Download Authenticator', desc: 'Install Google Authenticator or Authy app.' },
                { step: 2, title: 'Synchronize Device', desc: 'Scan the encrypted QR code with your app.' },
                { step: 3, title: 'Verify Identity', desc: 'Enter the 6-digit cryptographic token.' }
              ].map((item, idx) => (
                <div key={item.step} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    background: mfaQrCode && idx < 2 ? '#22c55e' : '#f1f5f9', 
                    color: mfaQrCode && idx < 2 ? 'white' : '#94a3b8', 
                    borderRadius: '0.6rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '0.7rem', 
                    fontWeight: 900, 
                    flexShrink: 0,
                    transition: 'all 0.4s'
                  }}>
                    {mfaQrCode && idx < 1 ? <CheckCircle2 size={14} /> : item.step}
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 0.15rem 0', fontSize: '0.85rem', fontWeight: 800, color: '#133215' }}>{item.title}</h5>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(19, 50, 21, 0.5)', lineHeight: 1.4 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Action */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {!mfaQrCode ? (
              <motion.div
                key="start"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ 
                  width: '100%', 
                  maxWidth: '360px',
                  background: '#133215', 
                  borderRadius: '1.5rem', 
                  padding: '2.5rem 2rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  textAlign: 'center',
                  boxShadow: '0 20px 40px -12px rgba(19, 50, 21, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  borderRadius: '1.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#92B775', 
                  marginBottom: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)' 
                }}>
                  <QrCode size={32} />
                </div>

                <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                  Begin Setup
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                  Generate your administrative security key.
                </p>

                <motion.button 
                  whileHover={{ scale: 1.02, background: '#ffffff' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSetupMfa}
                  disabled={submitting}
                  style={{ 
                    width: '100%', 
                    padding: '0.9rem', 
                    background: '#92B775', 
                    color: '#133215', 
                    border: 'none', 
                    borderRadius: '0.75rem', 
                    fontSize: '0.85rem', 
                    fontWeight: 900, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.3s'
                  }}
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <>Generate Code <ArrowRight size={16} /></>}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="verify"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ 
                  width: '100%', 
                  maxWidth: '360px',
                  background: 'white', 
                  borderRadius: '1.5rem', 
                  padding: '2rem', 
                  border: '1px solid rgba(19, 50, 21, 0.05)',
                  boxShadow: '0 15px 30px rgba(19, 50, 21, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div style={{ 
                  background: '#f8fafc', 
                  padding: '0.75rem', 
                  borderRadius: '1rem', 
                  border: '1px solid #f1f5f9', 
                  marginBottom: '1.5rem'
                }}>
                  <img src={mfaQrCode} alt="MFA QR Code" style={{ width: '160px', height: '160px', borderRadius: '0.5rem' }} />
                </div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(19, 50, 21, 0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>
                      Verification Code
                    </label>
                    <input 
                      type="text"
                      placeholder="000 000" 
                      maxLength={6}
                      value={mfaSetupToken}
                      onChange={e => setMfaSetupToken(e.target.value.replace(/[^0-9]/g, ''))}
                      style={{ 
                        width: '100%',
                        textAlign: 'center', 
                        fontSize: '1.5rem', 
                        letterSpacing: '0.2em', 
                        fontWeight: 900, 
                        padding: '0.75rem', 
                        background: '#f8fafc',
                        border: '2px solid #f1f5f9',
                        borderRadius: '1rem',
                        color: '#133215',
                        outline: 'none',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleVerifyMfaSetup}
                    disabled={submitting || mfaSetupToken.length !== 6}
                    style={{ 
                      width: '100%', 
                      padding: '0.9rem', 
                      background: '#133215', 
                      color: '#92B775', 
                      border: 'none', 
                      borderRadius: '1rem', 
                      fontSize: '0.85rem', 
                      fontWeight: 900, 
                      cursor: 'pointer',
                      opacity: mfaSetupToken.length === 6 ? 1 : 0.6
                    }}
                  >
                    {submitting ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Confirm & Activate'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityTab;
