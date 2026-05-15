import React from 'react';
import { motion } from 'framer-motion';
import { 
  Info, Layers, Image, Users, 
  FileText, Settings, Trash2, Loader2, 
  X
} from 'lucide-react';

const AboutTab = ({
  P,
  aboutSections,
  editingAbout,
  setEditingAbout,
  newAboutData,
  setNewAboutData,
  handleSaveAbout,
  handleDeleteAbout,
  submitting
}) => {
  const [showModal, setShowModal] = React.useState(false);

  // Open modal if we start editing a section
  React.useEffect(() => {
    if (editingAbout) setShowModal(true);
  }, [editingAbout]);

  const closeModal = () => {
    setShowModal(false);
    setEditingAbout(null);
    setNewAboutData({ title: '', content: '', sectionType: 'history', order: 0 });
  };

  return (
    <motion.div 
      key="about-tab"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      style={{ background: '#F9FBF7', minHeight: '100%', borderRadius: '1.5rem', padding: '1rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 950, fontSize: '1.5rem', color: '#133215', letterSpacing: '-0.02em' }}>Journal Info</h2>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#92B775', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Manage Information</p>
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '1.25rem', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 4px 20px rgba(19,50,21,0.03)' }}>
        <div style={{ background: 'linear-gradient(90deg, #f0fdf4 0%, #ffffff 100%)', padding: '0.75rem 1.25rem', borderRadius: '1rem', marginBottom: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: '#133215', color: 'white', padding: '0.5rem', borderRadius: '0.75rem' }}><Info size={16} /></div>
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: '#133215' }}>Website Content</p>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Edit the information shown on your About page.</p>
          </div>
        </div>

        <div>
          </div>
          
        <div className="responsive-about-grid" style={{ marginBottom: '1rem' }}>
          <style>{`
            .responsive-about-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1rem;
            }
            @media (max-width: 768px) {
              .responsive-about-grid {
                grid-template-columns: 1fr;
              }
            }
          `}</style>
            {/* CARD 1: IDENTITY & ISSN */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: P.primary, color: 'white', padding: '0.4rem', borderRadius: '0.5rem' }}><FileText size={16} /></div>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: P.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Regn. & ISSN</h4>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.5 }}>
                  Edit official Registration/ISSN.
                </p>
                <button onClick={() => { const s = aboutSections.find(s => s.sectionType === 'publication'); if(s) { setEditingAbout(s); setNewAboutData(s); setShowModal(true); } }} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.85rem', border: '1px solid #e2e8f0', background: 'white', fontWeight: 800, fontSize: '0.75rem', color: P.primary, cursor: 'pointer' }}>Edit Details</button>
            </div>

            {/* CARD 2: ACADEMIC BODY (ICCB) */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: '#92B775', color: 'white', padding: '0.4rem', borderRadius: '0.5rem' }}><Users size={16} /></div>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: '#133215', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Academic Forum</h4>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.5 }}>Update ICCB info.</p>
                <button onClick={() => { const s = aboutSections.find(s => s.sectionType === 'founder'); if(s) { setEditingAbout(s); setNewAboutData(s); setShowModal(true); } }} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.85rem', border: '1px solid #e2e8f0', background: 'white', fontWeight: 800, fontSize: '0.75rem', color: '#133215', cursor: 'pointer' }}>Edit Info</button>
            </div>
          </div>

          {/* CARD 3: THE TRUST LEGACY (FULL WIDTH) */}
          <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: '#133215', color: 'white', padding: '0.5rem', borderRadius: '0.75rem' }}><Settings size={18} /></div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#133215' }}>Trust History</h4>
                </div>
                <button 
                  onClick={() => { const s = aboutSections.find(s => s.sectionType === 'history'); if(s) { setEditingAbout(s); setNewAboutData(s); setShowModal(true); } }}
                  className="primary-btn" 
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 800 }}
                >
                  Edit History
                </button>
              </div>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', maxHeight: '100px', overflow: 'hidden', position: 'relative' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569', lineHeight: 1.7, fontWeight: 500 }}>
                  {aboutSections.find(s => s.sectionType === 'history')?.content || "No history defined."}
                </p>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35px', background: 'linear-gradient(transparent, white)' }} />
              </div>
          </div>


        </div>

      {/* Module Edit Modal */}
      {showModal && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', 
          backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', 
          alignItems: 'center', justifyContent: 'center', padding: '1rem' 
        }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ 
              background: 'white', borderRadius: '1.5rem', width: '100%', maxWidth: '550px', 
              padding: '1.75rem', border: '1px solid #f1f5f9', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' 
            }}
          >
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.1rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
                  {editingAbout ? 'Edit Information' : 'Add Information'}
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                  {editingAbout ? `Updating the content for \"${editingAbout.title}\"` : 'Enter the details for this section below.'}
                </p>
              </div>
              <button 
                onClick={closeModal}
                style={{ border: 'none', background: '#f1f5f9', color: '#64748b', padding: '0.4rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              await handleSaveAbout(e);
              if (!submitting) closeModal();
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ marginBottom: '0.4rem', display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569' }}>SECTION TITLE</label>
                <input placeholder="e.g. Official Publication" value={newAboutData.title} onChange={e => setNewAboutData({...newAboutData, title: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.85rem', background: '#f8fafc', border: '1px solid #f1f5f9', fontWeight: 600, fontSize: '0.85rem', outline: 'none' }} />
              </div>
              
              <div>
                <label style={{ marginBottom: '0.4rem', display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569' }}>TEXT CONTENT</label>
                <textarea placeholder="Write the comprehensive text content here..." rows={12} value={newAboutData.content} onChange={e => setNewAboutData({...newAboutData, content: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.85rem', background: '#f8fafc', border: '1px solid #f1f5f9', fontWeight: 500, lineHeight: 1.6, fontSize: '0.85rem', outline: 'none' }} />
              </div>



              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button className="primary-btn" type="submit" disabled={submitting} style={{ padding: '0.85rem', borderRadius: '1rem', fontWeight: 900, fontSize: '0.85rem', boxShadow: `0 10px 20px ${P.primary}20` }}>
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : editingAbout ? 'Save Changes' : 'Publish Details'}
                </button>
                <button type="button" onClick={closeModal} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AboutTab;
