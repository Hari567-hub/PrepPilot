import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { 
  Flame, Award, TrendingUp, Target, ChevronRight
} from 'lucide-react';

interface PipelineItem {
  id: string;
  company: string;
  role: string;
  status: 'applied' | 'oa' | 'technical' | 'manager' | 'offer';
}

export const Dashboard: React.FC = () => {
  const { user, streak, attempts, setCurrentPage } = useAppStore();
  const attemptsCount = attempts.length;

  // 1. Kanban Recruitment Pipeline local state (adds huge custom SaaS value)
  const [pipeline, setPipeline] = useState<PipelineItem[]>([
    { id: 'p1', company: 'Google', role: 'Software Engineer', status: 'technical' },
    { id: 'p2', company: 'Amazon', role: 'Systems Developer', status: 'oa' },
    { id: 'p3', company: 'Microsoft', role: 'ML Architect', status: 'applied' },
    { id: 'p4', company: 'Stripe', role: 'Frontend Engineer', status: 'offer' }
  ]);

  const movePipelineStage = (id: string, nextStatus: PipelineItem['status']) => {
    setPipeline(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item));
  };

  // 2. Heatmap mock grid details (12 weeks x 7 days)
  const weeks = 12;
  const daysOfWeek = 7;
  const totalCells = weeks * daysOfWeek;
  const heatmapData = Array.from({ length: totalCells }, (_, idx) => {
    // Shading intensity simulator
    const isToday = idx === totalCells - 3;
    const isYesterday = idx === totalCells - 4;
    const isStreakDay = idx >= totalCells - 3 - streak && idx <= totalCells - 3;
    let intensity = 0;
    if (isToday || isYesterday) intensity = 3;
    else if (isStreakDay) intensity = 2;
    else if (idx % 11 === 0 || idx % 7 === 0) intensity = 1;
    return intensity;
  });

  const averageScore = attempts.length > 0 
    ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length)
    : 0;

  const successProbability = attempts.length > 0
    ? Math.min(99, Math.round(50 + (averageScore - 50) * 0.8 + (streak * 2)))
    : 45;

  const progressModules = [
    { name: 'AI Coding Sandbox', value: '4 / 12 solved', progress: 33, color: 'var(--accent-blue)', route: 'coding' },
    { name: 'STAR Behavioral Evaluator', value: '3 answers graded', progress: 60, color: 'var(--accent-purple)', route: 'hr' },
    { name: 'System Design Canvas', value: '2 scenarios cleared', progress: 40, color: 'var(--accent-green)', route: 'system-design' },
    { name: 'Aptitude Quizzes', value: '790 rank score', progress: 75, color: 'var(--accent-yellow)', route: 'aptitude' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      
      {/* Sleek Minimalist Header */}
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
              <Flame size={20} fill="#fbbf24" color="#fbbf24" /> {streak} Days
            </h2>
          </div>
          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>On Track</span>
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
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Track daily coding and evaluation commitments across modules.</p>
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
                title={`Level ${val} practice activity`}
              />
            ))}
          </div>

          {/* Heatmap Legend */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Less</span>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(255,255,255,0.03)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(37, 99, 235, 0.25)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(37, 99, 235, 0.6)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent-blue)' }} />
            <span>More</span>
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
                    <div style={{ width: `${mod.progress}%`, height: '100%', background: mod.color, borderRadius: '99px' }} />
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
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recruitment Application Pipeline</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Monitor recruitment milestones. Move companies along stages by clicking them.</p>
        </div>

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
                        // Cycles status forward on click
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
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                    >
                      <div style={{ fontWeight: 700, color: '#fff' }}>{item.company}</div>
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
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Diagnostics Activity Feed</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>&gt;&gt; [HEALTH] Active database synchronized. Connected to supabase pool.</span>
            <span style={{ color: 'var(--text-muted)' }}>Just now</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>&gt;&gt; [EVALUATION] Two Sum optimal code solution verified: O(N) complexity logs.</span>
            <span style={{ color: 'var(--text-muted)' }}>2 hours ago</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>&gt;&gt; [ATS] Resume mismatch report downloaded: ats_report_john_doe_cv.txt.</span>
            <span style={{ color: 'var(--text-muted)' }}>1 day ago</span>
          </div>
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
