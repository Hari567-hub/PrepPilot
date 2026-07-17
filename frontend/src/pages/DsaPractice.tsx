import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { DSA_QUESTIONS } from '../utils/mockData';
import type { DSAQuestion } from '../utils/mockData';
import { BookOpen, Sparkles, Eye, HelpCircle } from 'lucide-react';

export const DsaPractice: React.FC = () => {
  const { addNotification } = useAppStore();
  
  // Filter states
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  
  // Question detail states
  const [activeQuestion, setActiveQuestion] = useState<DSAQuestion | null>(DSA_QUESTIONS[0]);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const topics = ['All', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredQuestions = DSA_QUESTIONS.filter(q => {
    const topicMatch = selectedTopic === 'All' || q.topic === selectedTopic;
    const diffMatch = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return topicMatch && diffMatch;
  });

  const selectQuestion = (q: DSAQuestion) => {
    setActiveQuestion(q);
    setHintIndex(0);
    setShowSolution(false);
  };

  const handleNextHint = () => {
    if (!activeQuestion) return;
    if (hintIndex < activeQuestion.hints.length) {
      setHintIndex(hintIndex + 1);
      addNotification(`Hint ${hintIndex + 1} expanded!`, 'info');
    } else {
      addNotification('All hints shown. Check solution for code details.', 'info');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>DSA Practice Hub</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Topic-wise curated algorithmic challenges with interactive visualizers and hints.</p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        alignItems: 'center'
      }}>
        {/* Topic Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: 'none',
                background: selectedTopic === t ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.03)',
                color: selectedTopic === t ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Difficulty Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Difficulty:</span>
          <select 
            className="glass-select" 
            style={{ width: '110px', padding: '6px 10px', fontSize: '0.8rem' }}
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Main Grid: List vs Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '24px' }}>
        
        {/* Left List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredQuestions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No DSA questions found matching filters.
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <GlassCard 
                key={q.id}
                onClick={() => selectQuestion(q)}
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  borderLeft: activeQuestion?.id === q.id ? '4px solid var(--accent-blue)' : '4px solid transparent',
                  background: activeQuestion?.id === q.id ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.topic}</span>
                  <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{q.title}</h4>
                <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {q.companies.map((c, i) => (
                    <span key={i} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))
          )}
        </div>

        {/* Right Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeQuestion ? (
            <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem' }}>{activeQuestion.title}</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={handleNextHint}
                    className="btn btn-secondary" 
                    style={{ padding: '6px 14px', fontSize: '0.75rem', gap: '4px' }}
                  >
                    <Sparkles size={14} color="var(--accent-purple)" /> 
                    <span>AI Hint {hintIndex > 0 && `(${hintIndex}/${activeQuestion.hints.length})`}</span>
                  </button>
                  <button 
                    onClick={() => setShowSolution(!showSolution)}
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.75rem', gap: '4px' }}
                  >
                    <Eye size={14} /> 
                    <span>{showSolution ? 'Hide Solution' : 'Explain Solution'}</span>
                  </button>
                </div>
              </div>

              {/* Hints Box */}
              {hintIndex > 0 && (
                <div style={{
                  background: 'rgba(99, 102, 241, 0.05)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <HelpCircle size={14} /> Hint Assistance
                  </h5>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {activeQuestion.hints.slice(0, hintIndex).map((hint, idx) => (
                      <li key={idx}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Problem Statement</h4>
                <p style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{activeQuestion.description}</p>
              </div>

              {/* Visualization Steps */}
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Step-by-Step Visualization</h4>
                <div style={{
                  background: 'rgba(0,0,0,0.2)',
                  padding: '16px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {activeQuestion.visualization.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>&gt;&gt;</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Solution */}
              {showSolution && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Python Solution</h4>
                  <pre style={{
                    background: '#04020a',
                    padding: '16px',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: 'var(--accent-green)',
                    overflowX: 'auto',
                    border: '1px solid var(--glass-border)'
                  }}>{activeQuestion.solution}</pre>
                </div>
              )}

            </GlassCard>
          ) : (
            <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <BookOpen size={48} style={{ color: 'var(--text-muted)' }} />
              <h4 style={{ color: 'var(--text-muted)' }}>No Question Selected</h4>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select an algorithmic problem from the left panel to begin.</p>
            </GlassCard>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 1.6fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default DsaPractice;
