import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { SYSTEM_DESIGN_SCENARIOS } from '../utils/mockData';
import type { SystemDesignScenario } from '../utils/mockData';
import { evaluateInterviewAnswer } from '../utils/aiEngine';
import { Box, Database, Cpu, Layers, RefreshCw, Send, Check } from 'lucide-react';

export const SystemDesign: React.FC = () => {
  const { addAttempt, addNotification, completeDailyChallenge } = useAppStore();

  const [activeScenario, setActiveScenario] = useState<SystemDesignScenario | null>(SYSTEM_DESIGN_SCENARIOS[0]);
  
  // Design Form States
  const [dbLayer, setDbLayer] = useState('');
  const [apiLayer, setApiLayer] = useState('');
  const [caching, setCaching] = useState('');
  const [lbLayer, setLbLayer] = useState('');
  const [security, setSecurity] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  const selectScenario = (s: SystemDesignScenario) => {
    setActiveScenario(s);
    setDbLayer('');
    setApiLayer('');
    setCaching('');
    setLbLayer('');
    setSecurity('');
    setEvaluation(null);
  };

  const handleEvaluate = async () => {
    if (!dbLayer || !apiLayer || !caching || !activeScenario) {
      addNotification('Please fill out database, API, and cache strategies.', 'warning');
      return;
    }

    setIsLoading(true);
    const combinedAnswer = `DB Layer: ${dbLayer}. API Layer: ${apiLayer}. Caching Layer: ${caching}. Load Balancer: ${lbLayer}. Security Layer: ${security}`;
    
    try {
      const res = await evaluateInterviewAnswer(activeScenario.title, combinedAnswer, 'System Design');
      setEvaluation(res);
      addAttempt({
        company: 'System Design round',
        role: 'Architect Strategy',
        score: res.score,
        type: 'System Design'
      });
      completeDailyChallenge('systemDesign');
      addNotification('System Design evaluation completed!', 'success');
    } catch (e) {
      addNotification('Evaluation error. Please try again.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>System Design Practice</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review complex scenario systems, specify database/API scaling paths, and get detailed reviews.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '24px' }}>
        
        {/* Left list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SYSTEM_DESIGN_SCENARIOS.map((s) => (
            <GlassCard 
              key={s.id}
              onClick={() => selectScenario(s)}
              style={{
                padding: '16px',
                cursor: 'pointer',
                borderLeft: activeScenario?.id === s.id ? '4px solid var(--accent-blue)' : '4px solid transparent',
                background: activeScenario?.id === s.id ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)'
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{s.title}</h4>
            </GlassCard>
          ))}
        </div>

        {/* Right Active workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeScenario ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Scenario specs */}
              <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Design challenge: {activeScenario.title}</h3>
                <p style={{ fontSize: '0.875rem' }}>{activeScenario.problem}</p>
                <div>
                  <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Core Requirements:</h5>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {activeScenario.requirements.map((req, i) => <li key={i}>{req}</li>)}
                  </ul>
                </div>
              </GlassCard>

              {/* Blueprint Inputs */}
              <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Architectural Specs</h3>

                <div className="input-group">
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Database size={14} color="var(--accent-blue)" /> Database Schema & Scaling
                  </label>
                  <textarea 
                    className="glass-textarea" 
                    rows={2} 
                    placeholder="e.g. NoSQL Cassandra key-value mappings. Split reads/writes with replication pools..."
                    value={dbLayer} 
                    onChange={(e) => setDbLayer(e.target.value)}
                    style={{ resize: 'none' }}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={14} color="var(--accent-purple)" /> API Routes & Protocols
                  </label>
                  <textarea 
                    className="glass-textarea" 
                    rows={2} 
                    placeholder="e.g. REST POST /v1/url endpoint returning base62 hashes. GET redirect endpoints..."
                    value={apiLayer} 
                    onChange={(e) => setApiLayer(e.target.value)}
                    style={{ resize: 'none' }}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={14} color="var(--accent-green)" /> Caching & Memory Layer
                  </label>
                  <textarea 
                    className="glass-textarea" 
                    rows={2} 
                    placeholder="e.g. Redis LRU policy caching top 20% high-frequency shortened keys..."
                    value={caching} 
                    onChange={(e) => setCaching(e.target.value)}
                    style={{ resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="input-group">
                    <label className="input-label">Load Balancer Policy</label>
                    <input 
                      type="text" 
                      className="glass-input" 
                      placeholder="e.g. Consistent hashing"
                      value={lbLayer}
                      onChange={(e) => setLbLayer(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Security & Firewalls</label>
                    <input 
                      type="text" 
                      className="glass-input" 
                      placeholder="e.g. Rate limiting (100 req/min)"
                      value={security}
                      onChange={(e) => setSecurity(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleEvaluate}
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', gap: '8px' }}
                >
                  {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                  <span>{isLoading ? 'Reviewing specifications...' : 'Submit Design to AI Reviewer'}</span>
                </button>
              </GlassCard>

              {/* Review feedback panel */}
              {isLoading ? (
                <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '15px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '3px solid rgba(255,255,255,0.05)',
                    borderTopColor: 'var(--accent-blue)',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <h4>Evaluating data flow models...</h4>
                </GlassCard>
              ) : evaluation ? (
                <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.15rem' }}>AI System Review Report</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{evaluation.score} / 100</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scalability</span>
                      <h4 style={{ fontSize: '1.1rem', marginTop: '4px' }}>{Math.round(evaluation.score / 10)} / 10</h4>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Database strategy</span>
                      <h4 style={{ fontSize: '1.1rem', marginTop: '4px' }}>{evaluation.technicalRating} / 10</h4>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cache & Bottleneck</span>
                      <h4 style={{ fontSize: '1.1rem', marginTop: '4px' }}>{evaluation.confidenceRating > 80 ? 'Optimal' : 'Needs tuning'}</h4>
                    </div>
                  </div>

                  <div>
                    <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>AI Critiques:</h5>
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>{evaluation.feedback}</p>
                  </div>

                  <div>
                    <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Optimal Architectural Practices:</h5>
                    <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {activeScenario.bestPractices.map((bp, i) => (
                        <li key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <Check size={12} color="var(--accent-green)" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              ) : null}

            </div>
          ) : (
            <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <Box size={48} style={{ color: 'var(--text-muted)' }} />
              <h4>No design scenario selected</h4>
            </GlassCard>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 1.8fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default SystemDesign;
