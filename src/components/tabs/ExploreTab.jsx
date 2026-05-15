import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Book, BookOpen, ChevronRight, 
  FileText, Folder, Trash2, Users, 
  ExternalLink, Pencil, Target 
} from 'lucide-react';

const ExploreTab = ({
  P,
  journalTree,
  activeYear,
  setActiveYear,
  activeIssue,
  setActiveIssue,
  setActiveCategory,
  currentYearData,
  currentIssueData,
  explorerSearch,
  setExplorerSearch,
  handleDeleteYear,
  handleDeleteCategory,
  handleDeleteArticle,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  setEditingArticle,
  setArticleData,
  setActiveTab,
  setPublishStep
}) => {
  // Global Search Logic
  const globalSearchResults = React.useMemo(() => {
    if (!explorerSearch || explorerSearch.length < 2) return [];
    
    const results = [];
    const query = explorerSearch.toLowerCase();
    
    journalTree.forEach(year => {
      year.issues.forEach(issue => {
        issue.categories.forEach(cat => {
          (cat.articles || []).forEach(art => {
            if (
              art.title?.toLowerCase().includes(query) ||
              art.authors?.toLowerCase().includes(query) ||
              art.doi?.toLowerCase().includes(query)
            ) {
              results.push({
                ...art,
                context: {
                  year,
                  issue,
                  category: cat
                }
              });
            }
          });
        });
      });
    });
    
    return results;
  }, [explorerSearch, journalTree]);
  return (
    <motion.div
      key="explore-tab"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      {/* Modern Search & Filter Bar */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
        <input
          placeholder="Filter repository by manuscript title, authors, or DOI..."
          style={{ 
            padding: '0.75rem 1.1rem 0.75rem 3rem', background: 'white', fontSize: '0.85rem', 
            borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            fontWeight: 500,
            width: '100%',
            outline: 'none'
          }}
          value={explorerSearch}
          onChange={e => setExplorerSearch(e.target.value)}
        />
      </div>

      {/* 3-Panel Professional Explorer */}
      <div className="explore-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: explorerSearch ? '1fr' : '180px 240px 1fr', 
        gap: '0', background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9', overflow: 'hidden', minHeight: '500px', boxShadow: '0 15px 40px -10px rgba(0,0,0,0.04)' 
      }}>

        {/* PANEL 1 — Archive Volumes */}
        {!explorerSearch && (
          <div style={{ borderRight: '1px solid #f1f5f9', background: '#fcfcfc' }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', background: 'white' }}>
            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Volumes</p>
          </div>
          <div className="custom-scrollbar" style={{ overflowY: 'auto', maxHeight: '540px' }}>
            {journalTree.sort((a, b) => b.year - a.year).map(year => (
              <div
                key={year._id}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem', 
                  background: activeYear?._id === year._id ? 'white' : 'transparent',
                  borderLeft: activeYear?._id === year._id ? `3px solid ${P.primary}` : '3px solid transparent',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  boxShadow: activeYear?._id === year._id ? 'inset 0 0 10px rgba(0,0,0,0.02)' : 'none',
                  position: 'relative'
                }}
                onClick={() => { setActiveYear(year); setActiveIssue(null); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', pointerEvents: 'none' }}>
                  <div style={{ padding: '0.35rem', background: activeYear?._id === year._id ? `${P.primary}10` : 'transparent', borderRadius: '0.5rem', color: activeYear?._id === year._id ? P.primary : '#94a3b8' }}>
                    <Book size={14} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: activeYear?._id === year._id ? '#0f172a' : '#64748b' }}>{year.year}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {activeYear?._id === year._id && (
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDeleteYear(year._id, year.year); 
                      }}
                      style={{ 
                        padding: '0.4rem', border: 'none', background: '#fff1f2', 
                        color: '#ef4444', cursor: 'pointer', borderRadius: '0.5rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                        zIndex: 20
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#ffe4e6'}
                      onMouseOut={e => e.currentTarget.style.background = '#fff1f2'}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <span style={{ 
                    fontSize: '0.65rem', 
                    background: activeYear?._id === year._id ? P.primary : '#f1f5f9', 
                    color: activeYear?._id === year._id ? 'white' : '#94a3b8', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '2rem', 
                    fontWeight: 800,
                    pointerEvents: 'none'
                  }}>
                    {year.issues.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

        {/* PANEL 2 — Publication Issues */}
        {!explorerSearch && (
          <div style={{ borderRight: '1px solid #f1f5f9', background: 'white' }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', background: '#fcfcfc' }}>
            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {activeYear ? `${activeYear.year} Issues` : 'Issues'}
            </p>
          </div>
          <div className="custom-scrollbar" style={{ overflowY: 'auto', maxHeight: '540px' }}>
            {!activeYear ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#cbd5e1' }}>
                <ChevronRight size={24} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700 }}>Select a volume</p>
              </div>
            ) : currentYearData?.issues.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#cbd5e1' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>No issues found</p>
              </div>
            ) : currentYearData?.issues.map(issue => (
              <motion.button
                key={issue._id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveIssue(issue)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem', border: 'none', textAlign: 'left', cursor: 'pointer',
                  background: activeIssue?._id === issue._id ? '#f0f4ff' : 'transparent',
                  borderLeft: activeIssue?._id === issue._id ? `3px solid ${P.secondary}` : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ padding: '0.35rem', background: activeIssue?._id === issue._id ? `${P.secondary}20` : 'transparent', borderRadius: '0.5rem', color: activeIssue?._id === issue._id ? P.secondary : '#94a3b8' }}>
                    <BookOpen size={14} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: activeIssue?._id === issue._id ? '#1e40af' : '#475569' }}>{issue.title}</span>
                </div>
                <span style={{ fontSize: '0.65rem', background: activeIssue?._id === issue._id ? P.secondary : '#f1f5f9', color: activeIssue?._id === issue._id ? 'white' : '#94a3b8', padding: '0.2rem 0.6rem', borderRadius: '2rem', fontWeight: 800 }}>
                  {issue.categories.reduce((a, c) => a + (c.articles?.length || 0), 0)}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

        {/* PANEL 3 — Manuscript Repository */}
        <div style={{ background: 'white' }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', background: '#fcfcfc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {explorerSearch ? 'Repository Search' : (currentIssueData ? `${currentIssueData.title} Repository` : 'Manuscripts')}
            </p>
            {!explorerSearch && currentIssueData && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', color: P.accent, fontWeight: 900, background: `${P.accent}10`, padding: '0.2rem 0.6rem', borderRadius: '2rem' }}>
                  {currentIssueData.categories.reduce((a, c) => a + (c.articles?.length || 0), 0)} ARTICLES TOTAL
                </span>
              </div>
            )}
          </div>
          <div className="custom-scrollbar" style={{ overflowY: 'auto', maxHeight: '540px', padding: '1.5rem', position: 'relative' }}>
            
            {/* Global Search Results Overlay */}
            {explorerSearch && (
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                background: 'white', zIndex: 50, padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                   <div style={{ color: P.primary, background: `${P.primary}10`, padding: '0.4rem', borderRadius: '0.6rem' }}>
                      <Search size={18} />
                   </div>
                   <div>
                     <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: '#0f172a' }}>Global Search Results</h3>
                     <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                       Found {globalSearchResults.length} {globalSearchResults.length === 1 ? 'manuscript' : 'manuscripts'} across all volumes
                     </p>
                   </div>
                   <button 
                    onClick={() => setExplorerSearch('')}
                    style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', background: '#f1f5f9', border: 'none', borderRadius: '0.5rem', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', color: '#64748b' }}
                   >
                     Clear
                   </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {globalSearchResults.length === 0 ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#cbd5e1' }}>
                       <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>No matching manuscripts found</p>
                       <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem' }}>Try searching by title, author, or DOI</p>
                    </div>
                  ) : globalSearchResults.map(art => (
                    <div
                      key={art._id}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                        padding: '1rem', borderRadius: '1rem',
                        border: '1px solid #f1f5f9', background: 'white', transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                      }}
                    >
                      <div style={{ padding: '0.5rem', background: `${P.accent}10`, borderRadius: '0.75rem', color: P.accent, flexShrink: 0 }}>
                        <FileText size={16} />
                      </div>
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', color: P.primary, background: `${P.primary}05`, padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>
                            {art.context.year.year} • {art.context.issue.title}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4 }}>{art.title}</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{art.authors}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <button 
                          onClick={() => {
                            setActiveYear(art.context.year);
                            setActiveIssue(art.context.issue);
                            setActiveCategory(art.context.category);
                            setExplorerSearch('');
                          }}
                          style={{ 
                            padding: '0.5rem 0.85rem', background: P.primary, color: 'white', 
                            border: 'none', borderRadius: '0.75rem', cursor: 'pointer', 
                            fontSize: '0.65rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem',
                            boxShadow: `0 4px 12px ${P.primary}20`
                          }}
                        >
                          <Target size={12} />
                          Locate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!currentIssueData ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#cbd5e1' }}>
                <div style={{ width: 60, height: 60, background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', border: '1px dashed #e2e8f0' }}>
                  <FileText size={24} />
                </div>
                <h4 style={{ margin: 0, color: '#1e293b', fontWeight: 900, fontSize: '0.9rem' }}>No Context Selected</h4>
                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Select a volume and issue to view the manuscript repository.</p>
              </div>
            ) : (
              currentIssueData.categories.map(cat => {
                const articles = (cat.articles || []).filter(art =>
                  !explorerSearch ||
                  art.title?.toLowerCase().includes(explorerSearch.toLowerCase()) ||
                  art.authors?.toLowerCase().includes(explorerSearch.toLowerCase()) ||
                  art.doi?.toLowerCase().includes(explorerSearch.toLowerCase())
                );
                return (
                  <div 
                    key={cat._id} 
                    style={{ 
                      marginBottom: '2rem', padding: '0.5rem', borderRadius: '1.25rem', border: '2px dashed transparent', transition: 'all 0.3s' 
                    }}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(e, cat._id)}
                  >
                    {/* Professional Section Header */}
                    <div 
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', 
                        background: 'white', borderRadius: '1rem', marginBottom: '1rem', 
                        border: `1px solid ${P.primary}20`, borderLeft: `4px solid ${P.primary}`,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        position: 'sticky', top: 0, zIndex: 10
                      }}
                    >
                      <div style={{ color: P.primary, background: `${P.primary}15`, padding: '0.4rem', borderRadius: '0.6rem' }}>
                        <Folder size={18} />
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.02em' }}>{cat.title}</span>
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.65rem', color: P.primary, fontWeight: 900, background: `${P.primary}10`, padding: '0.2rem 0.75rem', borderRadius: '2rem' }}>
                          {articles.length} MANUSCRIPTS
                        </span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat._id, cat.title); }}
                          style={{ padding: '0.5rem', border: 'none', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.75rem', cursor: 'pointer', color: '#ef4444', display: 'flex', transition: 'all 0.2s' }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                          onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
                          title="Delete Section"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Manuscripts List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {articles.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', background: '#fcfcfc', borderRadius: '1rem', border: '1px dashed #f1f5f9' }}>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600, fontStyle: 'italic' }}>No matching manuscripts found in this section.</p>
                        </div>
                      ) : articles.map(art => (
                        <motion.div
                          key={art._id}
                          draggable="true"
                          onDragStart={(e) => onDragStart(e, art._id)}
                          onDragEnd={onDragEnd}
                          whileHover={{ x: 5, borderColor: P.primary }}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                            padding: '0.85rem 1rem', borderRadius: '1rem',
                            border: '1px solid #f1f5f9', background: 'white', transition: 'all 0.2s',
                            cursor: 'grab', boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                          }}
                        >
                          <div style={{ padding: '0.5rem', background: `${P.accent}10`, borderRadius: '0.75rem', color: P.accent, flexShrink: 0 }}>
                            <FileText size={16} />
                          </div>
                          <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, letterSpacing: '-0.01em' }}>{art.title}</p>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Users size={12} /> {art.authors}
                              </p>
                              {art.doi && (
                                <p style={{ margin: 0, fontSize: '0.75rem', color: P.primary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <ExternalLink size={12} /> DOI Available
                                </p>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                            <button 
                              onClick={() => {
                                setEditingArticle(art);
                                setActiveYear(currentYearData);
                                setActiveIssue(currentIssueData);
                                setActiveCategory(cat);
                                setArticleData({
                                  title: art.title,
                                  authors: art.authors,
                                  abstract: art.abstract,
                                  keywords: art.keywords?.join(', ') || '',
                                  doi: art.doi || '',
                                  file: null
                                });
                                setPublishStep(2);
                                setActiveTab('publish');
                              }}
                              title="Edit Metadata" 
                              style={{ padding: '0.5rem', background: '#f0f4ff', border: '1px solid #dbeafe', borderRadius: '0.75rem', cursor: 'pointer', color: P.secondary, display: 'flex' }}
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteArticle(art._id)} 
                              title="Delete Paper" 
                              style={{ padding: '0.5rem', background: '#fff1f2', border: '1px solid #ffe4e6', borderRadius: '0.75rem', cursor: 'pointer', color: '#ef4444', display: 'flex' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExploreTab;
