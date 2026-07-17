import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { 
  evaluateInterviewAnswer, speakText, stopSpeaking, SpeechRecognitionService 
} from '../utils/aiEngine';
import { 
  Mic, Square, RefreshCw, Send, ChevronRight, Volume2, HelpCircle 
} from 'lucide-react';

const mockQuestions = [
  "How do you ensure data consistency across multiple microservices in a distributed architecture?",
  "What is the difference between a process and a thread, and how does your favorite language handle concurrency?",
  "Tell me about a time you had to optimize a slow database query. What was the scenario, and what actions did you take?",
  "Explain the concept of Virtual Memory and how paging work in modern Operating Systems."
];

export const MockInterview: React.FC = () => {
  const { user, addAttempt, addNotification, completeDailyChallenge } = useAppStore();
  
  // Setup config states
  const [configActive, setConfigActive] = useState(true);
  const [company, setCompany] = useState('Google');
  const [role, setRole] = useState(user?.targetRole || 'Software Engineer');
  const [experience, setExperience] = useState(user?.experience || 'Fresher');
  const [difficulty, setDifficulty] = useState('Medium');

  // Interview session states
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Audio recognition service reference
  const [recognitionService] = useState(() => new SpeechRecognitionService());

  // Result metrics
  const [evaluation, setEvaluation] = useState<any | null>(null);

  const startInterview = () => {
    setConfigActive(false);
    setQuestionIndex(0);
    const q = mockQuestions[0];
    setCurrentQuestion(q);
    setUserAnswer('');
    setEvaluation(null);
    speakText(`Here is your first question: ${q}`);
  };

  const handleSpeech = () => {
    if (isRecording) {
      recognitionService.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionService.startListening(
        (text) => {
          setUserAnswer(prev => prev + ' ' + text);
          addNotification('Voice capture added!', 'success');
        },
        (err) => {
          addNotification(err, 'warning');
          setIsRecording(false);
        },
        () => setIsRecording(false)
      );
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      addNotification('Please type or record an answer first.', 'warning');
      return;
    }

    setIsLoading(true);
    stopSpeaking();
    
    try {
      const res = await evaluateInterviewAnswer(currentQuestion, userAnswer, 'Mock');
      setEvaluation(res);
      
      // Save attempt to global store
      addAttempt({
        company,
        role,
        score: res.score,
        type: 'Mock'
      });
      completeDailyChallenge('hr'); // mark challenge item completed
      addNotification('AI evaluation ready!', 'success');
    } catch (e) {
      addNotification('Evaluation failed. Please try again.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = () => {
    stopSpeaking();
    const nextIdx = questionIndex + 1;
    if (nextIdx < mockQuestions.length) {
      setQuestionIndex(nextIdx);
      const nextQ = mockQuestions[nextIdx];
      setCurrentQuestion(nextQ);
      setUserAnswer('');
      setEvaluation(null);
      speakText(nextQ);
    } else {
      addNotification('Interview session completed!', 'success');
      setConfigActive(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>AI Mock Interview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure criteria, answer via voice or text, and get instant grading feedback.</p>
      </div>

      {configActive ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GlassCard style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Interview Setup</h3>

            <div className="grid-responsive" style={{ gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Company Target</label>
                <select className="glass-select" value={company} onChange={(e) => setCompany(e.target.value)}>
                  <option value="Google">Google</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="TCS">TCS</option>
                  <option value="Infosys">Infosys</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Target Role</label>
                <select className="glass-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="ML Engineer">ML Engineer</option>
                  <option value="System Design Manager">System Design Architect</option>
                </select>
              </div>
            </div>

            <div className="grid-responsive" style={{ gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Experience Tier</label>
                <select className="glass-select" value={experience} onChange={(e) => setExperience(e.target.value as 'Fresher' | 'Experienced')}>
                  <option value="Fresher">Fresher (Entry Level)</option>
                  <option value="Experienced">Experienced (Senior)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Difficulty Level</label>
                <select className="glass-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <button onClick={startInterview} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              Start Interview Simulation
            </button>
          </GlassCard>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* Active Question & Input Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge badge-${difficulty.toLowerCase()}`}>{difficulty} Difficulty</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Question {questionIndex + 1} of {mockQuestions.length}</span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', lineHeight: 1.5, marginBottom: '10px' }}>{currentQuestion}</h3>
                <button 
                  onClick={() => speakText(currentQuestion)}
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '6px' }}
                >
                  <Volume2 size={14} /> Speak Question
                </button>
              </div>

              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Your Response</label>
                <textarea 
                  className="glass-textarea" 
                  rows={8}
                  placeholder="Type your response here or use voice recording..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  style={{ flex: 1, resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  onClick={handleSpeech}
                  className={`btn ${isRecording ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '12px' }}
                >
                  {isRecording ? <Square size={16} /> : <Mic size={16} />}
                  <span>{isRecording ? 'Stop Recording...' : 'Answer with Voice'}</span>
                </button>
                <button 
                  onClick={submitAnswer} 
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                  <span>{isLoading ? 'Reviewing...' : 'Submit Response'}</span>
                </button>
              </div>
            </GlassCard>
          </div>

          {/* AI Feedback Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {isLoading ? (
              <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: '3px solid rgba(255, 255, 255, 0.05)',
                  borderTopColor: 'var(--accent-purple)',
                  animation: 'spin 1s linear infinite'
                }} />
                <div>
                  <h4 style={{ textAlign: 'center', fontSize: '1.1rem' }}>AI evaluation engine at work...</h4>
                  <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Analyzing keyword densities, grammatical flows, and structural STAR methods.
                  </p>
                </div>
              </GlassCard>
            ) : evaluation ? (
              <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>AI Feedback Report</h3>
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: evaluation.score > 70 ? 'var(--accent-green)' : 'var(--accent-yellow)',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)'
                  }}>{evaluation.score}%</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Technical</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>{evaluation.technicalRating}/10</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Communication</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>{evaluation.communicationRating}/10</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confidence</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>{evaluation.confidenceRating}%</div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>Detailed Feedback:</h4>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>{evaluation.feedback}</p>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Recommended Answer:</span>
                    <button 
                      onClick={() => speakText(evaluation.betterAnswer)}
                      className="btn btn-secondary" 
                      style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                    >Listen</button>
                  </h4>
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

                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                  <button 
                    onClick={() => setConfigActive(true)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >Configure</button>
                  <button 
                    onClick={nextQuestion}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Next Question <ChevronRight size={16} />
                  </button>
                </div>
              </GlassCard>
            ) : (
              <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                <HelpCircle size={48} style={{ color: 'var(--text-muted)' }} />
                <h4 style={{ color: 'var(--text-muted)' }}>Waiting for answer submission</h4>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                  Submit your response on the left panel to trigger the AI analysis engine.
                </p>
              </GlassCard>
            )}
          </div>

        </div>
      )}

      {/* Embedded Spinner CSS */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1.2s linear infinite;
        }
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default MockInterview;
