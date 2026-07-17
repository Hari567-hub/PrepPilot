export interface CompanyPrep {
  id: string;
  name: string;
  logo: string;
  process: string[];
  faqs: { q: string; a: string }[];
  recentQuestions: string[];
  salaryRange: string;
  tips: string[];
}

export interface DSAQuestion {
  id: string;
  title: string;
  topic: 'Arrays' | 'Strings' | 'Linked Lists' | 'Trees' | 'Graphs' | 'Dynamic Programming' | 'Sorting';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  companies: string[];
  description: string;
  hints: string[];
  solution: string;
  visualization: string[];
}

export interface AptitudeQuestion {
  id: string;
  category: 'Quantitative' | 'Logical' | 'Verbal';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SystemDesignScenario {
  id: string;
  title: string;
  problem: string;
  requirements: string[];
  keyComponents: string[];
  bestPractices: string[];
}

export interface HRQuestion {
  id: string;
  question: string;
  category: string;
  purpose: string;
  sampleAnswer: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  nextReviewDate: string; // ISO String
  intervalDays: number;
}

export const COMPANIES_PREP: CompanyPrep[] = [
  {
    id: 'google',
    name: 'Google',
    logo: 'G',
    process: [
      'Online Assessment (2 coding questions, 45-60 mins)',
      'Technical Phone Screen (1-2 rounds, algorithmic problem solving)',
      'Onsite Rounds (3-4 Coding rounds, 1 System Design round)',
      'Googleyness & Leadership round (behavioral, STAR based)'
    ],
    faqs: [
      { q: 'How heavy is Google on dynamic programming?', a: 'Google asks DP occasionally, but strongly prioritizes graphs, trees, arrays, search algorithms, and system design for senior roles.' },
      { q: 'Are design patterns important?', a: 'Yes, especially for systems and API design. Demonstrating solid object-oriented design and clean structuring is highly valued.' }
    ],
    recentQuestions: [
      'Find the longest path in a binary tree with a maximum of one turning point.',
      'Design a system to support high-throughput log writing and search.',
      'Implement an efficient autocomplete system for search terms.'
    ],
    salaryRange: '$120,000 - $340,000+',
    tips: [
      'Talk out loud while solving. Explain your thought process, trade-offs, and space/time complexities.',
      'Start with a simple brute-force approach first, then optimize. Never jump straight to code.',
      'Test your code with boundary cases and empty values before stating you are done.'
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'A',
    process: [
      'Online Coding Assessment & Work Style Simulation',
      'Technical Phone Interview (1-2 coding problems)',
      'Onsite Loop (4-5 interviews focusing heavily on Leadership Principles and Coding/Design)'
    ],
    faqs: [
      { q: 'What is the most important part of Amazon interviews?', a: 'Amazon Leadership Principles. Roughly 50% of the onsite evaluation is behavioral, mapped directly to their 16 principles.' },
      { q: 'Should I expect system design?', a: 'Yes, for any role above Level 4 (Software Engineer II and above), at least one System Design round is standard.' }
    ],
    recentQuestions: [
      'Find the K closest points to the origin in a 2D plane.',
      'Design a distributed caching system for retail item availability.',
      'Merge K sorted lists into a single sorted list.'
    ],
    salaryRange: '$110,000 - $290,000+',
    tips: [
      'Memorize Amazon Leadership Principles and prepare at least 2 stories for each using the STAR method.',
      'Show high bias for action and customer obsession in your behavioral scenarios.',
      'Be ready for follow-ups asking how you would scale your solution globally.'
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'M',
    process: [
      'Initial Screening / Campus Round (coding questions)',
      'Technical Phone Interview',
      'Onsite Interviews (3-4 technical coding & system design rounds + 1 manager discussion)'
    ],
    faqs: [
      { q: 'Is Microsoft open to languages other than C#?', a: 'Absolutely. You can code in Python, Java, C++, or JavaScript. Your logic and computer science fundamentals are what they grade.' },
      { q: 'Does Microsoft ask system design questions to freshers?', a: 'Usually basic object-oriented design (OOD) or system design concepts are asked, but full-scale system design is reserved for experienced candidates.' }
    ],
    recentQuestions: [
      'Serialize and deserialize a binary tree.',
      'Implement an LRU cache with O(1) operations.',
      'Detect and remove loops in a singly linked list.'
    ],
    salaryRange: '$115,000 - $310,000+',
    tips: [
      'Focus on strong software engineering practices, testing, and handling edge cases.',
      'Microsoft loves detail-oriented developers; double-check pointers and reference operations.',
      'Show eagerness to learn new technologies and align with team collaboration.'
    ]
  }
];

export const DSA_QUESTIONS: DSAQuestion[] = [
  {
    id: 'dsa-1',
    title: 'Two Sum',
    topic: 'Arrays',
    difficulty: 'Easy',
    companies: ['Google', 'Amazon', 'Microsoft'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    hints: [
      'Try a brute-force search checking all pairs. What is the time complexity? O(N^2).',
      'Can we optimize this by remembering visited values? Think about using a hash map.',
      'For each number, calculate the target complement and look it up in the hash map.'
    ],
    solution: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    visualization: [
      'Array: [2, 7, 11, 15], Target: 9',
      'Step 1: num = 2. Complement = 9 - 2 = 7. Not in map. Store {2: 0}',
      'Step 2: num = 7. Complement = 9 - 7 = 2. Found 2 in map! Index is 0.',
      'Result: [0, 1]'
    ]
  },
  {
    id: 'dsa-2',
    title: 'Valid Parentheses',
    topic: 'Strings',
    difficulty: 'Easy',
    companies: ['Amazon', 'Facebook', 'Bloomberg'],
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets and closed in the correct order.',
    hints: [
      'Use a stack data structure to keep track of open brackets.',
      'Whenever you encounter a closing bracket, check if it matches the bracket on top of the stack.',
      'If the stack is empty at the end, the string is valid.'
    ],
    solution: `def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack`,
    visualization: [
      'Input: "()[]{}"',
      '1. Push "(" -> Stack: ["("]',
      '2. Encounter ")". Pop stack matches "(". Stack: []',
      '3. Push "[" -> Stack: ["["]',
      '4. Encounter "]". Pop stack matches "[". Stack: []',
      'Valid!'
    ]
  },
  {
    id: 'dsa-3',
    title: 'Longest Substring Without Repeating Characters',
    topic: 'Strings',
    difficulty: 'Medium',
    companies: ['Google', 'Amazon', 'TCS'],
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    hints: [
      'We can use a sliding window with two pointers representing the current substring limits.',
      'Maintain a set or hash map of characters present in the window.',
      'Advance the right pointer to expand, and shrink the window from the left if a repeat character is seen.'
    ],
    solution: `def lengthOfLongestSubstring(s):
    char_map = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
    visualization: [
      'Input: "abcabcbb"',
      'Start: left = 0, right = 0. Window "a". Max length = 1.',
      'right = 1. Window "ab". Max length = 2.',
      'right = 2. Window "abc". Max length = 3.',
      'right = 3. Char "a" seen. Move left to index of first "a" + 1 = 1. Window "bca". Max = 3.'
    ]
  }
];

export const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 'apt-1',
    category: 'Quantitative',
    question: 'A train 125 m long passes a telegraph post in 9 seconds. What is the speed of the train in km/hr?',
    options: ['45 km/hr', '50 km/hr', '55 km/hr', '60 km/hr'],
    correctIndex: 1,
    explanation: 'Speed = Distance / Time = 125 / 9 m/sec.\nTo convert to km/hr, multiply by 18/5.\nSpeed = (125 / 9) * (18 / 5) = 50 km/hr.'
  },
  {
    id: 'apt-2',
    category: 'Logical',
    question: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
    options: ['1/3', '1/8', '2/8', '1/16'],
    correctIndex: 1,
    explanation: 'This is a geometric series where each term is half of the previous term. The term after 1/4 is (1/4) * (1/2) = 1/8.'
  },
  {
    id: 'apt-3',
    category: 'Verbal',
    question: 'Choose the word that is most nearly opposite in meaning to "ABANDON".',
    options: ['Relinquish', 'Forfeit', 'Retain', 'Surrender'],
    correctIndex: 2,
    explanation: 'Abandon means to give up or leave completely. The opposite is Retain, which means to keep possession of.'
  }
];

export const SYSTEM_DESIGN_SCENARIOS: SystemDesignScenario[] = [
  {
    id: 'sys-1',
    title: 'URL Shortener (e.g., Bitly)',
    problem: 'Design a system that can generate short aliases for long URLs and redirect users to the original URL when the short link is accessed.',
    requirements: [
      'High availability (redirects should be extremely fast).',
      'URLs should be unique and guess-resistant.',
      'Scalable to billions of shortened URLs.',
      'Provide basic usage analytics for links.'
    ],
    keyComponents: [
      'Write API servers (accepting long URL, returning shortened URL).',
      'Read/Redirect API servers (heavy cache optimization).',
      'Hash generation service (Base62 encoding + distributed range manager).',
      'NoSQL database (e.g., Cassandra/DynamoDB) to map hash to original URL.',
      'Redis Cache (LRU policy) for frequently accessed short URLs.'
    ],
    bestPractices: [
      'Put cache in front of DB to handle read peaks.',
      'Use a multi-region CDN for redirect nodes.',
      'Clean up expired URLs using a background worker daemon.'
    ]
  },
  {
    id: 'sys-2',
    title: 'Video Streaming Service (e.g., Netflix)',
    problem: 'Design a scalable online movie/video streaming service where millions of users can search and watch videos simultaneously on different screen sizes.',
    requirements: [
      'Low latency playback and minimal buffering.',
      'Support adaptive bit-rate streaming (adjust quality dynamically based on network bandwidth).',
      'Handles huge files (4K, 1080p, etc.).',
      'Support multi-device resume points.'
    ],
    keyComponents: [
      'Media ingestion worker fleet (encoding videos into multiple resolutions).',
      'Content Delivery Network (CDN) to store and distribute media chunks globally.',
      'User metadata database (PostgreSQL for user profiles/billing, Cassandra for viewing history).',
      'Metadata cache (Redis) for trending titles and playback cursor positions.',
      'API gateway for recommendation engines and authorization.'
    ],
    bestPractices: [
      'Break movies into small 5-second chunks for optimized loading.',
      'Store high-traffic thumbnails close to the user using Edge CDNs.',
      'Implement circuit breakers to keep catalog browsing working even if video servers have issues.'
    ]
  }
];

export const HR_QUESTIONS: HRQuestion[] = [
  {
    id: 'hr-1',
    question: 'Tell me about yourself.',
    category: 'Introduction',
    purpose: 'Understand your background, career achievements, and how well you communicate.',
    sampleAnswer: 'Start with a brief outline of your current position and a major win, then pivot to how your background fits this role, and end on why you want to work at this specific company.'
  },
  {
    id: 'hr-2',
    question: 'What are your greatest strengths?',
    category: 'Competency',
    purpose: 'Determine if your strengths align with the job requirements and if you are self-aware.',
    sampleAnswer: 'Choose 1-2 traits (e.g., rapid problem solving, system thinking) and give a brief story showing how you applied this strength to deliver a massive positive result.'
  },
  {
    id: 'hr-3',
    question: 'Describe a time you faced a conflict in a team and how you resolved it.',
    category: 'Conflict Resolution',
    purpose: 'Assess emotional intelligence, teamwork, and professional maturity.',
    sampleAnswer: 'Detail a time when you and a colleague disagreed on a technical approach. Highlight how you scheduled a call, focused on objective metrics, ran a small POC, and agreed on the best result without personal animosity.'
  }
];

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'flash-1',
    front: 'What is the time complexity of searching in a Balanced Binary Search Tree (BST)?',
    back: 'O(log N), because each step discards half of the remaining elements.',
    category: 'DSA',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1
  },
  {
    id: 'flash-2',
    front: 'What does the ACID acronym stand for in Databases?',
    back: 'Atomicity, Consistency, Isolation, Durability.',
    category: 'System Design',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1
  },
  {
    id: 'flash-3',
    front: 'Explain the STAR technique for behavioral interviews.',
    back: 'Situation, Task, Action, Result. Structuring answers this way proves concrete outcomes.',
    category: 'HR',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1
  }
];
