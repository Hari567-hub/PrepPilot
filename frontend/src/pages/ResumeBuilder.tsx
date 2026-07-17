import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { Plus, Trash, Download, FileText } from 'lucide-react';

interface WorkExp {
  company: string;
  role: string;
  duration: string;
  bullets: string;
}

interface Edu {
  school: string;
  degree: string;
  date: string;
  gpa: string;
}

export const ResumeBuilder: React.FC = () => {
  const { user, addNotification } = useAppStore();
  
  // Resume state models
  const [name, setName] = useState(user?.name || 'John Doe');
  const [title, setTitle] = useState(user?.targetRole || 'Software Engineer');
  const [email, setEmail] = useState(user?.email || 'john.doe@example.com');
  const [phone, setPhone] = useState('+1 555-0199');
  const [summary, setSummary] = useState('Experienced software engineer focused on developing high-throughput web architectures, data structures optimizations, and building modular design panels.');
  const [skills, setSkills] = useState(user?.skills.join(', ') || 'React, TypeScript, Node.js, Python, PostgreSQL, AWS');
  
  const [experience, setExperience] = useState<WorkExp[]>([
    { company: 'TechCorp', role: 'Software Developer', duration: '2024 - Present', bullets: 'Led execution of web client redesign using modular React components.\nImplemented API routing caches decreasing latency by 20%.' }
  ]);

  const [education, setEducation] = useState<Edu[]>([
    { school: 'University of Engineering', degree: 'BS Computer Science', date: '2020 - 2024', gpa: '3.8/4.0' }
  ]);



  const addExperience = () => {
    setExperience([...experience, { company: '', role: '', duration: '', bullets: '' }]);
  };

  const removeExperience = (idx: number) => {
    setExperience(experience.filter((_, i) => i !== idx));
  };

  const updateExp = (idx: number, fields: Partial<WorkExp>) => {
    setExperience(experience.map((exp, i) => i === idx ? { ...exp, ...fields } : exp));
  };

  const addEducation = () => {
    setEducation([...education, { school: '', degree: '', date: '', gpa: '' }]);
  };

  const removeEducation = (idx: number) => {
    setEducation(education.filter((_, i) => i !== idx));
  };

  const updateEdu = (idx: number, fields: Partial<Edu>) => {
    setEducation(education.map((edu, i) => i === idx ? { ...edu, ...fields } : edu));
  };

  const handlePrintExport = () => {
    // Generate clean printable HTML representation in a new browser frame
    const win = window.open('', '_blank');
    if (!win) {
      addNotification('Popup blocked! Please allow popups to export.', 'warning');
      return;
    }

    const compiledHtml = `
      <html>
        <head>
          <title>${name} - Resume</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #222; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 26px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; color: #111; }
            .title { font-size: 16px; color: #555; margin-bottom: 20px; font-weight: bold; }
            .contact { font-size: 13px; color: #777; margin-bottom: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
            .section-title { font-size: 14px; text-transform: uppercase; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; margin-top: 30px; margin-bottom: 15px; font-weight: bold; }
            .summary { font-size: 13px; line-height: 1.6; color: #333; }
            .item { margin-bottom: 20px; }
            .item-header { display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; color: #111; margin-bottom: 6px; }
            .item-sub { color: #555; font-size: 12px; margin-bottom: 6px; }
            .bullets { font-size: 13px; color: #333; line-height: 1.6; padding-left: 20px; }
            .skills { font-size: 13px; line-height: 1.6; color: #333; }
          </style>
        </head>
        <body>
          <h1>${name}</h1>
          <div class="title">${title}</div>
          <div class="contact">Email: ${email} | Phone: ${phone}</div>
          
          <div class="section-title">Professional Summary</div>
          <div class="summary">${summary}</div>
          
          <div class="section-title">Work Experience</div>
          ${experience.map(exp => `
            <div class="item">
              <div class="item-header">
                <span>${exp.role} - ${exp.company}</span>
                <span>${exp.duration}</span>
              </div>
              <ul class="bullets">
                ${exp.bullets.split('\n').map(b => b.trim() ? `<li>${b}</li>` : '').join('')}
              </ul>
            </div>
          `).join('')}
          
          <div class="section-title">Education</div>
          ${education.map(edu => `
            <div class="item">
              <div class="item-header">
                <span>${edu.degree} - ${edu.school}</span>
                <span>${edu.date}</span>
              </div>
              <div class="item-sub">GPA: ${edu.gpa}</div>
            </div>
          `).join('')}

          <div class="section-title">Core Skills</div>
          <div class="skills">${skills}</div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    win.document.write(compiledHtml);
    win.document.close();
    addNotification('Print & PDF export triggered in new window!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Resume Builder</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Draft coordinates dynamically and print out a formatted ATS-compliant layout.</p>
        </div>
        <button onClick={handlePrintExport} className="btn btn-primary" style={{ gap: '8px' }}>
          <Download size={16} /> Export PDF Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* Editor Form Columns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '75vh', overflowY: 'auto', paddingRight: '6px' }}>
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--accent-blue)" /> Contact & Role
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input type="text" className="glass-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Professional Title</label>
                <input type="text" className="glass-input" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input type="email" className="glass-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input type="text" className="glass-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Professional Summary</label>
              <textarea className="glass-textarea" rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} style={{ resize: 'none' }} />
            </div>
          </GlassCard>

          {/* Work Experience */}
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Work History</h3>
              <button onClick={addExperience} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }}>
                <Plus size={14} /> Add Role
              </button>
            </div>

            {experience.map((exp, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid var(--glass-border)',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Company name" 
                    className="glass-input" 
                    value={exp.company}
                    onChange={(e) => updateExp(idx, { company: e.target.value })}
                  />
                  <input 
                    type="text" 
                    placeholder="Job Title" 
                    className="glass-input" 
                    value={exp.role}
                    onChange={(e) => updateExp(idx, { role: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.5fr', gap: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Duration (e.g. 2022 - Present)" 
                    className="glass-input" 
                    value={exp.duration}
                    onChange={(e) => updateExp(idx, { duration: e.target.value })}
                  />
                  <button onClick={() => removeExperience(idx)} className="btn btn-danger" style={{ padding: '0', height: '44px' }}>
                    <Trash size={16} />
                  </button>
                </div>
                <textarea 
                  placeholder="Achievement bullet points (one per line)..." 
                  className="glass-textarea" 
                  rows={3} 
                  value={exp.bullets}
                  onChange={(e) => updateExp(idx, { bullets: e.target.value })}
                  style={{ resize: 'none' }}
                />
              </div>
            ))}
          </GlassCard>

          {/* Education Form */}
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Education Details</h3>
              <button onClick={addEducation} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }}>
                <Plus size={14} /> Add Education
              </button>
            </div>

            {education.map((edu, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid var(--glass-border)',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="School / University" 
                    className="glass-input" 
                    value={edu.school}
                    onChange={(e) => updateEdu(idx, { school: e.target.value })}
                  />
                  <input 
                    type="text" 
                    placeholder="Degree Name" 
                    className="glass-input" 
                    value={edu.degree}
                    onChange={(e) => updateEdu(idx, { degree: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.5fr', gap: '12px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    placeholder="Graduation date" 
                    className="glass-input" 
                    value={edu.date}
                    onChange={(e) => updateEdu(idx, { date: e.target.value })}
                  />
                  <input 
                    type="text" 
                    placeholder="GPA (e.g. 3.9/4.0)" 
                    className="glass-input" 
                    value={edu.gpa}
                    onChange={(e) => updateEdu(idx, { gpa: e.target.value })}
                  />
                  <button onClick={() => removeEducation(idx)} className="btn btn-danger" style={{ padding: '0', height: '44px' }}>
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </GlassCard>

          {/* Core Skills Form */}
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Skills Inventory</h3>
            <div className="input-group">
              <label className="input-label">Core Skills (Comma separated)</label>
              <input 
                type="text" 
                className="glass-input" 
                value={skills} 
                onChange={(e) => setSkills(e.target.value)} 
                placeholder="e.g. React, Python, C++, Docker"
              />
            </div>
          </GlassCard>
        </div>

        {/* Live Preview Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard style={{
            background: '#fff',
            color: '#111',
            borderRadius: '8px',
            padding: '30px',
            boxShadow: 'var(--card-shadow)',
            minHeight: '650px',
            fontFamily: 'Helvetica, Arial, sans-serif'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#111', fontSize: '1.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{name}</h2>
              <span style={{ fontSize: '0.9rem', color: '#555', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>{title}</span>
              <span style={{ fontSize: '0.8rem', color: '#777', display: 'block', marginTop: '6px' }}>
                {email} &nbsp;|&nbsp; {phone}
              </span>
            </div>

            <hr style={{ borderColor: '#ddd', margin: '15px 0' }} />

            {/* Summary */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#3b82f6', borderBottom: '1px solid #ddd', paddingBottom: '3px', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Summary</h4>
              <p style={{ color: '#333', fontSize: '0.8rem', lineHeight: '1.5', margin: 0 }}>{summary}</p>
            </div>

            {/* Experience */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#3b82f6', borderBottom: '1px solid #ddd', paddingBottom: '3px', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px' }}>Experience</h4>
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', color: '#111' }}>
                    <span>{exp.role || 'Role Title'}</span>
                    <span>{exp.duration || 'Duration'}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#555', fontStyle: 'italic', marginBottom: '4px' }}>{exp.company || 'Company'}</div>
                  <ul style={{ paddingLeft: '15px', margin: 0, fontSize: '0.75rem', color: '#333', lineHeight: '1.5' }}>
                    {exp.bullets.split('\n').map((b, idx) => b.trim() ? <li key={idx}>{b}</li> : null)}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#3b82f6', borderBottom: '1px solid #ddd', paddingBottom: '3px', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px' }}>Education</h4>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', color: '#111' }}>
                    <span>{edu.degree || 'Degree name'}</span>
                    <span>{edu.date || 'Date'}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#555' }}>{edu.school || 'School'} {edu.gpa && `| GPA: ${edu.gpa}`}</div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h4 style={{ color: '#3b82f6', borderBottom: '1px solid #ddd', paddingBottom: '3px', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Skills</h4>
              <p style={{ color: '#333', fontSize: '0.8rem', lineHeight: '1.5', margin: 0 }}>{skills}</p>
            </div>

          </GlassCard>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1.2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default ResumeBuilder;
