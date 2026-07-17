import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { COMPANIES_PREP } from '../utils/mockData';
import type { CompanyPrep } from '../utils/mockData';
import { Building2, Search, ArrowRight, BookOpen, Compass, Award } from 'lucide-react';

export const CompanyPrepPage: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyPrep | null>(COMPANIES_PREP[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCompanies = COMPANIES_PREP.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Company Preparation</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review salary data, interview stages process mapping, and recent questions asked by tier-1 organizations.</p>
      </div>

      {/* Search and Grid Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Company Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search companies..." 
              className="glass-input" 
              style={{ paddingLeft: '36px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredCompanies.map((c) => (
              <GlassCard 
                key={c.id} 
                onClick={() => setSelectedCompany(c)}
                style={{
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderLeft: selectedCompany?.id === c.id ? '4px solid var(--accent-purple)' : '4px solid transparent',
                  background: selectedCompany?.id === c.id ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--primary-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold'
                  }}>{c.logo}</div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{c.name}</h4>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" />
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Company details sheet */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {selectedCompany ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Profile Card */}
              <GlassCard style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '12px',
                    background: 'var(--primary-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                  }}>{selectedCompany.logo}</div>
                  <div>
                    <h2 style={{ fontSize: '1.5rem' }}>{selectedCompany.name}</h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Salary scale: {selectedCompany.salaryRange}</span>
                  </div>
                </div>
                <span className="badge badge-info" style={{ padding: '6px 12px' }}>Interview Guide</span>
              </GlassCard>

              {/* Recruitment stages map */}
              <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Compass size={18} color="var(--accent-purple)" /> Selection Process Pipeline
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '6px' }}>
                  {selectedCompany.process.map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-purple)',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>{idx + 1}</div>
                      <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-primary)' }}>{p}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* FAQs & Recently asked coding questions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* FAQ */}
                <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={16} /> FAQ & Tips
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedCompany.faqs.map((f, i) => (
                      <div key={i} style={{ fontSize: '0.8rem' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Q: {f.q}</div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>A: {f.a}</div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Recent questions */}
                <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={16} /> Recent coding prompts
                  </h4>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedCompany.recentQuestions.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </GlassCard>

              </div>

              {/* Prep Tips */}
              <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Insider Advice</h4>
                <ul style={{ paddingLeft: '16px', fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedCompany.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </GlassCard>

            </div>
          ) : (
            <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={48} style={{ color: 'var(--text-muted)' }} />
              <h4>Select a company to inspect preparation assets</h4>
            </GlassCard>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 2fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default CompanyPrepPage;
