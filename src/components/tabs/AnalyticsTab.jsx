import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, BookOpen, FolderOpen, FileText, 
  Activity, Database, Globe, ShieldCheck, 
  RefreshCw, Clock 
} from 'lucide-react';

const AnalyticsTab = ({
  P,
  journalTree,
  totalIssuesCount,
  totalSectionsCount,
  totalArticlesCount
}) => {
  return (
    <motion.div 
      key="analytics-tab"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      <div className="stat-card-row" style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Volumes', value: journalTree.length, icon: <Layers size={20} />, color: P.primary, gradient: `linear-gradient(135deg, ${P.primary}, ${P.accent})` },
          { label: 'Total Issues', value: totalIssuesCount, icon: <BookOpen size={20} />, color: P.secondary, gradient: `linear-gradient(135deg, ${P.secondary}, #7c3aed)` },
          { label: 'Total Sections', value: totalSectionsCount, icon: <FolderOpen size={20} />, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #d8b4fe)' },
          { label: 'Total Articles', value: totalArticlesCount, icon: <FileText size={20} />, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx} 
            whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}
            style={{ 
              background: 'white', padding: '1rem', borderRadius: '1rem', 
              display: 'flex', flexDirection: 'column', gap: '0.5rem', 
              position: 'relative', overflow: 'hidden', border: '1px solid #f1f5f9',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.5rem', background: `${stat.color}15`, borderRadius: '0.75rem', color: stat.color }}>
                {React.cloneElement(stat.icon, { size: 16 })}
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: stat.gradient, opacity: 0.05, position: 'absolute', top: -10, right: -10 }} />
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a', marginTop: '0.1rem', letterSpacing: '-0.03em' }}>{stat.value}</div>
            </div>
            <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                style={{ height: '100%', background: stat.gradient, borderRadius: '10px' }} 
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="analytics-main-grid" style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f8fafc', paddingBottom: '1rem' }}>
            <div style={{ padding: '0.6rem', background: '#f0fdf4', borderRadius: '0.85rem', color: P.accent }}>
              <Activity size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1rem', color: '#0f172a' }}>Editorial Performance</h3>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>System telemetry and repository health</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div>
               <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, fontWeight: 500 }}>
                 The <span style={{ color: P.primary, fontWeight: 800 }}>Biospectra Engine</span> is operating at <span style={{ color: P.accent, fontWeight: 800 }}>Peak Efficiency</span>, managing <span style={{ fontWeight: 800, color: '#0f172a' }}>{totalArticlesCount}</span> peer-reviewed manuscripts.
               </p>
               <div className="responsive-grid" style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
                  {[
                    { label: 'Database Integrity', status: 'Optimal', icon: <Database size={14} />, color: P.accent },
                    { label: 'Asset Server', status: 'Connected', icon: <Globe size={14} />, color: P.primary },
                    { label: 'Security Layer', status: 'Shielded', icon: <ShieldCheck size={14} />, color: P.secondary },
                    { label: 'Sync Status', status: 'Live', icon: <RefreshCw size={14} />, color: '#f59e0b' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                      <div style={{ color: item.color }}>{item.icon}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{item.label}</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: '#1e293b' }}>{item.status}</p>
                      </div>
                    </div>
                  ))}
               </div>
             </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: `radial-gradient(circle, ${P.accent}10 0%, transparent 70%)`, pointerEvents: 'none' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.6rem', background: '#f8fafc', borderRadius: '0.85rem', color: P.accent, border: '1px solid #f1f5f9' }}>
              <Clock size={16} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1rem', color: '#0f172a' }}>Audit Log</h3>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Real-time repository events</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
             {[1,2,3,4].map(i => (
               <div key={i} style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
                 {i < 4 && <div style={{ position: 'absolute', left: '10px', top: '24px', bottom: '-14px', width: '2px', background: '#f1f5f9' }} />}
                 <div style={{ 
                    width: '22px', height: '22px', 
                    background: i === 1 ? P.accent : '#f1f5f9', 
                    borderRadius: '50%', 
                    border: '4px solid white', 
                    zIndex: 1, flexShrink: 0,
                    boxShadow: i === 1 ? `0 0 15px ${P.accent}40` : 'none'
                 }} />
                 <div>
                   <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: i === 1 ? '#0f172a' : '#475569' }}>
                     {i === 1 ? 'Global database synchronization' : i === 2 ? 'New article metadata commit' : 'System integrity check'}
                   </p>
                   <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.15rem' }}>{i * 3} hours ago • Admin session</p>
                 </div>
               </div>
             ))}
          </div>

          <button style={{ 
            marginTop: '1.75rem', width: '100%', 
            background: '#f8fafc', border: '1px solid #f1f5f9', 
            color: '#475569', padding: '0.85rem', borderRadius: '1rem', 
            fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
            transition: 'all 0.2s'
          }} className="hover-lift">
            View Full Security Audit
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsTab;
