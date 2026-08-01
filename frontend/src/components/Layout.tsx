import React, { useState, useEffect } from 'react';
import useAppStore from '../store/appStore';
import Navbar from './Navbar';
import { 
  LayoutDashboard, Mic, FileText, FileSpreadsheet, Code, BookOpen, 
  UserCheck, Timer, Box, Map, Building2, Brain, BarChart3, 
  MessageSquare, Notebook, Menu, X, Search, ShieldAlert, Award
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentPage, setCurrentPage, notifications, clearNotification } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'mock-interview', name: 'AI Mock Interview', icon: Mic },
    { id: 'resume-analyzer', name: 'Resume Analyzer', icon: FileSpreadsheet },
    { id: 'resume-builder', name: 'Resume Builder', icon: FileText },
    { id: 'coding', name: 'Coding Interview', icon: Code },
    { id: 'dsa', name: 'DSA Practice', icon: BookOpen },
    { id: 'hr', name: 'HR Interview', icon: UserCheck },
    { id: 'aptitude', name: 'Aptitude Practice', icon: Timer },
    { id: 'system-design', name: 'System Design', icon: Box },
    { id: 'roadmaps', name: 'Learning Roadmap', icon: Map },
    { id: 'company-prep', name: 'Company Preparation', icon: Building2 },
    { id: 'flashcards', name: 'Flashcards', icon: Brain },
    { id: 'notes', name: 'Notes Workspace', icon: Notebook },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'mentor', name: 'AI Career Mentor', icon: MessageSquare },
    { id: 'admin', name: 'Admin Dashboard', icon: ShieldAlert },
  ];

  // Hotkey listener for Ctrl+K search and Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      
      <aside className="sidebar desktop-only" style={{
        width: '260px',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>IP</div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }} className="gradient-text">PrepAI</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interview Excellence</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav aria-label="Main Navigation Menu" style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button 
                    onClick={() => setCurrentPage(item.id)}
                    aria-label={`Go to ${item.name}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isActive ? 'var(--primary-gradient)' : 'transparent',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 500,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Pro Badge */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Award size={20} color="var(--accent-purple)" />
            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Elite Access</h5>
              <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-muted)' }}>Pro Features Unlocked</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header / Navbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
        zIndex: 50
      }} className="mobile-only">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            <Menu size={24} />
          </button>
          <span style={{ fontSize: '1.1rem', fontWeight: 700 }} className="gradient-text">PrepAI</span>
        </div>
        <button 
          onClick={() => setSearchOpen(true)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          <Search size={20} />
        </button>
      </div>

      {/* Mobile Slide-out Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 150
        }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{
            width: '280px',
            height: '100%',
            background: 'var(--bg-secondary)',
            borderRight: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Menu</h3>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <nav style={{ flex: 1, overflowY: 'auto' }}>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <li key={item.id}>
                      <button 
                        onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          background: isActive ? 'var(--primary-gradient)' : 'transparent',
                          color: isActive ? '#fff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontFamily: 'inherit'
                        }}
                      >
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main Wrapper */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Desktop navbar integration */}
        <div className="desktop-only">
          <Navbar onSearchOpen={() => setSearchOpen(true)} />
        </div>

        {/* Main Content Area */}
        <main className="main-content" style={{ flex: 1 }}>
          {children}
        </main>
      </div>

      {/* Toast Notification Toaster */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 200
      }}>
        {notifications.map((n) => (
          <div 
            key={n.id}
            onClick={() => clearNotification(n.id)}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              background: 'rgba(15, 14, 33, 0.85)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${
                n.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 
                n.type === 'warning' ? 'rgba(245, 158, 11, 0.4)' : 
                'rgba(59, 130, 246, 0.4)'
              }`,
              color: '#fff',
              fontSize: '0.875rem',
              boxShadow: 'var(--card-shadow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '15px',
              cursor: 'pointer',
              animation: 'fadeIn 0.25s ease-out',
              minWidth: '260px'
            }}
          >
            <span>{n.message}</span>
            <X size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
        ))}
      </div>

      {/* Search Keyboard Shortcut Modal (Ctrl+K Modal) */}
      {searchOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '100px',
          zIndex: 300
        }} onClick={() => setSearchOpen(false)}>
          <div style={{
            width: '90%',
            maxWidth: '540px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            boxShadow: 'var(--card-shadow)',
            overflow: 'hidden',
            height: 'fit-content'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Search Input Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid var(--glass-border)'
            }}>
              <Search size={20} style={{ color: 'var(--text-muted)', marginRight: '12px' }} />
              <input 
                type="text" 
                placeholder="Type to search modules..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1.1rem',
                  outline: 'none',
                  flex: 1,
                  fontFamily: 'inherit'
                }}
              />
              <button 
                onClick={() => setSearchOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '6px',
                  color: 'var(--text-muted)',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >ESC</button>
            </div>

            {/* Results list */}
            <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px' }}>
              {filteredMenuItems.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No modules found matching your query
                </div>
              ) : (
                filteredMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        transition: 'background 0.2s ease',
                        fontFamily: 'inherit'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-purple)'
                      }}>
                        <Icon size={16} />
                      </div>
                      <span>{item.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hide desktop elements on mobile using standard CSS */}
      <style>{`
        @media (min-width: 1025px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 1024px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </div>
  );
};
export default Layout;
