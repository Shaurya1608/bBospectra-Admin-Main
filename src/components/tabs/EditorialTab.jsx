import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Search, Settings, Trash2, Loader2, X 
} from 'lucide-react';

const EditorialTab = ({
  P,
  editorialMembers,
  editingMember,
  setEditingMember,
  newMemberData,
  setNewMemberData,
  handleSaveMember,
  handleDeleteMember,
  memberSearch,
  setMemberSearch,
  submitting
}) => {
  const [showModal, setShowModal] = React.useState(false);

  // Open modal if we start editing a member
  React.useEffect(() => {
    if (editingMember) setShowModal(true);
  }, [editingMember]);

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setNewMemberData({ name: '', role: '', email: '', department: '', location: '', memberType: 'core', order: 0 });
  };

  return (
    <motion.div 
      key="editorial-tab"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      <div style={{ background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9', padding: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ padding: '0.4rem', background: `${P.secondary}15`, borderRadius: '0.6rem', color: P.secondary }}><Users size={16} /></div>
               <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.1rem', color: '#0f172a', letterSpacing: '-0.02em' }}>Editorial Board</h3>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '200px' }}>
                <Search style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={14} />
                <input 
                  placeholder="Filter members..." 
                  value={memberSearch} 
                  onChange={e => setMemberSearch(e.target.value)}
                  style={{ padding: '0.6rem 0.85rem 0.6rem 2.25rem', fontSize: '0.8rem', borderRadius: '0.85rem', background: '#f8fafc', border: '1px solid #f1f5f9', fontWeight: 500 }} 
                />
              </div>
              
              <button 
                onClick={() => setShowModal(true)}
                className="primary hover-lift" 
                style={{ 
                  padding: '0.65rem 1.25rem', fontSize: '0.8rem', fontWeight: 900, 
                  borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem',
                  background: P.secondary, color: 'white', border: 'none', cursor: 'pointer',
                  boxShadow: `0 8px 16px ${P.secondary}20`,
                  transition: 'all 0.3s ease'
                }}
              >
                Onboard Member <Users size={14} />
              </button>
            </div>
          </div>

          <div className="responsive-grid custom-scrollbar" style={{ display: 'grid', gap: '1rem', maxHeight: '480px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {editorialMembers.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#94a3b8', fontWeight: 600 }}>No board members registered.</p>}
            {editorialMembers.filter(m => 
              m.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
              m.role.toLowerCase().includes(memberSearch.toLowerCase())
            ).map(member => (
              <motion.div 
                key={member._id} 
                whileHover={{ y: -4, boxShadow: '0 12px 25px -5px rgba(0,0,0,0.05)' }}
                style={{ 
                  border: '1px solid #f1f5f9', padding: '1rem', borderRadius: '1.1rem', 
                  display: 'flex', flexDirection: 'column', gap: '1rem', 
                  background: editingMember?._id === member._id ? `${P.accent}05` : 'white', 
                  transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
                }}
              >
                {editingMember?._id === member._id && <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: P.accent }} />}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', background: `${P.secondary}10`, borderRadius: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 950, color: P.secondary }}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 900, fontSize: '0.9rem', color: '#0f172a' }}>{member.name}</p>
                      <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.75rem', color: P.secondary, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{member.role}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button 
                      onClick={() => { setEditingMember(member); setNewMemberData(member); setShowModal(true); }} 
                      style={{ padding: '0.5rem', borderRadius: '0.75rem', border: '1px solid #f1f5f9', background: 'white', cursor: 'pointer', color: '#1e293b' }}
                    >
                      <Settings size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteMember(member._id)} 
                      style={{ padding: '0.5rem', borderRadius: '0.75rem', border: '1px solid #fee2e2', background: '#fff1f2', cursor: 'pointer', color: '#ef4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                   <div style={{ background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: '0.85rem' }}>
                     <p style={{ margin: 0, fontSize: '0.6rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Group</p>
                     <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{member.memberType.replace('_', ' ')}</p>
                   </div>
                   <div style={{ background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: '0.85rem' }}>
                     <p style={{ margin: 0, fontSize: '0.6rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Location</p>
                     <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{member.location || 'N/A'}</p>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Onboarding Modal Overlay */}
      {showModal && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', 
          backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', 
          alignItems: 'center', justifyContent: 'center', padding: '1.25rem' 
        }}>
          <motion.div 
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            style={{ 
              background: 'white', borderRadius: '1.75rem', width: '100%', maxWidth: '400px', 
              padding: '1.75rem', border: '1px solid rgba(255,255,255,0.2)', 
              boxShadow: '0 25px 60px -12px rgba(0,0,0,0.3)',
              position: 'relative', overflowY: 'auto', maxHeight: '90vh',
              scrollbarWidth: 'none'
            }}
            className="custom-scrollbar"
          >
            {/* Top Accent Line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${P.secondary}, ${P.accent})` }} />

            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ 
                  margin: 0, fontWeight: 900, fontSize: '1.35rem', color: '#0f172a', 
                  letterSpacing: '-0.02em', fontFamily: 'var(--font-crimson-pro), serif' 
                }}>
                  {editingMember ? 'Update Profile' : 'Onboard Member'}
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                  {editingMember ? `Modifying profile for ${editingMember.name}` : 'Add a new expert to the editorial board.'}
                </p>
              </div>
              <button 
                onClick={closeModal}
                style={{ 
                  border: 'none', background: '#f8fafc', color: '#64748b', 
                  width: '28px', height: '28px', borderRadius: '8px', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid #f1f5f9'
                }}
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              await handleSaveMember(e);
              if (!submitting) closeModal();
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div className="form-group">
                <label style={{ marginBottom: '0.4rem', display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name & Titles</label>
                <input 
                  placeholder="e.g. Prof. Dr. Sarah Jenkins" 
                  value={newMemberData.name} 
                  onChange={e => setNewMemberData({...newMemberData, name: e.target.value})} 
                  required 
                  style={{ 
                    width: '100%', padding: '0.75rem 0.9rem', borderRadius: '0.85rem', 
                    background: '#f8fafc', border: '1px solid #e2e8f0', 
                    fontWeight: 600, fontSize: '0.85rem', color: '#1e293b'
                  }} 
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <label style={{ marginBottom: '0.4rem', display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Official Role</label>
                  <input 
                    placeholder="e.g. Editor-in-Chief" 
                    value={newMemberData.role} 
                    onChange={e => setNewMemberData({...newMemberData, role: e.target.value})} 
                    required 
                    style={{ 
                      width: '100%', padding: '0.75rem 0.9rem', borderRadius: '0.85rem', 
                      background: '#f8fafc', border: '1px solid #e2e8f0', 
                      fontWeight: 600, fontSize: '0.85rem', color: '#1e293b'
                    }} 
                  />
                </div>
                <div>
                  <label style={{ marginBottom: '0.4rem', display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hierarchy</label>
                  <select 
                    value={newMemberData.memberType} 
                    onChange={e => setNewMemberData({...newMemberData, memberType: e.target.value})} 
                    style={{ 
                      width: '100%', padding: '0.75rem 0.9rem', borderRadius: '0.85rem', 
                      background: '#f8fafc', border: '1px solid #e2e8f0', 
                      fontWeight: 700, fontSize: '0.8rem', color: P.secondary,
                      appearance: 'none', cursor: 'pointer'
                    }}
                  >
                    <option value="core">Executive</option>
                    <option value="national_advisory">Advisory</option>
                    <option value="national_editor">National</option>
                    <option value="foreign_editor">Foreign</option>
                    <option value="strategic">Strategic</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ marginBottom: '0.4rem', display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Academic Email</label>
                <input 
                  placeholder="jenkins@university.edu" 
                  value={newMemberData.email} 
                  onChange={e => setNewMemberData({...newMemberData, email: e.target.value})} 
                  style={{ 
                    width: '100%', padding: '0.75rem 0.9rem', borderRadius: '0.85rem', 
                    background: '#f8fafc', border: '1px solid #e2e8f0', 
                    fontWeight: 600, fontSize: '0.85rem', color: '#1e293b'
                  }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <label style={{ marginBottom: '0.4rem', display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</label>
                  <input 
                    placeholder="e.g. Zoology" 
                    value={newMemberData.department} 
                    onChange={e => setNewMemberData({...newMemberData, department: e.target.value})} 
                    style={{ 
                      width: '100%', padding: '0.75rem 0.9rem', borderRadius: '0.85rem', 
                      background: '#f8fafc', border: '1px solid #e2e8f0', 
                      fontWeight: 600, fontSize: '0.85rem', color: '#1e293b'
                    }} 
                  />
                </div>
                <div>
                  <label style={{ marginBottom: '0.4rem', display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>City, Country</label>
                  <input 
                    placeholder="e.g. Oxford, UK" 
                    value={newMemberData.location} 
                    onChange={e => setNewMemberData({...newMemberData, location: e.target.value})} 
                    style={{ 
                      width: '100%', padding: '0.75rem 0.9rem', borderRadius: '0.85rem', 
                      background: '#f8fafc', border: '1px solid #e2e8f0', 
                      fontWeight: 600, fontSize: '0.85rem', color: '#1e293b'
                    }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ marginBottom: '0.4rem', display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort Priority</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={newMemberData.order} 
                  onChange={e => setNewMemberData({...newMemberData, order: parseInt(e.target.value)})} 
                  style={{ 
                    width: '100%', padding: '0.75rem 0.9rem', borderRadius: '0.85rem', 
                    background: '#f8fafc', border: '1px solid #e2e8f0', 
                    fontWeight: 700, fontSize: '0.85rem', color: '#1e293b'
                  }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button 
                  className="primary hover-lift" 
                  type="submit" 
                  disabled={submitting} 
                  style={{ 
                    padding: '0.85rem', borderRadius: '1rem', fontWeight: 900, 
                    fontSize: '0.9rem', boxShadow: `0 10px 20px ${P.secondary}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : editingMember ? 'Update Profile' : 'Onboard Member'}
                </button>
                <button 
                  type="button"
                  onClick={closeModal} 
                  style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};

export default EditorialTab;
