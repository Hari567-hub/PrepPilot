import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { ShieldCheck, Users, Database, FileText, Plus, RefreshCw, FileDown } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { addNotification } = useAppStore();

  const [qTitle, setQTitle] = useState('');
  const [qTopic, setQTopic] = useState('Arrays');
  const [qDifficulty, setQDifficulty] = useState('Easy');
  const [qDesc, setQDesc] = useState('');

  const stats = [
    { label: 'Registered Candidates', value: '1,542', icon: Users, color: 'var(--accent-blue)' },
    { label: 'Questions Library', value: '342 items', icon: Database, color: 'var(--accent-purple)' },
    { label: 'ATS Reports Compiled', value: '481 pages', icon: FileText, color: 'var(--accent-green)' }
  ];

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (qTitle && qDesc) {
      addNotification(`Question "${qTitle}" successfully added to public pool!`, 'success');
      setQTitle('');
      setQDesc('');
    }
  };

  const handleSystemReset = () => {
    if (confirm('Are you sure you want to clear system caching logs?')) {
      localStorage.clear();
      addNotification('System state storage flushed. Reloading page...', 'info');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage candidate accounts database, monitor platform load logs, and add questions.</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '6px 12px',
          borderRadius: '8px',
          color: 'var(--accent-green)',
          fontSize: '0.85rem',
          fontWeight: 'bold'
        }}>
          <ShieldCheck size={16} />
          <span>System Root Access</span>
        </div>
      </div>

      {/* Admin stats */}
      <div className="grid-responsive" style={{ gap: '20px' }}>
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <GlassCard key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.02)',
                color: s.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--glass-border)'
              }}>
                <Icon size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.label}</span>
                <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{s.value}</h2>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Main Grid: Control Actions vs Add Question Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        
        {/* Add Question Form */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Inject Public Algorithmic Question</h3>
          
          <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="input-group">
              <label className="input-label">Question Title</label>
              <input type="text" className="glass-input" value={qTitle} onChange={(e) => setQTitle(e.target.value)} placeholder="e.g. Reverse Linked List" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="input-group">
                <label className="input-label">Topic Group</label>
                <select className="glass-select" value={qTopic} onChange={(e) => setQTopic(e.target.value)}>
                  <option value="Arrays">Arrays</option>
                  <option value="Strings">Strings</option>
                  <option value="Linked Lists">Linked Lists</option>
                  <option value="Trees">Trees</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Difficulty Tier</label>
                <select className="glass-select" value={qDifficulty} onChange={(e) => setQDifficulty(e.target.value)}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Problem Specifications</label>
              <textarea className="glass-textarea" rows={4} value={qDesc} onChange={(e) => setQDesc(e.target.value)} placeholder="Describe the constraints and input/output formats..." required style={{ resize: 'none' }} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', gap: '6px', width: 'fit-content' }}>
              <Plus size={16} /> Add Question
            </button>
          </form>
        </GlassCard>

        {/* System Operations controls */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.15rem' }}>System Operations</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={handleSystemReset} 
              className="btn btn-danger" 
              style={{ width: '100%', padding: '14px', gap: '8px', justifyContent: 'flex-start' }}
            >
              <RefreshCw size={16} />
              <span>Reset State & Storage</span>
            </button>

            <button 
              onClick={() => addNotification('Database backup generated (mocked).', 'success')} 
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '14px', gap: '8px', justifyContent: 'flex-start' }}
            >
              <FileDown size={16} />
              <span>Export DB Backup (SQL)</span>
            </button>
          </div>

          <hr style={{ borderColor: 'var(--glass-border)' }} />

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Server Status Logs</h4>
            <div style={{
              background: '#04020a',
              padding: '12px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div>[SYSTEM] API routes mounted successfully.</div>
              <div>[DATABASE] PostgreSQL connection pool initialized: 20 active connections.</div>
              <div>[STORAGE] Supabase Storage client mounted.</div>
            </div>
          </div>
        </GlassCard>

      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1.5fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default AdminDashboard;
