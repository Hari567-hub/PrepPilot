import React from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { 
  Flame, Award, CheckCircle, AlertCircle, ArrowRight,
  TrendingUp, Calendar, Target, BrainCircuit
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, streak, attempts, dailyChallengeStatus, setCurrentPage } = useAppStore();
  const attemptsCount = attempts.length;

  // Calculate success probability based on scores in attempts
  const averageScore = attempts.length > 0 
    ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length)
    : 0;

  const successProbability = attempts.length > 0
    ? Math.min(99, Math.round(50 + (averageScore - 50) * 0.8 + (streak * 2)))
    : 45; // baseline

  const challenges = [
    { type: 'coding', title: 'Two Sum Problem', category: 'Coding Challenge', completed: dailyChallengeStatus.coding, route: 'coding' },
    { type: 'hr', title: 'Why do you want to join our team?', category: 'HR Challenge', completed: dailyChallengeStatus.hr, route: 'hr' },
    { type: 'aptitude', title: 'Solve the train speed equation', category: 'Aptitude Challenge', completed: dailyChallengeStatus.aptitude, route: 'aptitude' },
    { type: 'systemDesign', title: 'URL Shortener Architecture', category: 'System Design Challenge', completed: dailyChallengeStatus.systemDesign, route: 'system-design' }
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      
      {/* Welcome Banner */}
      <div style={{
        background: 'var(--primary-gradient)',
        borderRadius: '16px',
        padding: '30px',
        color: '#fff',
        boxShadow: 'var(--glass-glow)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#fff' }}>Welcome back, {user?.name}!</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '1rem' }}>
            You're currently preparing for a <strong>{user?.targetRole}</strong> role at <strong>{user?.targetCompany}</strong>. Let's practice today.
          </p>
        </div>
        <button 
          onClick={() => setCurrentPage('mock-interview')}
          className="btn" 
          style={{
            background: '#fff',
            color: 'var(--accent-purple)',
            fontWeight: 700,
            padding: '12px 24px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}
        >
          Start Mock Interview
        </button>
      </div>

      {/* Stats row */}
      <div className="grid-responsive" style={{ gap: '20px' }}>
        <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.1)',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame size={24} fill="#fbbf24" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daily Streak</span>
            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{streak} Days</h2>
          </div>
        </GlassCard>

        <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: 'rgba(139, 92, 246, 0.1)',
            color: 'var(--accent-purple)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Interviews Done</span>
            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{attemptsCount} Attempts</h2>
          </div>
        </GlassCard>

        <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--accent-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Score</span>
            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{averageScore}%</h2>
          </div>
        </GlassCard>

        <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.1)',
            color: 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Target size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Offer Probability</span>
            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{successProbability}%</h2>
          </div>
        </GlassCard>
      </div>

      {/* Main Grid: Challenges vs Timeline */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px'
      }}>
        
        {/* Daily Challenges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Daily Challenge Checklist</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Resetting in 12h</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {challenges.map((ch, idx) => (
              <GlassCard key={idx} style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: ch.completed ? '4px solid var(--accent-green)' : '4px solid var(--glass-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {ch.completed ? (
                    <CheckCircle size={20} color="var(--accent-green)" />
                  ) : (
                    <AlertCircle size={20} color="var(--text-muted)" />
                  )}
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{ch.category}</span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '2px' }}>{ch.title}</h4>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentPage(ch.route)}
                  className={`btn ${ch.completed ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  {ch.completed ? 'Review' : 'Solve'} <ArrowRight size={14} />
                </button>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Reminders / Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Preparation Timeline</h3>
          
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Calendar size={18} color="var(--accent-purple)" />
              <div>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Google Technical Review</h5>
                <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-muted)' }}>Scheduled in 3 days</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <BrainCircuit size={18} color="var(--accent-blue)" />
              <div>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600 }}>System Design Focus</h5>
                <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-muted)' }}>Work on caching & databases</p>
              </div>
            </div>

            <hr style={{ borderColor: 'var(--glass-border)' }} />

            <div>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Action Items</h5>
              <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Complete 2 Arrays questions to build basic skills</li>
                <li>Write a draft in Notes for System Design Checklist</li>
                <li>Upload new CV to Resume Analyzer</li>
              </ul>
            </div>
          </GlassCard>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
};
export default Dashboard;
