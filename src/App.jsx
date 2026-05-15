import React, { useState, useEffect, useMemo } from 'react';
import './index.css';
import { 
  Plus, Upload, FileText, Database, 
  Layers, CheckCircle, Loader2, Search, 
  Trash2, ExternalLink, Calendar, BookOpen, 
  ArrowRight, Info, Globe, ShieldCheck,
  ChevronRight, FolderOpen, Target, LayoutDashboard,
  Library, Settings, BarChart3, Clock, AlertCircle,
  Activity, Layout, Users, RefreshCw, Zap, Book, Folder,
  Image, Camera, QrCode, ShieldCheck as Shield, Pencil, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getJournalTree, 
  createYear, 
  createCategory, 
  deleteCategory,
  uploadArticle, 
  deleteArticle,
  updateArticle,
  getAboutSections,
  createAboutSection,
  updateAboutSection,
  deleteAboutSection,
  getEditorialMembers,
  createEditorialMember,
  updateEditorialMember,
  deleteEditorialMember,
  getGalleryImages,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  deleteYear,
  getMfaSetup,
  verifyMfaSetup,
  logout as apiLogout
} from './services/api';
import Login from './Login';
import AnalyticsTab from './components/tabs/AnalyticsTab';
import PublishTab from './components/tabs/PublishTab';
import ExploreTab from './components/tabs/ExploreTab';
import AboutTab from './components/tabs/AboutTab';
import EditorialTab from './components/tabs/EditorialTab';
import GalleryTab from './components/tabs/GalleryTab';
import SecurityTab from './components/tabs/SecurityTab';
import AuditTab from './components/tabs/AuditTab';
import MfaModal from './components/MfaModal';

function App() {
  const [journalTree, setJournalTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('spectra_admin_token'));
  const [submitting, setSubmitting] = useState(false);
  const [health, setHealth] = useState({ db: 'CHECKING', cloudinary: 'OK' });
  const [activeTab, setActiveTab] = useState('analytics');
  const [mfaModal, setMfaModal] = useState({ isOpen: false, onResolve: null });

  // Handle Google OAuth callback redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('spectra_admin_token', token);
        localStorage.setItem('spectra_admin_user', JSON.stringify(user));
        setIsAuthenticated(true);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error('Error parsing Google login data:', e);
      }
    }
  }, []);

  // Centralized Theme Palette
  const P = {
    primary: '#133215',    // Brand Dark Green
    primaryDark: '#0d240e',
    secondary: '#92B775',  // Brand Lime Green
    accent: '#92B775',
    error: '#ef4444',
    bg: '#eef4ec',         // Brand Light Green
    white: '#ffffff',
    text: '#133215',
    textMuted: 'rgba(19, 50, 21, 0.6)',
    border: 'rgba(19, 50, 21, 0.1)'
  };

  const [mfaVerifiedAt, setMfaVerifiedAt] = useState(null);

  const isElevated = useMemo(() => {
    if (!mfaVerifiedAt) return false;
    const diff = Date.now() - mfaVerifiedAt;
    return diff < 15 * 60 * 1000; // 15 minutes
  }, [mfaVerifiedAt]);

  const handleLogout = () => {
    showConfirm(
      'Confirm Logout',
      'Are you sure you want to end your administrative session?',
      async () => {
        try {
          await apiLogout();
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          setIsAuthenticated(false);
          localStorage.removeItem('spectra_admin_token');
          localStorage.removeItem('spectra_admin_user');
          window.location.href = '/login'; // Force a clean start
        }
      }
    );
  };

  // Helper to handle MFA Step-up Challenges
  const withMfa = async (action) => {
    try {
      const result = await action();
      setMfaVerifiedAt(Date.now());
      return result;
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.status === 'mfa_required') {
        return new Promise((resolve, reject) => {
          setMfaModal({ 
            isOpen: true, 
            onResolve: async () => {
              try {
                const result = await action();
                setMfaVerifiedAt(Date.now());
                resolve(result);
              } catch (retryErr) {
                reject(retryErr);
              }
            } 
          });
        });
      }
      throw err;
    }
  };

  // Active Context States (The Flow)
  const [activeYear, setActiveYear] = useState(null);
  const [activeIssue, setActiveIssue] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  // Search/Filter states for Explorer
  const [explorerSearch, setExplorerSearch] = useState('');

  // Input States
  const [newYearInput, setNewYearInput] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  
  const [articleData, setArticleData] = useState({
    title: '',
    authors: '',
    abstract: '',
    keywords: '',
    doi: '',
    affiliation: '',
    file: null
  });

  // NEW: About & Editorial States
  const [aboutSections, setAboutSections] = useState([]);
  const [editorialMembers, setEditorialMembers] = useState([]);
  const [editingAbout, setEditingAbout] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  
  const [newAboutData, setNewAboutData] = useState({ title: '', content: '', sectionType: 'history', order: 0 });
  const [newMemberData, setNewMemberData] = useState({ name: '', role: '', email: '', department: '', location: '', memberType: 'core', order: 0 });

  const [memberSearch, setMemberSearch] = useState('');

  // Gallery States
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryData, setGalleryData] = useState({ title: '', description: '', category: 'general', order: 0, image: null });
  const [editingGallery, setEditingGallery] = useState(null);

  // Modal State
  const [modal, setModal] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    onConfirm: null,
    isAlert: false 
  });
  const [editingArticle, setEditingArticle] = useState(null);
  const [publishStep, setPublishStep] = useState(1); // 1: Context, 2: Metadata, 3: Finalize

  // MFA Setup State
  const [mfaQrCode, setMfaQrCode] = useState(null);
  const [mfaSecret, setMfaSecret] = useState('');
  const [mfaSetupToken, setMfaSetupToken] = useState('');

  const [isDeleting, setIsDeleting] = useState(false);

  const showConfirm = (title, message, onConfirm) => {
    setModal({ isOpen: true, title, message, onConfirm, isAlert: false });
  };

  const showAlert = (title, message) => {
    setModal({ isOpen: true, title, message, onConfirm: () => setModal({ ...modal, isOpen: false }), isAlert: true });
  };

  useEffect(() => {
    fetchData();
    fetchAboutData();
    fetchEditorialData();
    fetchGalleryData();
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAboutData = async () => {
    try {
      const data = await getAboutSections();
      setAboutSections(data);
    } catch (error) {
      console.error('About data error:', error);
    }
  };

  const fetchEditorialData = async () => {
    try {
      const data = await getEditorialMembers();
      setEditorialMembers(data);
    } catch (error) {
      console.error('Editorial data error:', error);
    }
  };

  const fetchGalleryData = async () => {
    try {
      const data = await getGalleryImages();
      setGalleryImages(data);
    } catch (error) {
      console.error('Gallery data error:', error);
    }
  };

  const checkHealth = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseUrl}/health`);
      const data = await response.json();
      setHealth({ db: data.database, cloudinary: 'OK' });
    } catch (error) {
      setHealth({ db: 'OFFLINE', cloudinary: 'OFFLINE' });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching Journal Tree...');
      const data = await getJournalTree();
      console.log('Data Received:', data);
      setJournalTree(data);
      
      // Update active references to fresh objects from the new data
      if (activeYear) {
        const freshYear = data.find(y => y._id === activeYear._id);
        if (freshYear) {
          setActiveYear(freshYear);
          if (activeIssue) {
            const freshIssue = freshYear.issues.find(i => i._id === activeIssue._id);
            if (freshIssue) {
              setActiveIssue(freshIssue);
              if (activeCategory) {
                const freshCat = freshIssue.categories.find(c => c._id === activeCategory._id);
                if (freshCat) setActiveCategory(freshCat);
              }
            }
          }
        }
      } else if (data.length > 0) {
        setActiveYear(data[0]);
      }
    } catch (error) {
      console.error('Error fetching tree:', error);
      showAlert('Sync Failed', 'Database connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateYear = async (e) => {
    e.preventDefault();
    if (!newYearInput) return;
    setSubmitting(true);
    try {
      await createYear(parseInt(newYearInput));
      setNewYearInput('');
      await fetchData();
    } catch (error) {
      showAlert('Error', 'Year already exists or server error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!activeIssue || !newCategoryInput) return;
    setSubmitting(true);
    try {
      await createCategory(activeIssue._id, newCategoryInput);
      setNewCategoryInput('');
      await fetchData();
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to create section';
      showAlert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadArticle = async (e) => {
    e.preventDefault();
    if (!activeCategory) return showAlert('Action Required', 'Please select a specific Section first');
    
    setSubmitting(true);
    
    try {
      if (editingArticle) {
        // Handle Update (Metadata only for now, file update can be added if needed)
        await updateArticle(editingArticle._id, {
          title: articleData.title,
          authors: articleData.authors,
          abstract: articleData.abstract,
          keywords: articleData.keywords,
          doi: articleData.doi,
          affiliation: articleData.affiliation,
          categoryId: activeCategory._id
        });
        showAlert('Success', 'Article metadata updated!');
        setEditingArticle(null);
      } else {
        // Handle New Upload
        if (!articleData.file) {
          setSubmitting(false);
          return showAlert('Required', 'Please select a PDF file to upload.');
        }
        const formData = new FormData();
        formData.append('title', articleData.title);
        formData.append('authors', articleData.authors);
        formData.append('abstract', articleData.abstract);
        formData.append('keywords', articleData.keywords);
        formData.append('doi', articleData.doi);
        formData.append('affiliation', articleData.affiliation);
        formData.append('categoryId', activeCategory._id);
        formData.append('file', articleData.file);
        await withMfa(() => uploadArticle(formData));
        showAlert('Success', 'Article published successfully!');
      }
      
      setArticleData({ title: '', authors: '', abstract: '', keywords: '', doi: '', affiliation: '', file: null });
      await fetchData();
    } catch (error) {
      showAlert('Operation Failed', error.response?.data?.message || 'There was an error processing your article.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    showConfirm('Delete Article', 'Are you sure you want to permanently delete this article?', async () => {
      try {
        await withMfa(() => deleteArticle(id));
        await fetchData();
      } catch (error) {
        showAlert('Error', 'Failed to delete article');
      }
    });
  };

  const handleDeleteCategory = async (id, title) => {
    showConfirm(
      'Delete Section', 
      `Are you sure you want to delete the "${title}" section? This will also permanently delete ALL articles inside it.`, 
      async () => {
        try {
          await withMfa(() => deleteCategory(id));
          setActiveCategory(null);
          await fetchData();
        } catch (error) {
          showAlert('Error', 'Failed to delete section');
        }
      }
    );
  };

  const handleDeleteYear = async (id, year) => {
    console.log('Initiating delete for year:', year, 'ID:', id);
    showConfirm(
      'Delete Volume', 
      `Are you sure you want to delete the Year ${year}? This will permanently delete ALL issues, sections, and articles inside it, including Cloudinary files.`, 
      async () => {
        try {
          console.log('Confirming delete for Year ID:', id);
          await withMfa(() => deleteYear(id));
          console.log('Delete successful');
          setActiveYear(null);
          await fetchData();
          showAlert('Success', `Volume ${year} deleted successfully.`);
        } catch (error) {
          console.error('Delete Year Error:', error);
          showAlert('Error', 'Failed to delete volume: ' + (error.response?.data?.message || error.message));
        }
      }
    );
  };

  // Drag and Drop Handlers
  const onDragStart = (e, articleId) => {
    e.dataTransfer.setData('articleId', articleId);
    e.currentTarget.style.opacity = '0.4';
  };

  const onDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.background = '#ecfdf5';
    e.currentTarget.style.borderColor = 'P.accent';
  };

  const onDragLeave = (e) => {
    e.currentTarget.style.background = '#f8fafc';
    e.currentTarget.style.borderColor = '#f1f5f9';
  };

  const onDrop = async (e, targetCategoryId) => {
    e.preventDefault();
    const articleId = e.dataTransfer.getData('articleId');
    
    // Reset styles
    e.currentTarget.style.background = '#f8fafc';
    e.currentTarget.style.borderColor = '#f1f5f9';

    if (!articleId) return;

    try {
      await updateArticle(articleId, { categoryId: targetCategoryId });
      await fetchData();
    } catch (error) {
      showAlert('Error', 'Failed to move article');
    }
  };

  // About Handlers
  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingAbout && editingAbout._id) {
        await withMfa(() => updateAboutSection(editingAbout._id, newAboutData));
      } else {
        await withMfa(() => createAboutSection(newAboutData));
      }
      setNewAboutData({ title: '', content: '', sectionType: 'history', order: 0 });
      setEditingAbout(null);
      await fetchAboutData();
    } catch (error) {
      showAlert('Error', 'Failed to save about section');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAbout = async (id) => {
    showConfirm('Delete Section', 'Remove this about section?', async () => {
      try {
        await deleteAboutSection(id);
        await fetchAboutData();
      } catch (error) {
        showAlert('Error', 'Delete failed');
      }
    });
  };

  // Editorial Handlers
  const handleSaveMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingMember) {
        await withMfa(() => updateEditorialMember(editingMember._id, newMemberData));
      } else {
        await withMfa(() => createEditorialMember(newMemberData));
      }
      setNewMemberData({ name: '', role: '', email: '', department: '', location: '', memberType: 'core', order: 0 });
      setEditingMember(null);
      await fetchEditorialData();
    } catch (error) {
      showAlert('Error', 'Failed to save member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (id) => {
    showConfirm('Delete Member', 'Are you sure you want to remove this member from the editorial board?', async () => {
      try {
        await withMfa(() => deleteEditorialMember(id));
        await fetchEditorialData();
      } catch (error) {
        showAlert('Error', 'Delete failed');
      }
    });
  };

  // Gallery Handlers
  const handleUploadGalleryImage = async (e) => {
    e.preventDefault();
    if (!galleryData.image) return showAlert('Required', 'Please select an image file');
    setSubmitting(true);
    const formData = new FormData();
    formData.append('image', galleryData.image);
    formData.append('title', galleryData.title);
    formData.append('description', galleryData.description);
    formData.append('category', galleryData.category);
    formData.append('order', galleryData.order);
    try {
      await withMfa(() => uploadGalleryImage(formData));
      setGalleryData({ title: '', description: '', category: 'general', order: 0, image: null });
      await fetchGalleryData();
      showAlert('Success', 'Image uploaded and compressed!');
    } catch (error) {
      showAlert('Upload Failed', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateGalleryImage = async () => {
    if (!editingGallery) return;
    setSubmitting(true);
    try {
      await withMfa(() => updateGalleryImage(editingGallery._id, {
        title: galleryData.title,
        description: galleryData.description,
        category: galleryData.category,
        order: galleryData.order,
      }));
      setEditingGallery(null);
      setGalleryData({ title: '', description: '', category: 'general', order: 0, image: null });
      await fetchGalleryData();
    } catch (error) {
      showAlert('Error', 'Failed to update image info');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetupMfa = async () => {
    setSubmitting(true);
    try {
      const data = await getMfaSetup();
      setMfaQrCode(data.qrCode);
      setMfaSecret(data.secret);
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to generate MFA secret');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyMfaSetup = async () => {
    if (!mfaSetupToken) return;
    setSubmitting(true);
    try {
      await verifyMfaSetup(mfaSetupToken);
      showAlert('Success', 'MFA has been enabled. Sensitive actions (like deleting or uploading) will now require a verification code for maximum security.');
      setMfaQrCode(null);
      setMfaSetupToken('');
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Verification failed');
    } finally {
      setSubmitting(false);
    }
  };
  const handleDeleteGalleryImage = async (id) => {
    showConfirm('Delete Image', 'This will permanently remove the image from the gallery.', async () => {
      try {
        await deleteGalleryImage(id);
        await fetchGalleryData();
      } catch (error) {
        showAlert('Error', 'Delete failed');
      }
    });
  };

  const currentYearData = useMemo(() => 
    journalTree.find(y => y._id === activeYear?._id), 
  [journalTree, activeYear]);

  const currentIssueData = useMemo(() => 
    currentYearData?.issues.find(i => i._id === activeIssue?._id),
  [currentYearData, activeIssue]);

  const currentCategoryData = useMemo(() => 
    currentIssueData?.categories.find(c => c._id === activeCategory?._id),
  [currentIssueData, activeCategory]);

  const totalArticlesCount = useMemo(() => {
    return journalTree.reduce((acc, y) => acc + y.issues.reduce((iAcc, i) => iAcc + i.categories.reduce((cAcc, c) => cAcc + c.articles.length, 0), 0), 0);
  }, [journalTree]);

  const totalIssuesCount = useMemo(() => {
    return journalTree.reduce((acc, y) => acc + y.issues.length, 0);
  }, [journalTree]);

  const totalSectionsCount = useMemo(() => {
    return journalTree.reduce((acc, y) => acc + y.issues.reduce((iAcc, i) => iAcc + i.categories.length, 0), 0);
  }, [journalTree]);

  return (
    <>
      {!isAuthenticated ? (
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
      <div className="admin-container h-screen overflow-hidden">
        {/* SIDEBAR */}
        <div className="sidebar bg-white border-r border-slate-200 flex flex-col p-4 overflow-hidden">
          <div className="flex items-center gap-3 mb-8 px-1">
            <img 
              src="/logo/biospectra-logo.jpg" 
              alt="Biospectra Logo" 
              className="w-10 h-10 rounded-xl object-contain shadow-sm border border-slate-100 bg-white p-1" 
            />
            <div>
              <h1 className="m-0 text-base font-black text-[#133215] tracking-tight leading-tight uppercase" style={{ fontFamily: 'var(--font-playfair), serif' }}>Biospectra</h1>
              <span className="text-[0.6rem] font-bold text-[#92B775] uppercase tracking-[0.2em]">Admin Panel</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            {[
              { id: 'analytics', label: 'Dashboard', icon: BarChart3 },
              { id: 'publish', label: 'Upload New', icon: Upload },
              { id: 'explore', label: 'All Articles', icon: Database },
              { id: 'about', label: 'Journal Info', icon: Info },
              { id: 'editorial', label: 'Team Board', icon: Users },
              { id: 'gallery', label: 'Photos', icon: Image },
              { id: 'security', label: 'Security Center', icon: ShieldCheck },
              { id: 'audit', label: 'Security Log', icon: Shield },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-none cursor-pointer transition-all duration-300 text-[13px] ${
                  activeTab === item.id 
                    ? 'bg-[#133215] text-[#92B775] font-black shadow-xl shadow-[#133215]/20' 
                    : 'bg-transparent text-[#133215]/50 font-bold hover:bg-[#eef4ec] hover:text-[#133215]'
                }`}
              >
                <item.icon size={18} />
                <span className="sidebar-text">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-[#92B775]/10">
            <button 
              onClick={handleLogout}
              className="w-full p-3.5 bg-red-50 text-red-600 border-none rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer mb-6 transition-all hover:bg-red-100 active:scale-95"
            >
              Log Out
            </button>
            <div className="flex items-center gap-2.5 p-1">
              <div className="w-2 h-2 bg-[#92B775] rounded-full shadow-[0_0_10px_rgba(146,183,117,0.6)] animate-pulse" />
              <span className="text-[0.65rem] font-black text-[#133215]/30 uppercase tracking-[0.25em]">System Live</span>
            </div>
          </div>
        </div>

        {/* MOBILE NAV */}
        <div className="mobile-nav">
          {[
            { id: 'analytics', icon: BarChart3, label: 'Stats' },
            { id: 'publish', icon: Upload, label: 'Add' },
            { id: 'explore', icon: Database, label: 'Papers' },
            { id: 'about', icon: Info, label: 'Info' },
            { id: 'editorial', icon: Users, label: 'Team' },
            { id: 'gallery', icon: Image, label: 'Photos' },
            { id: 'security', icon: ShieldCheck, label: 'Guard' },
            { id: 'audit', icon: Shield, label: 'Sec' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab === item.id ? P.primary : '#94a3b8',
                padding: '0.4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer'
              }}
            >
              <item.icon size={18} />
              <span style={{ fontSize: '0.6rem', fontWeight: 800 }}>{item.label}</span>
            </button>
          ))}
        </div>


        {/* MAIN CONTENT */}
        <main className="main-content-wrapper flex-1 p-6 md:p-10 overflow-y-auto bg-[#eef4ec] custom-scrollbar">
          <header className="header-stack flex justify-between items-center mb-6">
            <div>
              <h2 className="m-0 text-3xl font-black text-[#133215] tracking-tight" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                {activeTab === 'analytics' ? 'Analytics Overview' : 
                 activeTab === 'publish' ? 'Publishing Center' :
                 activeTab === 'explore' ? 'Content Repository' :
                 activeTab === 'about' ? 'Journal Architect' : 
                 activeTab === 'security' ? 'Security Center' :
                 activeTab === 'audit' ? 'Security Audit' : 'Team Directory'}
              </h2>
              <p className="m-0 text-[#92B775] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Editorial Administrator</p>
            </div>
            
            <div className="flex gap-4 items-center mobile-hide">
              <div className="bg-white/80 backdrop-blur-md p-2.5 px-5 rounded-2xl border border-[#92B775]/10 flex gap-8 shadow-sm">
                 <div>
                   <p className="m-0 text-[0.6rem] text-[#133215]/40 font-black uppercase tracking-wider">Papers</p>
                   <p className="m-0 text-lg font-black text-[#133215]">{totalArticlesCount}</p>
                 </div>
                 <div className="w-px bg-[#92B775]/10" />
                 <div>
                   <p className="m-0 text-[0.6rem] text-[#133215]/40 font-black uppercase tracking-wider">Volumes</p>
                   <p className="m-0 text-lg font-black text-[#133215]">{journalTree.length}</p>
                 </div>
              </div>
              <button 
                onClick={fetchData}
                className="p-3.5 px-6 bg-[#133215] border-none rounded-xl text-[#92B775] font-black text-[10px] uppercase tracking-widest cursor-pointer flex items-center gap-2.5 shadow-lg shadow-[#133215]/10 transition-all hover:bg-[#133215]/90 active:scale-95"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Sync Data
              </button>
            </div>
          </header>
          

        <AnimatePresence mode="wait">
          {activeTab === 'analytics' ? (
            <AnalyticsTab 
              P={P} 
              journalTree={journalTree} 
              totalIssuesCount={totalIssuesCount}
              totalSectionsCount={totalSectionsCount}
              totalArticlesCount={totalArticlesCount}
            />
          ) : activeTab === 'publish' ? (
            <PublishTab 
              P={P}
              publishStep={publishStep}
              setPublishStep={setPublishStep}
              activeYear={activeYear}
              setActiveYear={setActiveYear}
              activeIssue={activeIssue}
              setActiveIssue={setActiveIssue}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              journalTree={journalTree}
              currentYearData={currentYearData}
              currentIssueData={currentIssueData}
              newYearInput={newYearInput}
              setNewYearInput={setNewYearInput}
              newCategoryInput={newCategoryInput}
              setNewCategoryInput={setNewCategoryInput}
              handleCreateYear={handleCreateYear}
              handleCreateCategory={handleCreateCategory}
              handleUploadArticle={handleUploadArticle}
              articleData={articleData}
              setArticleData={setArticleData}
              submitting={submitting}
              editingArticle={editingArticle}
              setEditingArticle={setEditingArticle}
              isElevated={isElevated}
            />
          ) : activeTab === 'about' ? (
            <AboutTab 
              P={P}
              aboutSections={aboutSections}
              editingAbout={editingAbout}
              setEditingAbout={setEditingAbout}
              newAboutData={newAboutData}
              setNewAboutData={setNewAboutData}
              handleSaveAbout={handleSaveAbout}
              handleDeleteAbout={handleDeleteAbout}
              submitting={submitting}
            />
          ) : activeTab === 'editorial' ? (
            <EditorialTab 
              P={P}
              editorialMembers={editorialMembers}
              editingMember={editingMember}
              setEditingMember={setEditingMember}
              newMemberData={newMemberData}
              setNewMemberData={setNewMemberData}
              handleSaveMember={handleSaveMember}
              handleDeleteMember={handleDeleteMember}
              memberSearch={memberSearch}
              setMemberSearch={setMemberSearch}
              submitting={submitting}
            />
          ) : activeTab === 'explore' ? (
            <ExploreTab 
              P={P}
              journalTree={journalTree}
              activeYear={activeYear}
              setActiveYear={setActiveYear}
              activeIssue={activeIssue}
              setActiveIssue={setActiveIssue}
              setActiveCategory={setActiveCategory}
              currentYearData={currentYearData}
              currentIssueData={currentIssueData}
              explorerSearch={explorerSearch}
              setExplorerSearch={setExplorerSearch}
              handleDeleteYear={handleDeleteYear}
              handleDeleteCategory={handleDeleteCategory}
              handleDeleteArticle={handleDeleteArticle}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              setEditingArticle={setEditingArticle}
              setArticleData={setArticleData}
              setActiveTab={setActiveTab}
              setPublishStep={setPublishStep}
            />
          ) : activeTab === 'gallery' ? (
            <GalleryTab 
              P={P}
              galleryImages={galleryImages}
              editingGallery={editingGallery}
              setEditingGallery={setEditingGallery}
              galleryData={galleryData}
              setGalleryData={setGalleryData}
              handleUploadGalleryImage={handleUploadGalleryImage}
              handleUpdateGalleryImage={handleUpdateGalleryImage}
              handleDeleteGalleryImage={handleDeleteGalleryImage}
              submitting={submitting}
            />
          ) : activeTab === 'security' ? (
            <SecurityTab 
              P={P}
              mfaQrCode={mfaQrCode}
              setMfaQrCode={setMfaQrCode}
              mfaSetupToken={mfaSetupToken}
              setMfaSetupToken={setMfaSetupToken}
              handleSetupMfa={handleSetupMfa}
              handleVerifyMfaSetup={handleVerifyMfaSetup}
              submitting={submitting}
            />
          ) : activeTab === 'audit' ? (
            <AuditTab P={P} />
          ) : null}

        </AnimatePresence>
          </main>
        </div>
      )}


      {/* Modal Overlay */}
      <AnimatePresence>
        {modal.isOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModal({ ...modal, isOpen: false })}
              style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ position: 'relative', width: '100%', maxWidth: '400px', background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #f1f5f9' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: modal.isAlert ? '#fef3c7' : '#fee2e2', padding: '0.5rem', borderRadius: '0.75rem' }}>
                  <AlertCircle size={20} color={modal.isAlert ? '#d97706' : '#ef4444'} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{modal.title}</h3>
              </div>
              <p style={{ margin: '0 0 2rem 0', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, fontWeight: 500 }}>{modal.message}</p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                {!modal.isAlert && (
                  <button 
                    onClick={() => setModal({ ...modal, isOpen: false })}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={async () => { 
                    if (modal.onConfirm) {
                      setIsDeleting(true);
                      try {
                        await modal.onConfirm();
                      } finally {
                        setIsDeleting(false);
                        setModal({ ...modal, isOpen: false }); 
                      }
                    } else {
                      setModal({ ...modal, isOpen: false }); 
                    }
                  }}
                  disabled={isDeleting}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '1rem', 
                    border: 'none', 
                    background: modal.isAlert ? '#0f172a' : '#ef4444', 
                    color: 'white', 
                    fontWeight: 800, 
                    cursor: isDeleting ? 'not-allowed' : 'pointer', 
                    fontSize: '0.8rem',
                    opacity: isDeleting ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    modal.isAlert ? 'Got it' : 'Confirm Action'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <MfaModal 
        isOpen={mfaModal.isOpen} 
        onClose={() => setMfaModal({ ...mfaModal, isOpen: false })}
        onSuccess={mfaModal.onResolve}
      />
    </>
  );
}

export default App;
