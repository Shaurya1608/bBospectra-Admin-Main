import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { verifyMfaStepup } from '../services/api';

const MfaModal = ({ isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setLoading(true);
    setError('');

    try {
      await verifyMfaStepup(code);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '400px',
              background: 'linear-gradient(135deg, rgba(20, 30, 20, 0.9) 0%, rgba(10, 15, 10, 0.95) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
              overflow: 'hidden'
            }}
          >
            {/* Ambient Glow */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.05) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)'}
            >
              <X size={20} />
            </button>

            <div style={{
              width: '56px',
              height: '56px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#22c55e'
            }}>
              <ShieldCheck size={28} />
            </div>

            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
              Security Challenge
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.5 }}>
              This is a sensitive action. Please enter your 6-digit verification code to proceed.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    color: 'white',
                    fontSize: '2rem',
                    textAlign: 'center',
                    letterSpacing: '0.4em',
                    fontWeight: 700,
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(34, 197, 94, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || code.length !== 6}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: (loading || code.length !== 6) ? 'not-allowed' : 'pointer',
                  opacity: (loading || code.length !== 6) ? 0.7 : 1,
                  transition: 'all 0.3s'
                }}
              >
                {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'Confirm & Proceed'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MfaModal;
