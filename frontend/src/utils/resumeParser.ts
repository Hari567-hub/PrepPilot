export interface ResumeAnalysis {
  atsScore: number;
  extractedText: string;
  missingKeywords: string[];
  grammarIssues: { issue: string; suggestion: string }[];
  formattingSuggestions: string[];
  improvementTips: string[];
  recruiterPerspective: string;
  companyFeedback: string;
  missingSkills: string[];
}

export const analyzeResumePDF = async (
  fileName: string,
  targetRole: string
): Promise<ResumeAnalysis> => {
  // Simulate text processing delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Determine scoring based on file name or role
  let atsScore = 65;
  if (fileName.toLowerCase().includes('cv') || fileName.toLowerCase().includes('resume')) {
    atsScore += 12;
  }
  if (fileName.endsWith('.pdf')) {
    atsScore += 5; // Extra points for PDF formatting
  }
  atsScore = Math.min(95, atsScore);

  const missingKeywordsMap: Record<string, string[]> = {
    'Software Engineer': ['Docker', 'CI/CD Pipelines', 'Kubernetes', 'Redis', 'Unit Testing', 'System Design'],
    'Data Analyst': ['SQL Queries', 'Tableau', 'PowerBI', 'Python Pandas', 'Data Cleansing', 'A/B Testing'],
    'ML Engineer': ['PyTorch', 'TensorFlow', 'Model Deployment', 'Feature Engineering', 'Scikit-Learn', 'MLOps'],
    'Product Manager': ['Roadmapping', 'Agile/Scrum', 'User Personas', 'KPI Metrics', 'Market Research']
  };

  const missingKeywords = missingKeywordsMap[targetRole] || ['Docker', 'Cloud Architecture', 'TypeScript', 'Agile'];

  const missingSkills = targetRole === 'Software Engineer' 
    ? ['Go / Rust programming', 'GraphQL / gRPC architecture', 'Distributed caching (Redis/Memcached)']
    : ['Data warehousing concepts', 'Statistical analysis models', 'ETL pipelines setup'];

  const grammarIssues = [
    { issue: 'Passive voice: "Project was finished on time..."', suggestion: 'Change to active voice: "Led project execution and delivered on schedule."' },
    { issue: 'Repetitive action verb: Used "Responsible for" 4 times.', suggestion: 'Use diverse action verbs like "Spearheaded", "Engineered", "Optimized", "Architected".' }
  ];

  const formattingSuggestions = [
    'Ensure all dates are right-aligned to save vertical spacing.',
    'Use bullet points instead of long paragraphs for standard job achievements.',
    'Remove decorative icons or multi-column grids if targeting strict enterprise ATS scanners.'
  ];

  const improvementTips = [
    `Inject missing industry standard keywords: ${missingKeywords.slice(0, 3).join(', ')}.`,
    'Quantify accomplishments: Replace "Improved app speed" with "Optimized backend algorithms to reduce latency by 35%".',
    'Include a dedicated Skills section grouped by technology (Languages, Frameworks, Tools).'
  ];

  const recruiterPerspective = `
  The candidate shows a solid academic foundation in computer science and initial developer experience. However, the resume layout is overly description-heavy. Hiring managers at major tech companies look for business impact (e.g. latency reductions, dollars saved, user engagement boosts) rather than listing general responsibilities. Standardizing action verbs will instantly elevate readability.
  `;

  const companyFeedback = `
  For top tier companies, this resume needs a significant boost in infrastructure ownership. Specifically, highlight experiences using containerization platforms (Docker/K8s) and cloud integrations. There is also a lack of system architecture depth—mentioning how data consistency or service boundaries were managed would align better with their standard hiring bar.
  `;

  const extractedText = `
  John Doe
  Email: john.doe@example.com | Phone: +1 555-0199
  OBJECTIVE
  Motivated engineer seeking a ${targetRole} role.
  
  EXPERIENCE
  Software Developer at TechCorp (2024 - Present)
  - Responsible for writing Javascript code and maintaining backend.
  - Project was finished on time and team was managed.
  
  EDUCATION
  BS in Computer Science, University of Technology (GPA: 3.8/4.0)
  
  SKILLS
  JavaScript, HTML, CSS, Git, Node.js, SQL.
  `;

  return {
    atsScore,
    extractedText,
    missingKeywords,
    grammarIssues,
    formattingSuggestions,
    improvementTips,
    recruiterPerspective,
    companyFeedback,
    missingSkills
  };
};

export const generateResumeReportText = (filename: string, role: string, analysis: ResumeAnalysis): string => {
  return `
==================================================
        INTERVIEWPREP AI: ATS ANALYSIS REPORT
==================================================
Document: ${filename}
Target Role: ${role}
ATS Match Rating: ${analysis.atsScore} / 100

--------------------------------------------------
1. KEYWORD ANALYSIS
--------------------------------------------------
Missing core keywords:
${analysis.missingKeywords.map(kw => `- ${kw}`).join('\n')}

--------------------------------------------------
2. GRAMMAR & READABILITY ISSUES
--------------------------------------------------
${analysis.grammarIssues.map(g => `* Issue: ${g.issue}\n  Suggestion: ${g.suggestion}`).join('\n\n')}

--------------------------------------------------
3. ATS FORMATTING EVALUATIONS
--------------------------------------------------
${analysis.formattingSuggestions.map(f => `- ${f}`).join('\n')}

--------------------------------------------------
4. RE-STRUCTURING ACTION PLAN
--------------------------------------------------
${analysis.improvementTips.map(i => `- ${i}`).join('\n')}

--------------------------------------------------
5. RECRUITER PERSPECTIVE & INSIGHTS
--------------------------------------------------
${analysis.recruiterPerspective.trim()}

--------------------------------------------------
6. COMPANY SPECIFIC ALIGNMENT FEEDBACK
--------------------------------------------------
${analysis.companyFeedback.trim()}

Report compiled by InterviewPrep AI on ${new Date().toLocaleDateString()}.
==================================================
  `;
};
