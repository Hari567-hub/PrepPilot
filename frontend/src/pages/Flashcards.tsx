import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { Brain, Eye, Plus } from 'lucide-react';

export const Flashcards: React.FC = () => {
  const { flashcards, reviewFlashcard, addFlashcard, addNotification } = useAppStore();

  // Active Review States
  const [revealed, setRevealed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // New Flashcard State
  const [showAddCard, setShowAddCard] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newCategory, setNewCategory] = useState('DSA');

  // Filter due cards
  const dueCards = flashcards.filter(c => {
    const dueTime = new Date(c.nextReviewDate).getTime();
    const now = new Date().getTime();
    return dueTime <= now;
  });

  const activeCard = dueCards[currentIndex];

  const handleReview = (quality: 'again' | 'good' | 'easy') => {
    if (!activeCard) return;
    reviewFlashcard(activeCard.id, quality);
    setRevealed(false);

    const nextIndex = currentIndex + 1;
    if (nextIndex < dueCards.length) {
      setCurrentIndex(nextIndex);
    } else {
      addNotification('All pending cards reviewed for today!', 'success');
      setCurrentIndex(0);
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFront.trim() && newBack.trim()) {
      addFlashcard(newFront.trim(), newBack.trim(), newCategory);
      setNewFront('');
      setNewBack('');
      setShowAddCard(false);
      addNotification('New flashcard added to stack!', 'success');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Spaced Repetition Flashcards</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review critical algorithms and design concepts daily using active recall intervals.</p>
        </div>
        <button onClick={() => setShowAddCard(!showAddCard)} className="btn btn-primary" style={{ gap: '6px' }}>
          <Plus size={16} /> Add Card
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
        
        {/* Active flashcard window */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeCard ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-info">{activeCard.category}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Card {currentIndex + 1} of {dueCards.length} due</span>
              </div>

              {/* Card Container */}
              <div 
                onClick={() => setRevealed(true)}
                style={{
                  perspective: '1000px',
                  cursor: 'pointer',
                  minHeight: '260px'
                }}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  minHeight: '260px',
                  transition: 'transform 0.6s',
                  transformStyle: 'preserve-3d',
                  transform: revealed ? 'rotateY(180deg)' : 'none'
                }}>
                  
                  {/* Front Side */}
                  <GlassCard style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ fontSize: '1.35rem', lineHeight: 1.5, marginBottom: '20px' }}>{activeCard.front}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={12} /> Click to reveal answer
                    </span>
                  </GlassCard>

                  {/* Back Side */}
                  <GlassCard style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    textAlign: 'center',
                    background: 'rgba(99, 102, 241, 0.03)',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                  }}>
                    <h3 style={{ fontSize: '1.25rem', lineHeight: 1.5, color: '#fff', marginBottom: '20px' }}>{activeCard.back}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>How well did you recall this?</span>
                  </GlassCard>

                </div>
              </div>

              {/* Spaced repetition review options */}
              {revealed && (
                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <button 
                    onClick={() => handleReview('again')}
                    className="btn btn-danger"
                    style={{ padding: '12px' }}
                  >
                    Again (1d)
                  </button>
                  <button 
                    onClick={() => handleReview('good')}
                    className="btn btn-secondary"
                    style={{ padding: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', color: 'var(--accent-blue)' }}
                  >
                    Good (2d)
                  </button>
                  <button 
                    onClick={() => handleReview('easy')}
                    className="btn btn-primary"
                    style={{ padding: '12px' }}
                  >
                    Easy (4d)
                  </button>
                </div>
              )}

            </div>
          ) : (
            <GlassCard style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <Brain size={48} style={{ color: 'var(--text-muted)' }} />
              <h3>All caught up for today!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', maxWidth: '300px' }}>
                Your active repetition stack has no pending cards. Add new concepts using the "Add Card" button.
              </p>
            </GlassCard>
          )}
        </div>

        {/* Right Stack Stats & Custom Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {showAddCard ? (
            <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
              <h3 style={{ fontSize: '1.15rem' }}>Create Card</h3>
              <form onSubmit={handleCreateCard} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Front Side (Question / Concept)</label>
                  <textarea 
                    className="glass-textarea" 
                    rows={2} 
                    required 
                    value={newFront} 
                    onChange={(e) => setNewFront(e.target.value)} 
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Back Side (Answer / Summary)</label>
                  <textarea 
                    className="glass-textarea" 
                    rows={2} 
                    required 
                    value={newBack} 
                    onChange={(e) => setNewBack(e.target.value)} 
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Category</label>
                  <select className="glass-select" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                    <option value="DSA">DSA</option>
                    <option value="System Design">System Design</option>
                    <option value="HR">HR / Behavioral</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Card</button>
              </form>
            </GlassCard>
          ) : (
            <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Stack Metrics</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Cards in Stack:</span>
                <span style={{ fontWeight: 'bold' }}>{flashcards.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Due Reviews today:</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-purple)' }}>{dueCards.length}</span>
              </div>

              <hr style={{ borderColor: 'var(--glass-border)' }} />

              <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Revision Spaced Schedule</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                PrepAI uses SuperMemo SM-2 algorithms simulator. Correct responses extend intervals; incorrect reviews reset intervals to 1 day.
              </p>
            </GlassCard>
          )}

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1.8fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
};
export default Flashcards;
