import React from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { attempts } = useAppStore();

  // Process data for LineChart: Attempts score history order chronological
  const chronData = [...attempts].reverse().map((att, idx) => ({
    name: `Attempt ${idx + 1}`,
    score: att.score,
    type: att.type
  }));

  // Process data for BarChart: Average score by category type
  const categories = ['Mock', 'HR', 'Coding', 'System Design', 'Behavioral'] as const;
  const barData = categories.map(cat => {
    const matched = attempts.filter(att => att.type === cat);
    const avg = matched.length > 0
      ? Math.round(matched.reduce((acc, curr) => acc + curr.score, 0) / matched.length)
      : 0;
    return { name: cat, average: avg };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Analytics & Progress Insights</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track scoring history, average domain success ratings, and preparation consistency graphs.</p>
      </div>

      {attempts.length === 0 ? (
        <GlassCard style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          <BarChart3 size={48} style={{ color: 'var(--text-muted)' }} />
          <h3>No practice data logged yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Complete coding compilation sessions or AI mock interviews to seed analytics.</p>
        </GlassCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            
            {/* Score History LineChart */}
            <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Score Performance Trend</h3>
              <div style={{ width: '100%', height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chronData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" style={{ fontSize: '0.75rem' }} />
                    <YAxis stroke="var(--text-muted)" style={{ fontSize: '0.75rem' }} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', color: '#fff' }} 
                      labelStyle={{ color: 'var(--text-muted)' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="var(--accent-purple)" strokeWidth={3} dot={{ fill: 'var(--accent-blue)', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Score by Category BarChart */}
            <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Performance by Interview Stage</h3>
              <div style={{ width: '100%', height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" style={{ fontSize: '0.75rem' }} />
                    <YAxis stroke="var(--text-muted)" style={{ fontSize: '0.75rem' }} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', color: '#fff' }}
                    />
                    <Bar dataKey="average" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

          </div>

          {/* Breakdown lists: Strengths vs Weaknesses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-green)' }}>Strengths Identified</h4>
              <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Optimal Time Complexity logic (HashMap conversions).</li>
                <li>Clear verbal pacing during AI mock recordings.</li>
                <li>Strong familiarity with Googleyness leadership values.</li>
              </ul>
            </GlassCard>

            <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-yellow)' }}>Areas for Improvement</h4>
              <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Detailing database consistencies in System Design scenarios.</li>
                <li>Quantifying metrics (Result stage) in STAR method replies.</li>
                <li>Quantitative speed calculations in Aptitude timers.</li>
              </ul>
            </GlassCard>

          </div>

          {/* History log rows list */}
          <GlassCard style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
              <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Chronological History logs</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {attempts.map((att) => (
                <div 
                  key={att.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--glass-border)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{att.type} Round - {att.company}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date: {att.date} | Target Role: {att.role}</span>
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: att.score > 70 ? 'var(--accent-green)' : 'var(--accent-yellow)'
                  }}>{att.score}%</div>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1.2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Analytics;
