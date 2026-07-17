import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { Compass, RefreshCw, Check } from 'lucide-react';

interface Stage {
  title: string;
  timeframe: string;
  subtopics: string[];
  tips: string;
}

export const LearningRoadmap: React.FC = () => {
  const { user, addNotification } = useAppStore();

  const [skills, setSkills] = useState(user?.skills.join(', ') || 'React, JS');
  const [dreamCompany, setDreamCompany] = useState(user?.targetCompany || 'Google');
  const [timeframe, setTimeframe] = useState('3 months');
  const [experience, setExperience] = useState(user?.experience || 'Fresher');

  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Stage[] | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

  const generateRoadmap = async () => {
    setIsLoading(true);
    setRoadmap(null);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate personalized stage generation based on selections
    const generated: Stage[] = [
      {
        title: 'DS & Algorithms Foundations',
        timeframe: 'Weeks 1-3',
        subtopics: ['Arrays & Hash Maps hash values lookup', 'Two Pointer sliding window arrays search', 'Big O complexity estimations'],
        tips: `For ${dreamCompany}, ensure optimal lookup mapping instead of dual-loop arrays check.`
      },
      {
        title: 'Core System Architectures & Storage',
        timeframe: 'Weeks 4-6',
        subtopics: ['Redis Cache LRU strategies', 'Database partitioning vs replication models', 'API REST endpoints structure design'],
        tips: `Since you target a ${experience} level, design system scaling rules using consistent hashing.`
      },
      {
        title: 'STAR Behavioral Scenarios',
        timeframe: 'Weeks 7-8',
        subtopics: ['Conflict management anecdotes drafting', 'Measurable scale metrics collection', '16 Leadership principles mapping'],
        tips: 'Format stories strictly in Situation, Task, Action, and quantified Result percentages.'
      }
    ];

    setRoadmap(generated);
    setCompletedTopics({});
    setIsLoading(false);
    addNotification('Personalized preparation roadmap generated!', 'success');
  };

  const toggleTopic = (topic: string) => {
    setCompletedTopics(prev => {
      const next = { ...prev, [topic]: !prev[topic] };
      if (next[topic]) {
        addNotification(`Completed: "${topic}"!`, 'success');
      }
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>AI Learning Roadmap</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Personalize your preparation timeline mapped to your target company and active technical skills.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Setup parameters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Roadmap Setup</h3>

            <div className="input-group">
              <label className="input-label">Current Key Skills</label>
              <input 
                type="text" 
                className="glass-input" 
                value={skills} 
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, JS, Python..."
              />
            </div>

            <div className="input-group">
              <label className="input-label">Target Dream Company</label>
              <select className="glass-select" value={dreamCompany} onChange={(e) => setDreamCompany(e.target.value)}>
                <option value="Google">Google</option>
                <option value="Amazon">Amazon</option>
                <option value="Microsoft">Microsoft</option>
                <option value="TCS">TCS</option>
                <option value="Infosys">Infosys</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Preparation Timeframe</label>
              <select className="glass-select" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                <option value="1 month">1 Month (Fast Track)</option>
                <option value="3 months">3 Months (Standard)</option>
                <option value="6 months">6 Months (Comprehensive)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Experience Tier</label>
              <select className="glass-select" value={experience} onChange={(e) => setExperience(e.target.value as 'Fresher' | 'Experienced')}>
                <option value="Fresher">Fresher (L3/L4)</option>
                <option value="Experienced">Experienced (L5/L6)</option>
              </select>
            </div>

            <button 
              onClick={generateRoadmap}
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', gap: '8px' }}
            >
              {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Compass size={16} />}
              <span>{isLoading ? 'Creating timeline roadmap...' : 'Generate AI Roadmap'}</span>
            </button>
          </GlassCard>
        </div>

        {/* Roadmap Display Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isLoading ? (
            <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '20px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.05)',
                borderTopColor: 'var(--accent-purple)',
                animation: 'spin 1s linear infinite'
              }} />
              <h4>Tailoring algorithmic nodes timeline...</h4>
            </GlassCard>
          ) : roadmap ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {roadmap.map((stage, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                  
                  {/* Visual Node line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--primary-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
                    }}>{idx + 1}</div>
                    {idx + 1 < roadmap.length && (
                      <div style={{ width: '2px', flex: 1, background: 'var(--glass-border)', margin: '8px 0' }} />
                    )}
                  </div>

                  {/* Stage card details */}
                  <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{stage.title}</h4>
                      <span className="badge badge-info">{stage.timeframe}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {stage.subtopics.map((sub, i) => {
                        const isDone = !!completedTopics[sub];
                        return (
                          <button
                            key={i}
                            onClick={() => toggleTopic(sub)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.01)',
                              border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.2)' : 'var(--glass-border)'}`,
                              color: isDone ? 'var(--accent-green)' : 'var(--text-secondary)',
                              cursor: 'pointer',
                              width: '100%',
                              textAlign: 'left',
                              fontSize: '0.825rem',
                              fontFamily: 'inherit',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '4px',
                              border: `1px solid ${isDone ? 'var(--accent-green)' : 'var(--text-muted)'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {isDone && <Check size={12} color="var(--accent-green)" />}
                            </div>
                            <span style={{ textDecoration: isDone ? 'line-through' : 'none' }}>{sub}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div style={{
                      background: 'rgba(255,255,255,0.02)',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      fontSize: '0.775rem',
                      color: 'var(--text-muted)'
                    }}>
                      <strong>AI Tip:</strong> {stage.tips}
                    </div>
                  </GlassCard>

                </div>
              ))}
            </div>
          ) : (
            <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Compass size={48} style={{ color: 'var(--text-muted)' }} />
              <h4>Configure setup parameters and generate timeline roadmap</h4>
            </GlassCard>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 2fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default LearningRoadmap;
