// Local AI Simulation Engine for Mock Interview, Speech, and coding evaluations

// 1. Text to Speech (TTS)
export const speakText = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      resolve();
      return;
    }

    // Cancel current speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to pick a premium English voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferred = voices.find(v => 
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft')) && 
        v.lang.startsWith('en')
      );
      if (preferred) {
        utterance.voice = preferred;
      } else {
        const enVoice = voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      }
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    
    window.speechSynthesis.speak(utterance);
  });
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

// 2. Speech to Text (STT) Recognition
export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  startListening(onResult: (text: string) => void, onError: (err: any) => void, onEnd: () => void) {
    if (!this.recognition) {
      onError('Speech Recognition not supported in this browser. Please type your response.');
      return;
    }

    if (this.isListening) return;

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      onError(e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }
}

// 3. AI Evaluation Simulator
export interface AIResult {
  score: number;
  feedback: string;
  betterAnswer: string;
  confidenceRating: number; // 0-100
  communicationRating: number; // 1-10
  technicalRating: number; // 1-10
}

export const evaluateInterviewAnswer = async (
  _question: string,
  userAnswer: string,
  category: string
): Promise<AIResult> => {
  // Try to evaluate using the FastAPI backend if running
  try {
    const response = await fetch('http://localhost:8000/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: _question, answer: userAnswer, category })
    });
    if (response.ok) {
      const data = await response.json();
      return {
        score: data.score,
        feedback: data.feedback,
        betterAnswer: data.better_answer || data.betterAnswer || '',
        confidenceRating: data.confidence_rating || data.confidenceRating || 80,
        communicationRating: data.communication_rating || data.communicationRating || 8,
        technicalRating: data.technical_rating || data.technicalRating || 8
      };
    }
  } catch (e) {
    console.warn('FastAPI backend offline, falling back to client-side simulator.');
  }

  // Simulate network delay for local mode
  await new Promise(resolve => setTimeout(resolve, 2000));

  const trimmed = userAnswer.trim();
  if (trimmed.length < 5) {
    return {
      score: 15,
      feedback: 'The answer is too brief or empty. Please elaborate on your project or structural explanation.',
      betterAnswer: 'Try structuring your response. Start by explaining the core concept, provide a practical example, and explain the result/benefit.',
      confidenceRating: 20,
      communicationRating: 2,
      technicalRating: 1
    };
  }

  // Basic word count & keyword density parsing to generate a dynamic score
  const wordCount = trimmed.split(/\s+/).length;
  const keywords = ['scale', 'database', 'optimize', 'cache', 'complexity', 'thread', 'synchronized', 'redundancy', 'index', 'performance', 'star', 'situation', 'action', 'result', 'leadership', 'team', 'resolved', 'experience'];
  const matchedKeywords = keywords.filter(kw => trimmed.toLowerCase().includes(kw));

  let score = 55 + Math.min(25, wordCount / 5); // Base score from word count
  score += matchedKeywords.length * 4; // Add keyword score
  score = Math.min(98, Math.max(20, Math.round(score)));

  let communication = Math.min(10, Math.round(3 + (wordCount / 20)));
  if (trimmed.includes('uh') || trimmed.includes('like') && wordCount > 40) {
    communication = Math.max(4, communication - 1);
  }

  let technical = Math.min(10, Math.round(2 + matchedKeywords.length + (wordCount > 30 ? 2 : 0)));
  let confidence = Math.min(100, Math.round(50 + (communication * 4) + (matchedKeywords.length * 3)));

  // Custom feedback generator
  let feedback = 'You explained the core points well. However, you could improve by structure-mapping your explanation. ';
  if (matchedKeywords.length === 0) {
    feedback += 'Adding key industry technical terms like "latency", "caching", or "scalability" would make your response much stronger.';
  } else {
    feedback += `Great job incorporating terminology such as: ${matchedKeywords.join(', ')}. This shows strong domain knowledge.`;
  }

  let betterAnswer = `Here is a structured template for this question:\n\n"To approach this, I would first define the core challenge. For instance, in my previous project, we had to solve a similar constraint. I implemented a ${matchedKeywords[0] || 'cache'} layer which reduced latency by 40%. The technical trade-off was handling eventual consistency, which we solved by setting a short TTL."`;

  if (category === 'STAR' || category === 'Behavioral') {
    feedback += ' For behavioral evaluations, ensure you clearly detail the specific actions YOU took vs the team.';
    betterAnswer = `Using the STAR Method:\n- Situation: Describe the context (e.g., "Our platform was crashing under 5x load during a promotional event").\n- Task: What was your objective? ("I was tasked with finding the database bottleneck").\n- Action: What did YOU do? ("I implemented a connection pool and index structure").\n- Result: Quantify it! ("This reduced average API response time from 1.2s to 150ms").`;
  }

  return {
    score,
    feedback,
    betterAnswer,
    confidenceRating: confidence,
    communicationRating: communication,
    technicalRating: technical
  };
};

// 4. Code Execution and Review Simulator
export interface CodeEvaluation {
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  output: string;
  timeComplexity: string;
  spaceComplexity: string;
  suggestions: string;
  betterSolution: string;
  testCases: { input: string; expected: string; actual: string; passed: boolean }[];
}

export const runAndReviewCode = async (
  code: string,
  language: string,
  questionId: string
): Promise<CodeEvaluation> => {
  await new Promise(resolve => setTimeout(resolve, 2200));

  const lowerCode = code.toLowerCase();
  
  // Basic mock compilation checks
  if (lowerCode.includes('syntaxerror') || lowerCode.includes('error') && !lowerCode.includes('def ') && !lowerCode.includes('function')) {
    return {
      status: 'Runtime Error',
      output: 'SyntaxError: Unexpected identifier or syntax discrepancy in code formatting.',
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      suggestions: 'Fix language indentation, missing braces, or incorrect type assignments.',
      betterSolution: 'Ensure all loops close and return values are initialized.',
      testCases: []
    };
  }

  // Dynamic feedback depending on code logic
  let hasHashMap = lowerCode.includes('dict') || lowerCode.includes('map') || lowerCode.includes('seen') || lowerCode.includes('hashmap') || lowerCode.includes('object');
  let hasDoubleLoop = lowerCode.includes('for') && (lowerCode.split('for').length > 2 || lowerCode.includes('while') && lowerCode.includes('for'));
  
  let timeComplexity = 'O(N)';
  let spaceComplexity = 'O(N)';
  let status: 'Accepted' | 'Wrong Answer' = 'Accepted';
  let suggestions = 'Excellent solution! You used an optimal lookup mapping.';
  let testCases = [
    { input: '[2, 7, 11, 15], target = 9', expected: '[0, 1]', actual: '[0, 1]', passed: true },
    { input: '[3, 2, 4], target = 6', expected: '[1, 2]', actual: '[1, 2]', passed: true }
  ];

  if (questionId === 'dsa-1') {
    if (hasHashMap) {
      timeComplexity = 'O(N)';
      spaceComplexity = 'O(N)';
      status = 'Accepted';
    } else if (hasDoubleLoop) {
      timeComplexity = 'O(N^2)';
      spaceComplexity = 'O(1)';
      status = 'Accepted';
      suggestions = 'Your solution is correct but sub-optimal (O(N^2) time complexity). Try using a hash map to save visited elements to achieve O(N) time complexity.';
    } else {
      status = 'Wrong Answer';
      testCases[0].actual = '[]';
      testCases[0].passed = false;
      testCases[1].actual = '[]';
      testCases[1].passed = false;
      suggestions = 'Make sure you are calculating the correct complement index and returning values properly.';
    }
  }

  const betterSolution = language === 'python' 
    ? `def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen: return [seen[comp], i]\n        seen[num] = i\n    return []`
    : `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) return [map.get(comp), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}`;

  return {
    status,
    output: status === 'Accepted' ? 'All test cases passed successfully.' : 'Test case failure at indices compilation.',
    timeComplexity,
    spaceComplexity,
    suggestions,
    betterSolution,
    testCases
  };
};
