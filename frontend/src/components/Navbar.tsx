import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import { Search, Flame, Bell, User, Settings, LogOut, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onSearchOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchOpen }) => {
  const { user, streak, logout, setCurrentPage } = useAppStore();
  const [profileOpen, setProfileOpen] = useState(false);
  
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.body.classList.add('light-theme');
      return 'light';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      background: 'rgba(10, 9, 23, 0.45)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--glass-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Search Trigger */}
      <button 
        onClick={onSearchOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '8px 16px',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          width: '240px',
          textAlign: 'left'
        }}
      >
        <Search size={16} />
        <span style={{ fontSize: '0.85rem', flex: 1 }}>Search everything...</span>
        <kbd style={{
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>Ctrl+K</kbd>
      </button>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Streak Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '20px',
          padding: '6px 12px',
          color: '#fbbf24',
          fontSize: '0.875rem',
          fontWeight: '700'
        }}>
          <Flame size={16} fill="#fbbf24" />
          <span>{streak} Day Streak</span>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px'
          }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications Trigger */}
        <button style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--accent-purple)'
          }} />
        </button>

        {/* User Profile dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            <img 
              src={user?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg'} 
              alt="avatar" 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-secondary)'
              }}
            />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }} className="desktop-only">{user?.name}</span>
          </button>

          {profileOpen && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              width: '200px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '8px',
              boxShadow: 'var(--card-shadow)',
              zIndex: 100
            }}>
              <button 
                onClick={() => { setCurrentPage('profile'); setProfileOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit'
                }}
              >
                <User size={16} />
                <span>My Profile</span>
              </button>
              <button 
                onClick={() => { setCurrentPage('settings'); setProfileOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit'
                }}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '6px 0' }} />
              <button 
                onClick={() => { logout(); setProfileOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  color: 'var(--accent-red)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit'
                }}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
