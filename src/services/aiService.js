// AI Service - Mock implementation with realistic questions and evaluation
// In production, replace with actual AI API calls (OpenAI, Claude, etc.)

const FULL_STACK_QUESTIONS = {
  easy: [
    {
      id: 1,
      text: "What is the difference between let, const, and var in JavaScript?",
      difficulty: "easy",
      timeLimit: 20,
      topic: "JavaScript Basics",
      expectedPoints: ["Block scope vs function scope", "Hoisting behavior", "Reassignment rules"]
    },
    {
      id: 2,
      text: "Explain what JSX is and why we use it in React.",
      difficulty: "easy",
      timeLimit: 20,
      topic: "React Basics",
      expectedPoints: ["JavaScript XML", "Syntactic sugar", "Component rendering"]
    },
    {
      id: 3,
      text: "What are the basic HTTP methods and when would you use each?",
      difficulty: "easy",
      timeLimit: 20,
      topic: "HTTP/REST",
      expectedPoints: ["GET, POST, PUT, DELETE", "CRUD operations", "Idempotency"]
    }
  ],
  medium: [
    {
      id: 4,
      text: "Explain the concept of closures in JavaScript with an example.",
      difficulty: "medium",
      timeLimit: 60,
      topic: "JavaScript Advanced",
      expectedPoints: ["Function scope", "Variable access", "Practical example", "Memory implications"]
    },
    {
      id: 5,
      text: "What is the difference between useEffect and useLayoutEffect in React?",
      difficulty: "medium",
      timeLimit: 60,
      topic: "React Hooks",
      expectedPoints: ["Execution timing", "DOM mutations", "Performance implications", "Use cases"]
    },
    {
      id: 6,
      text: "How would you handle authentication in a Node.js application?",
      difficulty: "medium",
      timeLimit: 60,
      topic: "Node.js/Backend",
      expectedPoints: ["JWT tokens", "Session management", "Middleware", "Security considerations"]
    }
  ],
  hard: [
    {
      id: 7,
      text: "Design a system to handle real-time notifications for a social media application. Consider scalability and reliability.",
      difficulty: "hard",
      timeLimit: 120,
      topic: "System Design",
      expectedPoints: ["WebSockets/Server-sent events", "Message queues", "Database design", "Scalability patterns"]
    },
    {
      id: 8,
      text: "Explain the concept of database indexing and how you would optimize a slow query in a large dataset.",
      difficulty: "hard",
      timeLimit: 120,
      topic: "Database Optimization",
      expectedPoints: ["Index types", "Query execution plans", "Performance analysis", "Trade-offs"]
    },
    {
      id: 9,
      text: "How would you implement a rate limiting system for an API? Discuss different algorithms and their trade-offs.",
      difficulty: "hard",
      timeLimit: 120,
      topic: "System Design/APIs",
      expectedPoints: ["Rate limiting algorithms", "Distributed systems", "Storage mechanisms", "Performance considerations"]
    }
  ]
};

/**
 * Generate a question based on question number and difficulty
 * @param {number} questionNumber - The question number (1-6)
 * @param {string} difficulty - easy, medium, or hard
 * @returns {Promise<Object>} - Generated question object
 */
export const generateQuestion = async (questionNumber, difficulty) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const questions = FULL_STACK_QUESTIONS[difficulty];
    if (!questions || questions.length === 0) {
      throw new Error(`No questions available for difficulty: ${difficulty}`);
    }
    
    // Select a random question from the difficulty level
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];
    
    return {
      ...selectedQuestion,
      questionNumber,
      generatedAt: Date.now(),
      timeLimit: selectedQuestion.timeLimit,
    };
  } catch (error) {
    console.error('Error generating question:', error);
    // Fallback question
    return {
      id: questionNumber,
      questionNumber,
      text: "Please describe your experience with full-stack development.",
      difficulty,
      timeLimit: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 60 : 120,
      topic: "General",
      expectedPoints: ["Experience", "Technologies", "Projects"],
      generatedAt: Date.now(),
    };
  }
};

/**
 * Evaluate an answer using AI-like scoring
 * @param {Object} question - The question object
 * @param {string} answer - The candidate's answer
 * @param {string} difficulty - Question difficulty
 * @returns {Promise<Object>} - Evaluation result
 */
export const evaluateAnswer = async (question, answer, difficulty) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    if (!answer || answer.trim().length === 0) {
      return {
        score: 0,
        maxScore: getMaxScore(difficulty),
        feedback: "No answer provided.",
        strengths: [],
        improvements: ["Please provide an answer to demonstrate your knowledge."],
        evaluatedAt: Date.now(),
      };
    }
    
    const evaluation = await mockAIEvaluation(question, answer, difficulty);
    return {
      ...evaluation,
      evaluatedAt: Date.now(),
    };
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return {
      score: 0,
      maxScore: getMaxScore(difficulty),
      feedback: "Error evaluating answer. Please try again.",
      strengths: [],
      improvements: ["Technical error occurred during evaluation."],
      evaluatedAt: Date.now(),
    };
  }
};

/**
 * Mock AI evaluation logic
 * @param {Object} question - Question object
 * @param {string} answer - Candidate answer
 * @param {string} difficulty - Question difficulty
 * @returns {Object} - Evaluation result
 */
const mockAIEvaluation = async (question, answer, difficulty) => {
  const maxScore = getMaxScore(difficulty);
  const answerLength = answer.trim().length;
  const words = answer.toLowerCase().split(/\s+/);
  
  let score = 0;
  const strengths = [];
  const improvements = [];
  
  // Basic scoring based on answer length and content
  if (answerLength < 10) {
    score = Math.max(1, maxScore * 0.1);
    improvements.push("Answer is too brief. Please provide more detailed explanation.");
  } else if (answerLength < 50) {
    score = maxScore * 0.3;
    improvements.push("Consider providing more comprehensive explanation with examples.");
  } else if (answerLength < 150) {
    score = maxScore * 0.6;
    strengths.push("Good explanation provided.");
  } else {
    score = maxScore * 0.8;
    strengths.push("Comprehensive and detailed answer.");
  }
  
  // Check for technical keywords based on question topic
  const technicalKeywords = getTechnicalKeywords(question.topic);
  const mentionedKeywords = technicalKeywords.filter(keyword => 
    words.some(word => word.includes(keyword.toLowerCase()))
  );
  
  if (mentionedKeywords.length > 0) {
    score += (mentionedKeywords.length / technicalKeywords.length) * (maxScore * 0.2);
    strengths.push(`Good use of technical terminology: ${mentionedKeywords.join(', ')}`);
  } else {
    improvements.push("Consider using more specific technical terms related to the topic.");
  }
  
  // Check for expected points
  if (question.expectedPoints) {
    const coveredPoints = question.expectedPoints.filter(point =>
      answer.toLowerCase().includes(point.toLowerCase().split(' ')[0])
    );
    
    if (coveredPoints.length > 0) {
      score += (coveredPoints.length / question.expectedPoints.length) * (maxScore * 0.1);
      strengths.push("Covered key concepts well.");
    } else {
      improvements.push("Consider addressing the core concepts mentioned in the question.");
    }
  }
  
  // Ensure score doesn't exceed maximum
  score = Math.min(score, maxScore);
  score = Math.round(score * 10) / 10; // Round to 1 decimal place
  
  const feedback = generateFeedback(score, maxScore, strengths, improvements);
  
  return {
    score,
    maxScore,
    feedback,
    strengths,
    improvements,
  };
};

/**
 * Get maximum score for difficulty level
 * @param {string} difficulty - Question difficulty
 * @returns {number} - Maximum score
 */
const getMaxScore = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 10;
    case 'medium': return 15;
    case 'hard': return 25;
    default: return 10;
  }
};

/**
 * Get technical keywords for a topic
 * @param {string} topic - Question topic
 * @returns {Array<string>} - Array of keywords
 */
const getTechnicalKeywords = (topic) => {
  const keywordMap = {
    'JavaScript Basics': ['variable', 'scope', 'hoisting', 'function', 'object'],
    'JavaScript Advanced': ['closure', 'prototype', 'async', 'promise', 'callback'],
    'React Basics': ['component', 'jsx', 'props', 'state', 'render'],
    'React Hooks': ['useEffect', 'useState', 'useLayoutEffect', 'dependency', 'lifecycle'],
    'HTTP/REST': ['GET', 'POST', 'PUT', 'DELETE', 'REST', 'API', 'endpoint'],
    'Node.js/Backend': ['server', 'middleware', 'express', 'authentication', 'jwt'],
    'System Design': ['scalability', 'database', 'architecture', 'microservices', 'cache'],
    'Database Optimization': ['index', 'query', 'performance', 'optimization', 'sql'],
    'General': ['experience', 'project', 'technology', 'development', 'programming']
  };
  
  return keywordMap[topic] || keywordMap['General'];
};

/**
 * Generate feedback based on evaluation
 * @param {number} score - Achieved score
 * @param {number} maxScore - Maximum possible score
 * @param {Array<string>} strengths - Identified strengths
 * @param {Array<string>} improvements - Suggested improvements
 * @returns {string} - Generated feedback
 */
const generateFeedback = (score, maxScore, strengths, improvements) => {
  const percentage = (score / maxScore) * 100;
  
  let feedback = '';
  
  if (percentage >= 90) {
    feedback = 'Excellent answer! ';
  } else if (percentage >= 75) {
    feedback = 'Good answer! ';
  } else if (percentage >= 60) {
    feedback = 'Decent answer. ';
  } else if (percentage >= 40) {
    feedback = 'Basic understanding shown. ';
  } else {
    feedback = 'Answer needs improvement. ';
  }
  
  if (strengths.length > 0) {
    feedback += `Strengths: ${strengths.join(' ')} `;
  }
  
  if (improvements.length > 0) {
    feedback += `Areas for improvement: ${improvements.join(' ')}`;
  }
  
  return feedback.trim();
};

/**
 * Generate final summary for completed interview
 * @param {Array<Object>} questions - All questions with answers
 * @param {Object} candidateInfo - Candidate information
 * @returns {Promise<Object>} - Final summary
 */
export const generateFinalSummary = async (questions, candidateInfo) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    const totalScore = questions.reduce((sum, q) => sum + (q.score || 0), 0);
    const maxPossibleScore = questions.reduce((sum, q) => sum + getMaxScore(q.difficulty), 0);
    const percentage = Math.round((totalScore / maxPossibleScore) * 100);
    
    const topicPerformance = {};
    questions.forEach(q => {
      if (!topicPerformance[q.topic]) {
        topicPerformance[q.topic] = { scores: [], maxScores: [] };
      }
      topicPerformance[q.topic].scores.push(q.score || 0);
      topicPerformance[q.topic].maxScores.push(getMaxScore(q.difficulty));
    });
    
    const strongAreas = [];
    const improvementAreas = [];
    
    Object.entries(topicPerformance).forEach(([topic, data]) => {
      const topicScore = data.scores.reduce((a, b) => a + b, 0);
      const topicMax = data.maxScores.reduce((a, b) => a + b, 0);
      const topicPercentage = (topicScore / topicMax) * 100;
      
      if (topicPercentage >= 75) {
        strongAreas.push(topic);
      } else if (topicPercentage < 50) {
        improvementAreas.push(topic);
      }
    });
    
    let overallRating;
    if (percentage >= 85) {
      overallRating = 'Excellent';
    } else if (percentage >= 70) {
      overallRating = 'Good';
    } else if (percentage >= 55) {
      overallRating = 'Average';
    } else {
      overallRating = 'Needs Improvement';
    }
    
    return {
      candidateName: candidateInfo.name,
      totalScore,
      maxPossibleScore,
      percentage,
      overallRating,
      strongAreas,
      improvementAreas,
      recommendation: generateRecommendation(percentage, strongAreas, improvementAreas),
      completedAt: Date.now(),
      questionsCount: questions.length,
      averageScore: totalScore / questions.length,
    };
  } catch (error) {
    console.error('Error generating final summary:', error);
    return {
      candidateName: candidateInfo.name,
      totalScore: 0,
      maxPossibleScore: 0,
      percentage: 0,
      overallRating: 'Error',
      strongAreas: [],
      improvementAreas: [],
      recommendation: 'Unable to generate summary due to technical error.',
      completedAt: Date.now(),
      questionsCount: 0,
      averageScore: 0,
    };
  }
};

/**
 * Generate hiring recommendation
 * @param {number} percentage - Overall percentage score
 * @param {Array<string>} strongAreas - Areas of strength
 * @param {Array<string>} improvementAreas - Areas needing improvement
 * @returns {string} - Recommendation text
 */
const generateRecommendation = (percentage, strongAreas, improvementAreas) => {
  if (percentage >= 85) {
    return `Strong candidate with excellent technical knowledge. ${strongAreas.length > 0 ? `Particularly strong in ${strongAreas.join(', ')}.` : ''} Recommended for immediate consideration.`;
  } else if (percentage >= 70) {
    return `Good candidate with solid fundamentals. ${strongAreas.length > 0 ? `Shows strength in ${strongAreas.join(', ')}.` : ''} ${improvementAreas.length > 0 ? `Could benefit from improvement in ${improvementAreas.join(', ')}.` : ''} Recommended for next round.`;
  } else if (percentage >= 55) {
    return `Average candidate with basic understanding. ${improvementAreas.length > 0 ? `Needs development in ${improvementAreas.join(', ')}.` : ''} Consider for junior positions with mentorship.`;
  } else {
    return `Candidate shows limited technical knowledge. ${improvementAreas.length > 0 ? `Significant improvement needed in ${improvementAreas.join(', ')}.` : ''} Not recommended at this time.`;
  }
};