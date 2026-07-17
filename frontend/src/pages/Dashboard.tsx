import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { 
  Flame, Award, TrendingUp, Target, ChevronRight, Plus, Trash
} from 'lucide-react';

interface PipelineItem {
  id: string;
  company: string;
  role: string;
  status: 'applied' | 'oa' | 'technical' | 'manager' | 'offer';
}

export const Dashboard: React.FC = () => {
  const { user, streak, attempts, notes, flashcards, setCurrentPage } = useAppStore();
  const attemptsCount = attempts.length;

  // 1. Kanban Recruitment Pipeline (Persisted in LocalStorage, completely user-managed)
  const [pipeline, setPipeline] = useState<PipelineItem[]>(() => {
    const saved = localStorage.getItem('preppilot-pipeline');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'p1', company: 'Google', role: 'Software Engineer', status: 'technical' },
      { id: 'p2', company: 'Amazon', role: 'Systems Developer', status: 'oa' },
      { id: 'p3', company: 'Microsoft', role: 'ML Architect', status: 'applied' }
    ];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');

  const movePipelineStage = (id: string, nextStatus: PipelineItem['status']) => {
    const updated = pipeline.map(item => item.id === id ? { ...item, status: nextStatus } : item);
    setPipeline(updated);
    localStorage.setItem('preppilot-pipeline', JSON.stringify(updated));
  };

  const addApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole) return;
    const newItem: PipelineItem = {
      id: 'p-' + Date.now(),
      company: newCompany,
      role: newRole,
      status: 'applied'
    };
    const updated = [...pipeline, newItem];
    setPipeline(updated);
    localStorage.setItem('preppilot-pipeline', JSON.stringify(updated));
    setNewCompany('');
    setNewRole('');
    setShowAddForm(false);
  };

  const removeApplication = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering status cycle on click
    const updated = pipeline.filter(item => item.id !== id);
    setPipeline(updated);
    localStorage.setItem('preppilot-pipeline', JSON.stringify(updated));
  };

  // 2. Heatmap: Map 84 days (12 weeks) dynamically to actual user attempts
  const heatmapData = Array.from({ length: 84 }, (_, idx) => {
    const dateObj = new Date();
    // 0 is 83 days ago, 83 is today
    dateObj.setDate(dateObj.getDate() - (83 - idx));
    const dateStr = dateObj.toISOString().split('T')[0];
    const dayAttempts = attempts.filter(att => att.date && att.date.startsWith(dateStr));
    return Math.min(3, dayAttempts.length);
  });

  const averageScore = attempts.length > 0 
    ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length)
    : 0;

  const successProbability = attempts.length > 0
    ? Math.min(99, Math.round(50 + (averageScore - 50) * 0.8 + (streak * 2)))
    : 0;

  // 3. Module Tracker values calculated dynamically from Zustand state (no dummy counts!)
  const codingCount = attempts.filter(a => a.type === 'Coding').length;
  const starCount = attempts.filter(a => a.type === 'HR' || a.type === 'Behavioral').length;
  const designCount = attempts.filter(a => a.type === 'System Design').length;
  const cardsCount = flashcards.length;

  const progressModules = [
    { name: 'AI Coding Sandbox', value: `${codingCount} solved`, progress: Math.min(100, codingCount * 10), color: 'var(--accent-blue)', route: 'coding' },
    { name: 'STAR Behavioral Evaluator', value: `${starCount} graded`, progress: Math.min(100, starCount * 20), color: 'var(--accent-purple)', route: 'hr' },
    { name: 'System Design Canvas', value: `${designCount} reviewed`, progress: Math.min(100, designCount * 25), color: 'var(--accent-green)', route: 'system-design' },
    { name: 'Flashcard Workspace', value: `${cardsCount} deck size`, progress: Math.min(100, cardsCount * 5), color: 'var(--accent-yellow)', route: 'flashcards' }
  ];

  // 4. Diagnostics Feed populated dynamically from user's actual attempts
  const recentLogs = attempts.length > 0 
    ? attempts.slice(-3).reverse().map(att => ({
        text: `>> [${att.type.toUpperCase()}] Cleared ${att.company} (${att.role}) evaluation: scored ${att.score}%`,
        time: att.date.split('T')[0]
      }))
    : [
        { text: '>> [SYSTEM] Welcome to PrepPilot. Launch a mock assessment or coding practice to seed your activity logs.', time: 'System Ready' }
      ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>PrepPilot Hub</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Candidate Profile: <strong style={{ color: '#fff' }}>{user?.name}</strong> &nbsp;|&nbsp; Target: <strong>{user?.targetRole} at {user?.targetCompany}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setCurrentPage('mock-interview')}
            className="btn btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.85rem' }}
          >
            Launch Interview Simulator
          </button>
        </div>
      </div>

      {/* Grid: Core Stats */}
      <div className="grid-responsive" style={{ gap: '20px' }}>
        {/* Streak */}
        <div style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Streak</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={20} fill={streak > 0 ? '#fbbf24' : 'var(--text-muted)'} color={streak > 0 ? '#fbbf24' : 'var(--text-muted)'} /> {streak} Days
            </h2>
          </div>
          <span className={`badge ${streak > 0 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
            {streak > 0 ? 'Active' : 'No Streak'}
          </span>
        </div>

        {/* Success Score */}
        <div style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Averaged Evaluation</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={20} color="var(--accent-purple)" /> {averageScore}%
            </h2>
          </div>
          <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{attemptsCount} logs</span>
        </div>

        {/* Readiness Probability */}
        <div style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Offer Probability</span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={20} color="var(--accent-blue)" /> {successProbability}%
            </h2>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
            <TrendingUp size={16} color="var(--accent-blue)" />
          </div>
        </div>
      </div>

      {/* Grid: Commitment Grid Heatmap & Preparation Tracker */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        
        {/* Left Side: Activity Grid Heatmap */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Commitment & Practice History</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Grid fills automatically when you compile code or clear interviews.</p>
          </div>

          <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '8px' }}>
            {heatmapData.map((val, idx) => (
              <div 
                key={idx}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: 
                    val === 3 ? 'var(--accent-blue)' :
                    val === 2 ? 'rgba(37, 99, 235, 0.6)' :
                    val === 1 ? 'rgba(37, 99, 235, 0.25)' :
                    'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.01)',
                  transition: 'background 0.2s ease'
                }}
                title={`${val} attempts on this day`}
              />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Workspace contains {notes.length} saved roadmap notes</span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span>Less</span>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(255,255,255,0.03)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(37, 99, 235, 0.25)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(37, 99, 235, 0.6)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent-blue)' }} />
              <span>More</span>
            </div>
          </div>
        </GlassCard>

        {/* Right Side: Active Module progress */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Module Target Tracker</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {progressModules.map((mod, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{mod.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{mod.value}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.max(8, mod.progress)}%`, height: '100%', background: mod.color, borderRadius: '99px' }} />
                  </div>
                  <button 
                    onClick={() => setCurrentPage(mod.route)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* Kanban Recruitment Pipeline Grid */}
      <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recruitment Application Pipeline</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Move applications along stages by clicking them. Delete items using the trash icon.</p>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }}
            onClick={() => setShowAddForm(prev => !prev)}
          >
            <Plus size={14} /> Add Application
          </button>
        </div>

        {/* Add Application Form Overlay */}
        {showAddForm && (
          <form onSubmit={addApplication} style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border)',
            padding: '16px',
            borderRadius: '8px',
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            marginBottom: '10px'
          }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Company Name</label>
              <input 
                type="text" 
                className="glass-input" 
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                placeholder="Google, Meta, etc."
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                required
              />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Target Role</label>
              <input 
                type="text" 
                className="glass-input" 
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                placeholder="Software Engineer"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Save</button>
              <button type="button" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* Pipeline columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '15px'
        }}>
          {(['applied', 'oa', 'technical', 'manager', 'offer'] as const).map(stage => {
            const stageLabels: Record<string, string> = {
              applied: '1. Applied',
              oa: '2. Online Assess',
              technical: '3. Technical Interview',
              manager: '4. Hiring Manager',
              offer: '5. Offer Secured 🎉'
            };
            const stageColor: Record<string, string> = {
              applied: 'rgba(99, 102, 241, 0.03)',
              oa: 'rgba(245, 158, 11, 0.03)',
              technical: 'rgba(59, 130, 246, 0.03)',
              manager: 'rgba(139, 92, 246, 0.03)',
              offer: 'rgba(16, 185, 129, 0.05)'
            };
            const borderColors: Record<string, string> = {
              applied: 'var(--glass-border)',
              oa: 'rgba(245, 158, 11, 0.2)',
              technical: 'rgba(59, 130, 246, 0.2)',
              manager: 'rgba(139, 92, 246, 0.2)',
              offer: 'rgba(16, 185, 129, 0.3)'
            };

            const items = pipeline.filter(item => item.status === stage);

            return (
              <div 
                key={stage}
                style={{
                  background: stageColor[stage],
                  border: `1px solid ${borderColors[stage]}`,
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  minHeight: '140px'
                }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid var(--glass-border)',
                  paddingBottom: '6px'
                }}>{stageLabels[stage]}</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        const stages = ['applied', 'oa', 'technical', 'manager', 'offer'] as const;
                        const currIdx = stages.indexOf(item.status);
                        const nextStatus = stages[(currIdx + 1) % stages.length];
                        movePipelineStage(item.id, nextStatus);
                      }}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '6px',
                        padding: '10px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        boxShadow: 'var(--card-shadow)',
                        position: 'relative',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        const trashBtn = e.currentTarget.querySelector('.trash-btn') as HTMLElement;
                        if (trashBtn) trashBtn.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                        const trashBtn = e.currentTarget.querySelector('.trash-btn') as HTMLElement;
                        if (trashBtn) trashBtn.style.opacity = '0';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 700, color: '#fff', paddingRight: '20px' }}>{item.company}</div>
                        <button 
                          className="trash-btn"
                          onClick={(e) => removeApplication(item.id, e)}
                          style={{
                            position: 'absolute',
                            right: '6px',
                            top: '6px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-red)',
                            cursor: 'pointer',
                            opacity: 0,
                            padding: '2px',
                            transition: 'opacity 0.2s ease'
                          }}
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Diagnostics Logs list */}
      <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>PrepPilot System Event Logs</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
          {recentLogs.map((log, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '10px' }}>
              <span>{log.text}</span>
              <span style={{ color: 'var(--text-muted)' }}>{log.time}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1.6fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="gridTemplateColumns: repeat(5, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Dashboard;
