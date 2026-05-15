import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck as Shield, QrCode, Loader2 
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
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', color: P.accent }}>
            <Shield size={24} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Two-Factor Authentication</h3>
          <p style={{ color: '#64748b', marginTop: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>Add an extra layer of security to your administrative account.</p>

          <div className="responsive-grid" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 900, color: '#1e293b' }}>Setup Instructions</h4>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { step: 1, text: 'Install Google Authenticator or Authy on your mobile device.' },
                  { step: 2, text: 'Click the button below to generate a unique security QR code.' },
                  { step: 3, text: 'Scan the QR code with your authenticator app.' },
                  { step: 4, text: 'Enter the 6-digit code from the app to verify and activate.' }
                ].map(item => (
                  <li key={item.step} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '18px', height: '18px', background: P.accent, color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, flexShrink: 0 }}>{item.step}</div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
              {!mfaQrCode ? (
                <button 
                  onClick={handleSetupMfa}
                  className="primary" 
                  style={{ padding: '0.85rem 1.5rem', fontSize: '0.85rem', width: '100%' }}
                  disabled={submitting}
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <>Get Started <QrCode size={18} /></>}
                </button>
              ) : (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.85rem', border: '1px solid #e2e8f0', display: 'inline-block', marginBottom: '1rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                    <img src={mfaQrCode} alt="MFA QR Code" style={{ width: '150px', height: '150px' }} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ textAlign: 'left', fontSize: '0.75rem' }}>Enter Verification Code</label>
                      <input 
                        placeholder="000000" 
                        maxLength={6}
                        value={mfaSetupToken}
                        onChange={e => setMfaSetupToken(e.target.value)}
                        style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '0.4em', fontWeight: 900, padding: '0.6rem' }}
                      />
                    </div>
                    <button 
                      onClick={handleVerifyMfaSetup}
                      className="primary" 
                      style={{ width: '100%', padding: '0.85rem' }}
                      disabled={submitting || mfaSetupToken.length !== 6}
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Activate MFA Now'}
                    </button>
                    <button 
                      onClick={() => setMfaQrCode(null)}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel Setup
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityTab;
