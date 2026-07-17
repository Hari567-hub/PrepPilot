import React, { useState, useEffect } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { APTITUDE_QUESTIONS } from '../utils/mockData';
import { Award, Timer, CheckCircle2, XCircle } from 'lucide-react';

const mockLeaderboard = [
  { rank: 1, name: 'Sarah Jenkins', score: 980, streak: 12 },
  { rank: 2, name: 'Kenji Tanaka', score: 910, streak: 8 },
  { rank: 3, name: 'Aarav Mehta', score: 870, streak: 15 },
  { rank: 4, name: 'You (John Doe)', score: 790, streak: 3 },
  { rank: 5, name: 'Maya Lin', score: 760, streak: 5 }
];

export const Aptitude: React.FC = () => {
  const { addNotification, completeDailyChallenge } = useAppStore();
  
  // Selection state
  const [activeTab, setActiveTab] = useState<'Quant' | 'Logical' | 'Verbal'>('Quant');
  const [quizActive, setQuizActive] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  // Timer states
  const [timer, setTimer] = useState(45);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const getFilteredQuestions = () => {
    const catMap: Record<string, string> = {
      Quant: 'Quantitative',
      Logical: 'Logical',
      Verbal: 'Verbal'
    };
    return APTITUDE_QUESTIONS.filter(q => q.category === catMap[activeTab]);
  };

  const activeQuestions = getFilteredQuestions();
  const activeQuestion = activeQuestions[currentIdx];

  // Timer tick hook
  useEffect(() => {
    let t: any;
    if (quizActive && !answerSubmitted && timer > 0) {
      t = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0 && !answerSubmitted) {
      handleSubmitAnswer();
    }
    return () => clearInterval(t);
  }, [quizActive, timer, answerSubmitted]);

  const startQuiz = () => {
    setQuizActive(true);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setTimer(45);
    setAnswerSubmitted(false);
  };

  const handleSubmitAnswer = () => {
    if (answerSubmitted) return;
    setAnswerSubmitted(true);
    
    if (selectedOpt === activeQuestion.correctIndex) {
      setScore(prev => prev + 1);
      addNotification('Correct Answer! +10 Points', 'success');
    } else {
      addNotification('Incorrect Answer!', 'warning');
    }
  };

  const handleNextQuestion = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < activeQuestions.length) {
      setCurrentIdx(nextIdx);
      setSelectedOpt(null);
      setTimer(45);
      setAnswerSubmitted(false);
    } else {
      setQuizActive(false);
      completeDailyChallenge('aptitude');
      addNotification(`Quiz completed! You scored ${score}/${activeQuestions.length}`, 'success');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Aptitude Practice</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Improve speed and accuracy on quantitative formulas, logical sequences, and verbal logic.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left: Active Practice / Quiz Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tab selector */}
          {!quizActive && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['Quant', 'Logical', 'Verbal'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === tab ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.03)',
                    color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  {tab === 'Quant' ? 'Quantitative' : tab === 'Logical' ? 'Logical Reasoning' : 'Verbal Ability'}
                </button>
              ))}
            </div>
          )}

          {quizActive && activeQuestion ? (
            <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Quiz Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Question {currentIdx + 1} of {activeQuestions.length}</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: timer < 10 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.03)',
                  border: timer < 10 ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--glass-border)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  color: timer < 10 ? '#ef4444' : 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  <Timer size={14} />
                  <span>{timer}s</span>
                </div>
              </div>

              {/* Question content */}
              <h3 style={{ fontSize: '1.25rem', lineHeight: 1.5 }}>{activeQuestion.question}</h3>

              {/* Options list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOpt === idx;
                  const isCorrect = idx === activeQuestion.correctIndex;
                  
                  let borderCol = 'var(--glass-border)';
                  let bgCol = 'rgba(255,255,255,0.01)';
                  
                  if (isSelected && !answerSubmitted) {
                    borderCol = 'var(--primary)';
                    bgCol = 'rgba(99, 102, 241, 0.05)';
                  }
                  if (answerSubmitted) {
                    if (isCorrect) {
                      borderCol = 'rgba(16, 185, 129, 0.4)';
                      bgCol = 'rgba(16, 185, 129, 0.08)';
                    } else if (isSelected) {
                      borderCol = 'rgba(239, 68, 68, 0.4)';
                      bgCol = 'rgba(239, 68, 68, 0.08)';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={answerSubmitted}
                      onClick={() => setSelectedOpt(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 20px',
                        borderRadius: '8px',
                        background: bgCol,
                        border: `1px solid ${borderCol}`,
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '0.95rem'
                      }}
                    >
                      <span>{opt}</span>
                      {answerSubmitted && (
                        isCorrect ? (
                          <CheckCircle2 size={18} color="var(--accent-green)" />
                        ) : isSelected ? (
                          <XCircle size={18} color="var(--accent-red)" />
                        ) : null
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                {!answerSubmitted ? (
                  <button 
                    onClick={handleSubmitAnswer}
                    disabled={selectedOpt === null}
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '12px' }}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button 
                    onClick={handleNextQuestion}
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '12px' }}
                  >
                    {currentIdx + 1 === activeQuestions.length ? 'Finish Quiz' : 'Next Question'}
                  </button>
                )}
              </div>

              {/* Solution explanation */}
              {answerSubmitted && (
                <div className="animate-fade-in" style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '0.85rem'
                }}>
                  <strong style={{ color: 'var(--accent-blue)', display: 'block', marginBottom: '6px' }}>Explanation:</strong>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{activeQuestion.explanation}</p>
                </div>
              )}

            </GlassCard>
          ) : (
            <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '15px' }}>
              <Timer size={48} style={{ color: 'var(--text-muted)' }} />
              <h3 style={{ fontSize: '1.25rem' }}>Ready to Start {activeTab} Quiz?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', maxWidth: '340px' }}>
                Each topic contains timed question trials. Answers are graded immediately with logical steps details.
              </p>
              <button onClick={startQuiz} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                Start Quiz Time (45s/Q)
              </button>
            </GlassCard>
          )}
        </div>

        {/* Right: Leaderboard Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="var(--accent-purple)" /> Global Leaderboard
          </h3>

          <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '0.5fr 2fr 1fr 1fr',
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderBottom: '1px solid var(--glass-border)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}>
              <span>Rank</span>
              <span>Name</span>
              <span>Points</span>
              <span style={{ textAlign: 'right' }}>Streak</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {mockLeaderboard.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '0.5fr 2fr 1fr 1fr',
                    padding: '14px 20px',
                    borderBottom: idx + 1 === mockLeaderboard.length ? 'none' : '1px solid var(--glass-border)',
                    fontSize: '0.85rem',
                    background: item.name.includes('You') ? 'rgba(99, 102, 241, 0.05)' : 'none',
                    fontWeight: item.name.includes('You') ? 600 : 500
                  }}
                >
                  <span style={{
                    color: item.rank === 1 ? '#fbbf24' : item.rank === 2 ? '#94a3b8' : item.rank === 3 ? '#b45309' : 'var(--text-secondary)'
                  }}>#{item.rank}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                  <span>{item.score}</span>
                  <span style={{ textAlign: 'right', color: '#fbbf24' }}>{item.streak}🔥</span>
                </div>
              ))}
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
export default Aptitude;
