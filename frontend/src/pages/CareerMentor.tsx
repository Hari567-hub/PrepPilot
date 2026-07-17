import React, { useState, useRef, useEffect } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { Send, MessageSquare } from 'lucide-react';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

export const CareerMentor: React.FC = () => {
  const { user } = useAppStore();

  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: `Hello ${user?.name || 'there'}! I am your 24/7 AI Career Mentor. Ask me any questions regarding roadmaps optimization, project systems design trade-offs, salary standards, or resume modifications.` }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Dynamic career mentor intelligence replies simulator
    const normalized = userText.toLowerCase();
    let replyText = "Interesting query! As a career mentor, I suggest structuring this approach. Focus on showing quantified metrics on your achievements, practicing top Arrays/Strings DSA patterns daily, and understanding consistent hashing for distributed scalability.";
    
    if (normalized.includes('resume') || normalized.includes('cv')) {
      replyText = "When rewriting your resume, make sure you convert passive phrases (like 'responsible for writing systems code') into quantified active achievements (e.g. 'Architected modular React modules which reduced client render bundles by 25%'). Remember to check for missing keywords targeting your job role.";
    } else if (normalized.includes('dsa') || normalized.includes('algorithm') || normalized.includes('code')) {
      replyText = "For Data Structures and Algorithms, focus heavily on HashMaps (for O(1) searches), two-pointer windows, standard tree depth traversals, and dynamic programming memoization. Always talk through your complexity estimations aloud during live screens.";
    } else if (normalized.includes('system design') || normalized.includes('architecture') || normalized.includes('scale')) {
      replyText = "In System Design rounds, start by gathering requirements and stating constraints (QPS, storage limits). Propose a simple flow chart, then explain how you will scale components. Inject a Redis LRU caching tier and utilize NoSQL databases (like Cassandra) for high writes partitioning.";
    } else if (normalized.includes('salary') || normalized.includes('negotiate') || normalized.includes('offer')) {
      replyText = "When discussing salary, let the hiring manager state the band first if possible. Always back up your rate requests with specific competitive metrics, state your active value addition details, and remain collaborative. Good luck!";
    }

    setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
    setIsTyping(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', height: '80vh' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>AI Career Mentor</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Chat with a specialized technical counselor to optimize resumes, designs, and interview strategies.</p>
      </div>

      <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
        
        {/* Chat Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
          }}>
            <MessageSquare size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Counselor Bot</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Online & listening</span>
          </div>
        </div>

        {/* Message Logs list */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  background: isUser ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.03)',
                  border: isUser ? 'none' : '1px solid var(--glass-border)',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  color: '#fff',
                  borderBottomRightRadius: isUser ? '2px' : '12px',
                  borderBottomLeftRadius: isUser ? '12px' : '2px'
                }}>
                  {msg.content}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
                padding: '12px 18px',
                borderRadius: '12px',
                display: 'flex',
                gap: '4px',
                alignItems: 'center'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', animation: 'pulseGlow 1s infinite' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', animation: 'pulseGlow 1s infinite 0.2s' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', animation: 'pulseGlow 1s infinite 0.4s' }} />
              </div>
            </div>
          )}

          <div ref={listRef} />
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSend} style={{
          padding: '16px',
          borderTop: '1px solid var(--glass-border)',
          background: 'rgba(255, 255, 255, 0.01)',
          display: 'flex',
          gap: '12px'
        }}>
          <input 
            type="text" 
            placeholder="Ask counselor about resumes, scaling designs, salary grids..." 
            className="glass-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>
            <Send size={16} />
          </button>
        </form>

      </GlassCard>
    </div>
  );
};
export default CareerMentor;
