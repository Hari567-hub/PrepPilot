import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { 
  Sparkles, Mic, Code, FileSpreadsheet, 
  Map, BookOpen, Star, ArrowRight, MessageSquare, X
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { login } = useAppStore();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      login(email, name);
    }
  };

  const features = [
    { icon: Mic, title: 'AI Mock Interviews', desc: 'Speak or type your responses. Receive audio/text evaluation, comms rating, and structural advice.' },
    { icon: FileSpreadsheet, title: 'ATS Resume Analyzer', desc: 'Scan your resume for formatting anomalies, missing keywords, and readability metrics.' },
    { icon: Code, title: 'IDE Coding Simulator', desc: 'Code in Python, JS, C++, or Java. Get complexity analysis and optimal solutions instantly.' },
    { icon: Map, title: 'Personalized Roadmaps', desc: 'Generate customized preparation schedules mapped to your dream company and target timeline.' },
    { icon: BookOpen, title: 'DSA & Aptitude Hub', desc: 'Practice top-tier algorithmic challenges and time-based quantitative aptitude quizzes.' },
    { icon: MessageSquare, title: 'AI Career Mentor', desc: 'A 24/7 dedicated AI assistant to solve design queries, review projects, and recommend prep topics.' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Background Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40%',
        height: '60%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-10%',
        width: '40%',
        height: '60%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: 1
      }} />

      {/* Header / Navbar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 8%',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)'
          }}>IP</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }} className="gradient-text">PrepAI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}
          >Log In</button>
          <button 
            onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
            className="btn btn-primary"
          >Get Started</button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '80px 8% 100px 8%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '99px',
          padding: '6px 16px',
          color: 'var(--accent-purple)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '24px'
        }}>
          <Sparkles size={14} />
          <span>Supercharged by Advanced AI models</span>
        </div>

        <h1 style={{
          fontSize: '3.75rem',
          lineHeight: 1.1,
          maxWidth: '850px',
          marginBottom: '24px',
          fontWeight: 800
        }}>
          Master Your Next Tech Interview with <span className="gradient-text">InterviewPrep AI</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          marginBottom: '40px'
        }}>
          Practice real-time coding, speak in live AI mock interviews, optimize your resume keywords, and track custom roadmap milestones.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
            className="btn btn-primary"
            style={{ padding: '14px 28px', fontSize: '1rem' }}
          >
            Start Practicing Free <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById('features');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn btn-secondary"
            style={{ padding: '14px 28px', fontSize: '1rem' }}
          >
            Explore Features
          </button>
        </div>
      </section>

      {/* Companies Logos Banner */}
      <section style={{
        padding: '40px 0',
        background: 'rgba(255, 255, 255, 0.01)',
        borderTop: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
          Prepare for hiring standards at top companies
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '60px',
          flexWrap: 'wrap',
          opacity: 0.65,
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}>
          <span>Google</span>
          <span>Amazon</span>
          <span>Microsoft</span>
          <span>Meta</span>
          <span>Netflix</span>
          <span>Apple</span>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '100px 8%', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '16px' }}>All-In-One Preparation Suite</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Everything you need to clear algorithmic rounds, design interviews, and behavioral reviews.</p>
        </div>
        
        <div className="grid-responsive" style={{ gap: '30px' }}>
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <GlassCard key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{feat.title}</h3>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>{feat.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 8%', background: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid var(--glass-border)', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '16px' }}>User Success Stories</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Thousands of candidates secured offers at top tech giants using our AI framework.</p>
        </div>
        <div className="grid-responsive" style={{ gap: '24px' }}>
          <GlassCard>
            <div style={{ display: 'flex', gap: '4px', color: '#fbbf24', marginBottom: '12px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" />)}
            </div>
            <p style={{ fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '16px' }}>
              "The AI mock interview feedback was exceptionally spot-on. It flagged my habit of speaking too quickly and recommended structural STAR outlines."
            </p>
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Aarav Mehta</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Software Engineer at Amazon</span>
          </GlassCard>
          
          <GlassCard>
            <div style={{ display: 'flex', gap: '4px', color: '#fbbf24', marginBottom: '12px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" />)}
            </div>
            <p style={{ fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '16px' }}>
              "The coding interview compiler and hidden test case generator prepared me perfectly for my Google assessment. Best platform out there!"
            </p>
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Sarah Jenkins</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Systems Architect at Google</span>
          </GlassCard>

          <GlassCard>
            <div style={{ display: 'flex', gap: '4px', color: '#fbbf24', marginBottom: '12px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" />)}
            </div>
            <p style={{ fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '16px' }}>
              "Uploading my CV to the Resume Analyzer scored my formatting errors immediately. Added standard cloud keywords and got a response in 3 days!"
            </p>
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Kenji Tanaka</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ML Developer at Microsoft</span>
          </GlassCard>
        </div>
      </section>

      {/* Pricing Options */}
      <section style={{ padding: '100px 8%', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '16px' }}>Transparent, Simple Pricing</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Choose the plan that suits your job hunting goals. Cancel anytime.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
          
          {/* Free Plan */}
          <div className="glass-panel" style={{ padding: '40px', width: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.5rem' }}>Basic Free</h3>
            <p style={{ fontSize: '0.85rem' }}>Perfect for basic practice starts.</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>$0 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ month</span></div>
            <hr style={{ borderColor: 'var(--glass-border)' }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li>✓ 3 Mock Interviews per month</li>
              <li>✓ Basic Resume Analyzer</li>
              <li>✓ Standard DSA Practice problems</li>
              <li>✓ In-Browser Code Compiler</li>
            </ul>
            <button 
              onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
              className="btn btn-secondary" 
              style={{ marginTop: 'auto' }}
            >Get Started</button>
          </div>

          {/* Premium Plan */}
          <div className="glass-panel" style={{
            padding: '40px',
            width: '340px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            border: '2px solid var(--accent-purple)',
            boxShadow: '0 0 25px rgba(139, 92, 246, 0.25), var(--card-shadow)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--primary-gradient)',
              color: '#fff',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>Recommended</div>
            <h3 style={{ fontSize: '1.5rem' }} className="gradient-text">Elite Pro</h3>
            <p style={{ fontSize: '0.85rem' }}>Full AI grading capability for serious job hunters.</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>$19 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ month</span></div>
            <hr style={{ borderColor: 'var(--glass-border)' }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li>✓ Unlimited AI Mock Interviews</li>
              <li>✓ Pro Resume ATS scoring (reports)</li>
              <li>✓ Spaced Repetition flashcards</li>
              <li>✓ System Design Flow Analysis</li>
              <li>✓ Career Mentor chatbot 24/7</li>
              <li>✓ Custom roadmaps generator</li>
            </ul>
            <button 
              onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
              className="btn btn-primary" 
              style={{ marginTop: 'auto' }}
            >Upgrade Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '60px 8%',
        background: 'rgba(10, 9, 23, 0.95)',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '30px',
        position: 'relative',
        zIndex: 10
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>IP</div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>PrepAI</span>
          </div>
          <p style={{ fontSize: '0.85rem', maxWidth: '280px', color: 'var(--text-muted)' }}>
            Elevating computer science graduates and engineering managers to clear tech recruitment cycles using AI feedback loops.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '16px' }}>Product</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li>Features</li>
              <li>Pricing</li>
              <li>Roadmaps</li>
              <li>Mock Terminal</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '16px' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li>About Us</li>
              <li>Careers</li>
              <li>Security Policy</li>
              <li>Terms & Privacy</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200
        }}>
          <div className="glass-panel" style={{
            padding: '40px',
            width: '100%',
            maxWidth: '420px',
            position: 'relative',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <button 
              onClick={() => setShowAuthModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.75rem', marginBottom: '10px' }} className="gradient-text">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {authMode === 'login' ? 'Sign in to access your customized roadmaps.' : 'Join to start practicing coding and behavioral interviews.'}
            </p>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="Enter name..." 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input 
                  type="email" 
                  className="glass-input" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ padding: '12px', width: '100%', marginTop: '10px' }}>
                {authMode === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {authMode === 'login' ? "Don't have an account? " : 'Already registered? '}
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                >
                  {authMode === 'login' ? 'Create one' : 'Login'}
                </button>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Landing;
