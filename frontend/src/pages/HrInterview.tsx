import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { HR_QUESTIONS } from '../utils/mockData';
import type { HRQuestion } from '../utils/mockData';
import { evaluateInterviewAnswer, speakText, stopSpeaking } from '../utils/aiEngine';
import { HelpCircle, RefreshCw, Send } from 'lucide-react';

export const HrInterview: React.FC = () => {
  const { addAttempt, addNotification, completeDailyChallenge } = useAppStore();

  const [activeQuestion, setActiveQuestion] = useState<HRQuestion | null>(HR_QUESTIONS[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  const selectQuestion = (q: HRQuestion) => {
    setActiveQuestion(q);
    setUserAnswer('');
    setEvaluation(null);
    stopSpeaking();
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim() || !activeQuestion) {
      addNotification('Please type your response first.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await evaluateInterviewAnswer(activeQuestion.question, userAnswer, 'STAR');
      setEvaluation(res);
      addAttempt({
        company: 'Behavioral Round',
        role: 'General Competency',
        score: res.score,
        type: 'Behavioral'
      });
      completeDailyChallenge('hr');
      addNotification('STAR scoring complete!', 'success');
    } catch (e) {
      addNotification('Grading failed. Please try again.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>HR & Behavioral Prep</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Practice typical HR situations and evaluate answers using the STAR method (Situation, Task, Action, Result).</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '24px' }}>
        
        {/* Left Side: Question List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {HR_QUESTIONS.map((q) => (
            <GlassCard 
              key={q.id}
              onClick={() => selectQuestion(q)}
              style={{
                padding: '16px',
                cursor: 'pointer',
                borderLeft: activeQuestion?.id === q.id ? '4px solid var(--accent-purple)' : '4px solid transparent',
                background: activeQuestion?.id === q.id ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)'
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.category}</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{q.question}</h4>
            </GlassCard>
          ))}
        </div>

        {/* Right Side: Active Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeQuestion ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Question card */}
              <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-info">{activeQuestion.category}</span>
                  <button 
                    onClick={() => speakText(activeQuestion.question)}
                    className="btn btn-secondary" 
                    style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                  >Speak Question</button>
                </div>

                <h3 style={{ fontSize: '1.2rem', lineHeight: 1.5 }}>{activeQuestion.question}</h3>
                
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Why we ask this:</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{activeQuestion.purpose}</div>
                </div>

                <div className="input-group">
                  <label className="input-label">Your STAR Answer</label>
                  <textarea 
                    className="glass-textarea" 
                    rows={6}
                    placeholder="Describe the Situation, your specific Task, the Action you completed, and the measurable Result..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    style={{ resize: 'none' }}
                  />
                </div>

                <button 
                  onClick={handleEvaluate}
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ padding: '12px', width: '100%', gap: '8px' }}
                >
                  {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                  <span>{isLoading ? 'Grading answer details...' : 'Submit Answer for STAR Grading'}</span>
                </button>
              </GlassCard>

              {/* AI evaluation panel */}
              {isLoading ? (
                <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '15px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '3px solid rgba(255,255,255,0.05)',
                    borderTopColor: 'var(--accent-purple)',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <h4>STAR verification engines evaluating logic...</h4>
                </GlassCard>
              ) : evaluation ? (
                <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.15rem' }}>STAR Scoring Breakdown</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{evaluation.score} / 100</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Structure (STAR)</span>
                      <h4 style={{ fontSize: '1.15rem', marginTop: '4px' }}>{Math.round(evaluation.score / 10)} / 10</h4>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clarity</span>
                      <h4 style={{ fontSize: '1.15rem', marginTop: '4px' }}>{evaluation.communicationRating} / 10</h4>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Impact</span>
                      <h4 style={{ fontSize: '1.15rem', marginTop: '4px' }}>{evaluation.technicalRating} / 10</h4>
                    </div>
                  </div>

                  <div>
                    <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>AI Behavioral Feedback:</h5>
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>{evaluation.feedback}</p>
                  </div>

                  <div>
                    <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Ideal Response Framework:</h5>
                    <pre style={{
                      background: 'rgba(0,0,0,0.2)',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'var(--font-body)',
                      lineHeight: '1.5'
                    }}>{evaluation.betterAnswer}</pre>
                  </div>
                </GlassCard>
              ) : null}

            </div>
          ) : (
            <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <HelpCircle size={48} style={{ color: 'var(--text-muted)' }} />
              <h4 style={{ color: 'var(--text-muted)' }}>No behavioral question selected</h4>
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
export default HrInterview;
