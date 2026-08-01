import React, { useState, useEffect } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import Editor from '@monaco-editor/react';
import { runAndReviewCode } from '../utils/aiEngine';
import { Play, Sparkles, RefreshCw, Code, Terminal, Clock } from 'lucide-react';

const codeDefaults: Record<string, string> = {
  javascript: `function twoSum(nums, target) {\n    // Write your optimal solution here\n    \n}`,
  python: `def twoSum(nums, target):\n    # Write your optimal solution here\n    pass`,
  cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write solution here\n    }\n};`,
  java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write solution here\n    }\n}`
};

const dsaHints = [
  "Think about a single pass approach. How can we look up previously visited elements in O(1) time?",
  "Calculate the complement (target - nums[i]). If it exists in your Map/dict, you have found the target indices.",
  "Single loop: loop through nums. If (target - num) is in seen, return [seen[target - num], i]. Otherwise, seen[num] = i."
];

export const CodingPractice: React.FC = () => {
  const { addAttempt, addNotification, completeDailyChallenge, solvedProblems, saveProblemProgress } = useAppStore();
  
  const [language, setLanguage] = useState('python');
  const [theme, setTheme] = useState('vs-dark');
  const [code, setCode] = useState(codeDefaults.python);
  const [timerSeconds, setTimerSeconds] = useState(1800); // 30 mins
  const [timerActive] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>('Console idle. Write code and hit "Run Code"');
  const [reviewResult, setReviewResult] = useState<any | null>(null);
  const [hintIndex, setHintIndex] = useState(-1);

  // Restore cached solved progress on mount / language toggle
  useEffect(() => {
    const saved = solvedProblems['dsa-1'];
    if (saved && saved.language === language) {
      setCode(saved.code);
      setConsoleOutput('Restored previously saved solution code. All test cases passed.');
    } else {
      setCode(codeDefaults[language]);
    }
  }, [language]);

  // Timer hook
  useEffect(() => {
    let interval: any;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(codeDefaults[lang] || '');
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput('Compiling execution tree...\nRunning initial test suite...');
    setReviewResult(null);

    try {
      const res = await runAndReviewCode(code, language, 'dsa-1');
      setIsRunning(false);
      
      let testSummary = `Status: ${res.status}\n\n`;
      if (res.testCases.length > 0) {
        res.testCases.forEach((tc, idx) => {
          testSummary += `Test Case ${idx + 1}: ${tc.passed ? 'PASSED' : 'FAILED'}\n`;
          testSummary += `  Input: ${tc.input}\n`;
          testSummary += `  Expected: ${tc.expected}\n`;
          testSummary += `  Actual: ${tc.actual}\n\n`;
        });
      } else {
        testSummary += res.output;
      }
      setConsoleOutput(testSummary);
      setReviewResult(res);

      if (res.status === 'Accepted') {
        saveProblemProgress('dsa-1', code, language);
        addAttempt({
          company: 'Google',
          role: 'Software Engineer',
          score: 95,
          type: 'Coding'
        });
        completeDailyChallenge('coding');
        addNotification('Coding Challenge Cleared!', 'success');
      } else {
        addNotification('Tests failed. Look at console tips.', 'warning');
      }
    } catch (e) {
      setIsRunning(false);
      setConsoleOutput('Compile Error: Code syntax execution failed.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>AI Coding Assessment</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Problem: <strong>Two Sum</strong> | Arrays section</p>
        </div>

        {/* Timer & Lang controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '1rem',
            fontFamily: 'monospace'
          }}>
            <Clock size={16} color="var(--accent-purple)" />
            <span>{formatTime(timerSeconds)}</span>
          </div>

          <select 
            className="glass-select" 
            style={{ width: '120px', padding: '8px 12px' }}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="vs-dark">Dark Theme</option>
            <option value="vs">Light Theme</option>
            <option value="hc-black">High Contrast</option>
          </select>

          <select 
            className="glass-select" 
            style={{ width: '130px', padding: '8px 12px' }}
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>
      </div>

      {/* Grid: Editor Panel vs Problem Description */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
        
        {/* Description Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>1. Two Sum</h3>
            <span className="badge badge-easy" style={{ width: 'fit-content' }}>Easy</span>

            <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
              Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.
              {"\n\n"}
              You may assume that each input would have exactly one solution, and you may not use the same element twice.
              {"\n\n"}
              You can return the answer in any order.
            </p>

            <div>
              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Example 1</h5>
              <pre style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '12px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                Input: nums = [2, 7, 11, 15], target = 9{"\n"}
                Output: [0, 1]{"\n"}
                Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
              </pre>
            </div>

            <div>
              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Constraints</h5>
              <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>2 &lt;= nums.length &lt;= 10^4</li>
                <li>-10^9 &lt;= nums[i] &lt;= 10^9</li>
                <li>-10^9 &lt;= target &lt;= 10^9</li>
                <li>Only one valid answer exists.</li>
              </ul>
            </div>

            {/* AI Hint Sequencer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>AI Hint System</span>
                <button 
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  onClick={() => setHintIndex(prev => Math.min(2, prev + 1))}
                  disabled={hintIndex >= 2}
                >
                  Request Next Hint
                </button>
              </div>
              {hintIndex >= 0 && (
                <div style={{
                  background: 'rgba(59,130,246,0.06)',
                  border: '1px solid rgba(59,130,246,0.15)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4'
                }}>
                  {dsaHints.slice(0, hintIndex + 1).map((h, i) => (
                    <div key={i} style={{ marginBottom: i < hintIndex ? '8px' : '0' }}>
                      <strong>Hint {i + 1}:</strong> {h}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Similar Interview Questions */}
            <div style={{ marginTop: '10px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Similar Interview Questions</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Contains Duplicate (Easy)</span>
                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Best Time to Buy and Sell Stock (Easy)</span>
              </div>
            </div>
          </GlassCard>

          {/* Console / Output */}
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={16} /> Console Output
            </h4>
            <pre style={{
              background: '#04020a',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '12px',
              minHeight: '120px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>{consoleOutput}</pre>
          </GlassCard>
        </div>

        {/* IDE Editor Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            {/* Editor Top Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 20px',
              borderBottom: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.01)'
            }}>
              <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                <Code size={16} /> solution.{language === 'javascript' ? 'js' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'py'}
              </span>
              
              <button 
                onClick={handleRunCode}
                disabled={isRunning}
                className="btn btn-primary"
                style={{ padding: '6px 16px', fontSize: '0.8rem', gap: '6px' }}
              >
                {isRunning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
              </button>
            </div>

            {/* Monaco Editor Wrapper */}
            <div style={{ padding: '10px', background: theme === 'vs' ? '#f5f5f5' : '#1e1e1e' }}>
              <Editor
                height="320px"
                language={language}
                value={code}
                theme={theme}
                onChange={(val) => setCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  automaticLayout: true
                }}
              />
            </div>
          </GlassCard>

          {/* AI Complexity and Better Solution Panel */}
          {reviewResult && reviewResult.status === 'Accepted' && (
            <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} className="animate-fade-in">
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--accent-purple)" /> AI Code Evaluation
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time Complexity</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px', color: 'var(--accent-purple)' }}>{reviewResult.timeComplexity}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Space Complexity</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px', color: 'var(--accent-blue)' }}>{reviewResult.spaceComplexity}</div>
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>AI Suggestion:</h5>
                <p style={{ fontSize: '0.825rem', margin: 0 }}>{reviewResult.suggestions}</p>
              </div>

              <div>
                <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Optimal Solution:</h5>
                <pre style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: 'var(--accent-green)',
                  overflowX: 'auto'
                }}>{reviewResult.betterSolution}</pre>
              </div>
            </GlassCard>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 1.2fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default CodingPractice;
