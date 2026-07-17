import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { Volume2, Save } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile, addNotification } = useAppStore();

  const [name, setName] = useState(user?.name || '');
  const [targetCompany, setTargetCompany] = useState(user?.targetCompany || 'Google');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Engineer');
  const [experience, setExperience] = useState(user?.experience || 'Fresher');
  const [skillsStr, setSkillsStr] = useState(user?.skills.join(', ') || '');

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      targetCompany,
      targetRole,
      experience,
      skills: skillsStr.split(',').map(s => s.trim()).filter(Boolean)
    });
    addNotification('Profile changes saved successfully!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>User settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal details, target recruiter thresholds, and technical settings.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Left Side Avatar Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', textAlign: 'center' }}>
            <img 
              src={user?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg'} 
              alt="Avatar Profile" 
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                border: '2px solid var(--accent-purple)',
                background: 'var(--bg-secondary)',
                padding: '4px'
              }}
            />
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>{user?.name}</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</span>
            </div>
            <hr style={{ width: '100%', borderColor: 'var(--glass-border)' }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Preparing for: <strong>{user?.targetCompany}</strong>
            </div>
          </GlassCard>
        </div>

        {/* Right Side Settings Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Personal Credentials</h3>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input type="text" className="glass-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="input-group">
                  <label className="input-label">Dream Company</label>
                  <select className="glass-select" value={targetCompany} onChange={(e) => setTargetCompany(e.target.value)}>
                    <option value="Google">Google</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Microsoft">Microsoft</option>
                    <option value="TCS">TCS</option>
                    <option value="Infosys">Infosys</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Target Role</label>
                  <select className="glass-select" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="ML Engineer">ML Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="input-group">
                  <label className="input-label">Experience Tier</label>
                  <select className="glass-select" value={experience} onChange={(e) => setExperience(e.target.value as 'Fresher' | 'Experienced')}>
                    <option value="Fresher">Fresher (Entry Level)</option>
                    <option value="Experienced">Experienced (Senior)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Skills (Comma separated list)</label>
                  <input type="text" className="glass-input" value={skillsStr} onChange={(e) => setSkillsStr(e.target.value)} />
                </div>
              </div>

              <hr style={{ borderColor: 'var(--glass-border)' }} />

              <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Preferences</h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Volume2 size={18} color="var(--accent-purple)" />
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Voice synthesizers sounds</h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Play voice questions audio automatically.</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={soundEnabled} 
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', gap: '8px', width: 'fit-content', marginLeft: 'auto' }}>
                <Save size={16} /> Save Settings
              </button>
            </form>
          </GlassCard>
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
export default Profile;
