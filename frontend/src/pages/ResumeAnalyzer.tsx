import React, { useState } from 'react';
import useAppStore from '../store/appStore';
import GlassCard from '../components/GlassCard';
import { analyzeResumePDF, generateResumeReportText } from '../utils/resumeParser';
import { FileUp, RefreshCw, AlertTriangle, CheckCircle, Download, FileText } from 'lucide-react';

export const ResumeAnalyzer: React.FC = () => {
  const { user, addNotification } = useAppStore();
  const [role, setRole] = useState(user?.targetRole || 'Software Engineer');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setAnalysis(null);
    }
  };

  const startAnalysis = async () => {
    if (!file) {
      addNotification('Please select a resume file to upload.', 'warning');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await analyzeResumePDF(file.name, role);
      setAnalysis(res);
      addNotification('ATS Score Analysis completed!', 'success');
    } catch (e) {
      addNotification('CV analysis failed. Please try again.', 'warning');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!analysis || !file) return;
    const text = generateResumeReportText(file.name, role, analysis);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ats_report_${file.name.split('.')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addNotification('Report downloaded successfully!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>ATS Resume Analyzer</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Identify formatting issues, improve grammar action-verbs, and match target keywords.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Upload & Setup */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Upload Document</h3>

            <div className="input-group">
              <label className="input-label">Target Role Match</label>
              <select className="glass-select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="ML Engineer">ML Engineer</option>
                <option value="Product Manager">Product Manager</option>
              </select>
            </div>

            {/* Drop Zone */}
            <div style={{
              border: '2px dashed var(--glass-border)',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.01)',
              transition: 'all 0.25s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            >
              <input 
                type="file" 
                accept=".pdf,.docx" 
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <FileUp size={36} style={{ color: 'var(--accent-purple)' }} />
                {file ? (
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{file.name}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ) : (
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Click or Drag PDF Resume</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF or DOCX (Max 5MB)</span>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={startAnalysis}
              disabled={isAnalyzing || !file}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', gap: '8px' }}
            >
              {isAnalyzing ? <RefreshCw size={16} className="animate-spin" /> : <FileText size={16} />}
              <span>{isAnalyzing ? 'Analyzing Layout...' : 'Analyze Compatibility'}</span>
            </button>
          </GlassCard>
        </div>

        {/* Results Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isAnalyzing ? (
            <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.05)',
                borderTopColor: 'var(--accent-blue)',
                animation: 'spin 1s linear infinite'
              }} />
              <div>
                <h4 style={{ textAlign: 'center' }}>Extracting semantic text arrays...</h4>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Scanning margins, action-verb density, and grammar structures.
                </p>
              </div>
            </GlassCard>
          ) : analysis ? (
            <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* ATS Header Score */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>ATS Match Profile</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Targeting: <strong>{role}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{analysis.atsScore} / 100</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score Estimate</span>
                  </div>
                  <button onClick={downloadReport} className="btn btn-secondary" style={{ padding: '8px 12px', gap: '6px' }}>
                    <Download size={14} /> Download Report
                  </button>
                </div>
              </div>

              {/* Progress visual bar */}
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  width: `${analysis.atsScore}%`,
                  height: '100%',
                  background: 'var(--primary-gradient)',
                  borderRadius: '999px'
                }} />
              </div>

              {/* Grid: Keywords vs Grammar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* Keywords */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={16} color="var(--accent-yellow)" /> Missing Keywords
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {analysis.missingKeywords.map((kw: string, i: number) => (
                      <span key={i} style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        color: '#fbbf24',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 500
                      }}>{kw}</span>
                    ))}
                  </div>
                </div>

                {/* Grammar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={16} color="var(--accent-green)" /> Readability Improvements
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {analysis.grammarIssues.map((g: any, i: number) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
                        <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{g.issue}</div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>→ {g.suggestion}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Formatting & Improvement list */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>Formatting Issues</h4>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {analysis.formattingSuggestions.map((f: string, i: number) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>CV Optimization Tips</h4>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {analysis.improvementTips.map((tip: string, i: number) => <li key={i}>{tip}</li>)}
                  </ul>
                </div>
              </div>

            </GlassCard>
          ) : (
            <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <FileText size={48} style={{ color: 'var(--text-muted)' }} />
              <h4 style={{ color: 'var(--text-muted)' }}>Resume Analysis report pending</h4>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '320px' }}>
                Configure target roles, upload your CV in docx/pdf, and run analysis scanner.
              </p>
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
export default ResumeAnalyzer;
