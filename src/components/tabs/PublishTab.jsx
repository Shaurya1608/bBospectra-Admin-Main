import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, BookOpen, Layers, Plus, 
  ChevronRight, ArrowRight, Upload, 
  Loader2, CheckCircle, FileText, Shield
} from 'lucide-react';

const PublishTab = ({
  P,
  publishStep,
  setPublishStep,
  activeYear,
  setActiveYear,
  activeIssue,
  setActiveIssue,
  activeCategory,
  setActiveCategory,
  journalTree,
  currentYearData,
  currentIssueData,
  newYearInput,
  setNewYearInput,
  newCategoryInput,
  setNewCategoryInput,
  handleCreateYear,
  handleCreateCategory,
  handleUploadArticle,
  articleData,
  setArticleData,
  submitting,
  editingArticle,
  setEditingArticle,
  isElevated
}) => {
  const handleItalic = (fieldId) => {
    const el = document.getElementById(fieldId);
    if (!el) return;
    
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selectedText = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    const newValue = `${before}<i>${selectedText}</i>${after}`;
    
    // Update state based on field
    if (fieldId === 'article-title') {
      setArticleData({ ...articleData, title: newValue });
    } else if (fieldId === 'article-abstract') {
      setArticleData({ ...articleData, abstract: newValue });
    }

    // Restore focus and selection (slightly ahead to be inside the tags or after)
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + 3, end + 3);
    }, 0);
  };
  return (
    <motion.div 
      key="publish-tab"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Modern Stepper */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div style={{ background: 'white', padding: '0.4rem 1.5rem', borderRadius: '3rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {[
            { id: 1, label: 'Location' },
            { id: 2, label: 'Details' },
            { id: 3, label: 'Finish' }
          ].map((s, i) => (
            <React.Fragment key={s.id}>
              <div 
                onClick={() => setPublishStep(s.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  opacity: publishStep === s.id ? 1 : 0.6, 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = publishStep === s.id ? '1' : '0.6'}
              >
                <div style={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: publishStep >= s.id ? P.primary : '#f1f5f9', 
                  color: publishStep >= s.id ? 'white' : '#94a3b8', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.7rem', 
                  fontWeight: 900, 
                  boxShadow: publishStep === s.id ? `0 0 12px ${P.primary}40` : 'none'
                }}>{s.id}</div>
                <span style={{ fontSize: '0.75rem', fontWeight: 850, color: publishStep === s.id ? '#0f172a' : '#94a3b8' }}>{s.label}</span>
              </div>
              {i < 2 && <div style={{ width: 40, height: 2, background: publishStep > s.id ? P.primary : '#f1f5f9' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {publishStep === 1 ? (
        <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
          {/* Card 1: Select Year */}
          <div style={{ background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9', padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '500px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1rem', color: '#0f172a', letterSpacing: '-0.02em' }}>1. Select Year</h3>
              <Calendar size={18} color={P.accent} />
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {journalTree.sort((a, b) => b.year - a.year).map(y => (
                  <motion.button
                    key={y._id}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { setActiveYear(y); setActiveIssue(null); setActiveCategory(null); }}
                    style={{
                      padding: '0.75rem 0.5rem', fontSize: '0.85rem', fontWeight: 900, borderRadius: '1rem', border: '1.5px solid',
                      background: activeYear?._id === y._id ? 'white' : '#fcfcfc',
                      borderColor: activeYear?._id === y._id ? P.primary : '#f1f5f9',
                      color: activeYear?._id === y._id ? P.primary : '#475569',
                      cursor: 'pointer', transition: 'all 0.3s',
                      boxShadow: activeYear?._id === y._id ? `0 8px 16px ${P.primary}15` : 'none'
                    }}
                  >
                    {y.year}
                  </motion.button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateYear} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', background: '#f8fafc', padding: '0.4rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
              <input 
                placeholder="Add Year..." 
                style={{ flex: 1, padding: '0.5rem 0.6rem', border: 'none', background: 'transparent', fontSize: '0.8rem', fontWeight: 700 }}
                value={newYearInput} onChange={e => setNewYearInput(e.target.value)}
              />
              <button type="submit" style={{ width: 32, height: 32, borderRadius: '50%', background: '#0f172a', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={16} />
              </button>
            </form>
          </div>

          {/* Card 2: Pick Issue */}
          <div style={{ background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9', padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '500px', opacity: activeYear ? 1 : 0.4, transition: 'all 0.4s', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1rem', color: '#0f172a', letterSpacing: '-0.02em' }}>2. Pick Issue</h3>
              <BookOpen size={18} color={P.accent} />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
              {activeYear ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {currentYearData?.issues.map(issue => (
                    <motion.button
                      key={issue._id}
                      whileHover={{ x: 5 }}
                      onClick={() => { setActiveIssue(issue); setActiveCategory(null); }}
                      style={{
                        padding: '1rem 1.25rem', textAlign: 'left', borderRadius: '1rem', border: '1.5px solid',
                        background: activeIssue?._id === issue._id ? 'white' : '#fcfcfc',
                        borderColor: activeIssue?._id === issue._id ? P.primary : '#f1f5f9',
                        color: '#0f172a', cursor: 'pointer', transition: 'all 0.3s',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}
                    >
                      <span style={{ fontWeight: 850, fontSize: '0.85rem' }}>{issue.title}</span>
                      <ChevronRight size={14} color={activeIssue?._id === issue._id ? P.primary : '#cbd5e1'} />
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                   <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, lineHeight: 1.6 }}>Select a volume year from the first column to unlock issue selection.</p>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Define Section */}
          <div style={{ background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9', padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '500px', opacity: activeIssue ? 1 : 0.4, transition: 'all 0.4s', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1rem', color: '#0f172a', letterSpacing: '-0.02em' }}>3. Define Section</h3>
              <Layers size={18} color={P.secondary} />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
              {activeIssue ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {currentIssueData?.categories.map(c => (
                    <motion.button
                      key={c._id}
                      whileHover={{ x: 5 }}
                      onClick={() => { setActiveCategory(c); }}
                      style={{
                        padding: '0.85rem 1.25rem', textAlign: 'left', borderRadius: '1rem', border: '1.5px solid',
                        background: activeCategory?._id === c._id ? `${P.primary}05` : '#fcfcfc',
                        borderColor: activeCategory?._id === c._id ? P.primary : '#f1f5f9',
                        color: activeCategory?._id === c._id ? P.primary : '#0f172a', 
                        cursor: 'pointer', transition: 'all 0.3s',
                        display: 'flex', alignItems: 'center', gap: '0.75rem'
                      }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeCategory?._id === c._id ? P.primary : '#cbd5e1' }} />
                      <span style={{ fontWeight: 850, fontSize: '0.85rem' }}>{c.title}</span>
                    </motion.button>
                  ))}
                  <form onSubmit={handleCreateCategory} style={{ marginTop: '0.5rem', display: 'flex', gap: '0.6rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                    <input 
                      placeholder="New Section..." 
                      style={{ flex: 1, padding: '0.6rem 0.75rem', border: 'none', background: 'transparent', fontSize: '0.85rem', fontWeight: 700 }}
                      value={newCategoryInput} onChange={e => setNewCategoryInput(e.target.value)}
                    />
                    <button type="submit" style={{ width: 32, height: 32, borderRadius: '50%', background: P.secondary, border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={16} />
                    </button>
                  </form>
                </div>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                   <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, lineHeight: 1.6 }}>Pick an issue to define the scientific section for this manuscript.</p>
                </div>
              )}
            </div>
            
            {activeCategory && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setPublishStep(2)}
                style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: '1.25rem', background: P.primary, color: 'white', border: 'none', fontWeight: 900, cursor: 'pointer', boxShadow: `0 10px 20px ${P.primary}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontSize: '0.9rem' }}
              >
                Go to Article Details <ArrowRight size={16} />
              </motion.button>
            )}
          </div>
        </div>
      ) : publishStep === 2 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.05)', overflow: 'hidden' }}
        >
          <div style={{ background: '#f8fafc', padding: '1.25rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.1rem', color: '#0f172a' }}>Article Details</h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Selected Place: <span style={{ color: P.primary }}>{activeYear?.year} • {activeIssue?.title} • {activeCategory?.title}</span>
              </p>
            </div>
            <button onClick={() => setPublishStep(1)} style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>Change Place</button>
          </div>

          <form className="main-content-wrapper" onSubmit={(e) => { e.preventDefault(); setPublishStep(3); }} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>ARTICLE TITLE</label>
                <button 
                  type="button"
                  onClick={() => handleItalic('article-title')}
                  style={{ padding: '0.2rem 0.6rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '0.4rem', fontSize: '0.7rem', fontWeight: 900, color: P.primary, cursor: 'pointer', fontStyle: 'italic' }}
                >
                  I
                </button>
              </div>
              <textarea 
                id="article-title"
                rows={2}
                placeholder="Enter the full scholarly title of the article..." 
                style={{ width: '100%', padding: '0.85rem 1.25rem', borderRadius: '0.85rem', background: '#fcfcfc', border: '1.5px solid #f1f5f9', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.4 }}
                value={articleData.title} onChange={e => setArticleData({...articleData, title: e.target.value})} required 
              />
            </div>

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>AUTHORS</label>
                <input 
                  placeholder="e.g. Dr. John Doe, Prof. Sarah Smith" 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.85rem', background: '#fcfcfc', border: '1.5px solid #f1f5f9', fontSize: '0.85rem', fontWeight: 600 }}
                  value={articleData.authors} onChange={e => setArticleData({...articleData, authors: e.target.value})} required 
                />
              </div>
              <div className="form-group">
                <label style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>DOI / DIGITAL ID</label>
                <input 
                  placeholder="e.g. 10.1234/journal.2024.001" 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.85rem', background: '#fcfcfc', border: '1.5px solid #f1f5f9', fontSize: '0.85rem', fontWeight: 600 }}
                  value={articleData.doi} onChange={e => setArticleData({...articleData, doi: e.target.value})} 
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>AUTHOR AFFILIATION / DEPARTMENT</label>
              <input 
                placeholder="e.g. Department of Zoology, Guru Ghasidas Vishwavidyalaya..." 
                style={{ width: '100%', padding: '0.85rem 1.25rem', borderRadius: '0.85rem', background: '#fcfcfc', border: '1.5px solid #f1f5f9', fontSize: '0.85rem', fontWeight: 600 }}
                value={articleData.affiliation} onChange={e => setArticleData({...articleData, affiliation: e.target.value})} 
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>SUMMARY / ABSTRACT</label>
                <button 
                  type="button"
                  onClick={() => handleItalic('article-abstract')}
                  style={{ padding: '0.2rem 0.6rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '0.4rem', fontSize: '0.7rem', fontWeight: 900, color: P.primary, cursor: 'pointer', fontStyle: 'italic' }}
                >
                  I
                </button>
              </div>
              <textarea 
                id="article-abstract"
                rows={4} placeholder="Provide a concise summary of the research methodology and findings..." 
                style={{ width: '100%', padding: '1rem', borderRadius: '1rem', background: '#fcfcfc', border: '1.5px solid #f1f5f9', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 500 }}
                value={articleData.abstract} onChange={e => setArticleData({...articleData, abstract: e.target.value})} required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>KEYWORDS</label>
                <input 
                  placeholder="Separate with commas..." 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.85rem', background: '#fcfcfc', border: '1.5px solid #f1f5f9', fontSize: '0.85rem', fontWeight: 600 }}
                  value={articleData.keywords} onChange={e => setArticleData({...articleData, keywords: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>PDF FILE</label>
                <div style={{ position: 'relative', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '0.85rem', padding: '0.2rem' }}>
                  <input type="file" accept=".pdf" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} onChange={e => setArticleData({...articleData, file: e.target.files[0]})} />
                  <div style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <div style={{ width: 28, height: 28, background: articleData.file ? P.primary : '#94a3b8', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                       <Upload size={14} />
                     </div>
                     <span style={{ fontSize: '0.75rem', fontWeight: 800, color: articleData.file ? '#0f172a' : '#64748b' }}>
                       {articleData.file ? articleData.file.name : 'Choose File...'}
                     </span>
                  </div>
                </div>
              </div>
            </div>

            <button className="primary" type="submit" style={{ marginTop: '0.5rem', padding: '0.85rem', fontSize: '0.85rem', fontWeight: 950, borderRadius: '1rem', background: P.primary, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', boxShadow: `0 10px 20px ${P.primary}30` }}>
              Continue to Final Step <ArrowRight size={16} />
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          style={{ maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '2.5rem', border: '1px solid #f1f5f9', padding: '3rem', textAlign: 'center', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.08)' }}
        >
           <div style={{ width: 80, height: 80, background: `${P.primary}10`, color: P.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
             <CheckCircle size={40} />
           </div>
           <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.5rem', color: '#0f172a' }}>Ready to Publish</h3>
           <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
             The article "{articleData.title}" is ready to be added to the website. Please check the details before saving.
           </p>
           
           <div style={{ margin: '2.5rem 0', background: '#f8fafc', borderRadius: '1.5rem', padding: '1.5rem', textAlign: 'left', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>YEAR</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#0f172a' }}>{activeYear?.year}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>ISSUE</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#0f172a' }}>{activeIssue?.title}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>SUBJECT</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#0f172a' }}>{activeCategory?.title}</span>
              </div>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <button 
               onClick={handleUploadArticle} 
               disabled={submitting} 
               className="primary" 
               style={{ 
                 padding: '1rem', 
                 fontSize: '0.9rem', 
                 fontWeight: 950, 
                 borderRadius: '1.25rem', 
                 background: isElevated ? P.primary : '#133215', 
                 color: isElevated ? 'white' : '#92B775', 
                 border: isElevated ? 'none' : `1px solid ${P.primary}20`,
                 cursor: submitting ? 'not-allowed' : 'pointer', 
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center', 
                 gap: '0.75rem', 
                 boxShadow: isElevated ? `0 10px 20px ${P.primary}30` : '0 10px 30px rgba(19, 50, 21, 0.1)' 
               }}
             >
               {submitting ? (
                 <Loader2 size={24} className="animate-spin" />
               ) : !isElevated ? (
                 <>
                   <Shield size={20} /> Verify & Publish
                 </>
               ) : (
                 'Publish Now'
               )}
             </button>
             <button onClick={() => setPublishStep(2)} style={{ padding: '1rem', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 850, cursor: 'pointer' }}>Edit Details</button>
           </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PublishTab;
