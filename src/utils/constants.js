// Application Constants

export const INTERVIEW_CONFIG = {
  TOTAL_QUESTIONS: 6,
  QUESTIONS_BY_DIFFICULTY: {
    EASY: 2,
    MEDIUM: 2,
    HARD: 2,
  },
  TIME_LIMITS: {
    EASY: 20, // seconds
    MEDIUM: 60,
    HARD: 120,
  },
  MAX_SCORES: {
    EASY: 10,
    MEDIUM: 15,
    HARD: 25,
  },
};

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.docx'],
};

export const CANDIDATE_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused',
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const INTERVIEW_TOPICS = {
  JAVASCRIPT_BASICS: 'JavaScript Basics',
  JAVASCRIPT_ADVANCED: 'JavaScript Advanced',
  REACT_BASICS: 'React Basics',
  REACT_HOOKS: 'React Hooks',
  HTTP_REST: 'HTTP/REST',
  NODE_BACKEND: 'Node.js/Backend',
  SYSTEM_DESIGN: 'System Design',
  DATABASE_OPTIMIZATION: 'Database Optimization',
  GENERAL: 'General',
};

export const RATING_THRESHOLDS = {
  EXCELLENT: 85,
  GOOD: 70,
  AVERAGE: 55,
  POOR: 0,
};

export const RATING_LABELS = {
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  AVERAGE: 'Average',
  POOR: 'Needs Improvement',
};

export const COLORS = {
  PRIMARY: '#1890ff',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#f5222d',
  EASY: '#52c41a',
  MEDIUM: '#faad14',
  HARD: '#f5222d',
};

export const STORAGE_KEYS = {
  CANDIDATES: 'ai_interview_candidates',
  CURRENT_SESSION: 'ai_interview_current',
  USER_PREFERENCES: 'ai_interview_preferences',
};

export const API_ENDPOINTS = {
  // Add your AI API endpoints here
  OPENAI_API: 'https://api.openai.com/v1',
  CLAUDE_API: 'https://api.anthropic.com/v1',
  // For development, we're using mock responses
};

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  INVALID_FILE_TYPE: 'Please upload a PDF or DOCX file',
  RESUME_PARSE_ERROR: 'Failed to extract text from resume',
  NO_CANDIDATE_INFO: 'Please provide candidate information first',
  INTERVIEW_START_ERROR: 'Failed to start interview',
  ANSWER_SUBMIT_ERROR: 'Failed to submit answer',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

export const SUCCESS_MESSAGES = {
  RESUME_UPLOADED: 'Resume uploaded successfully!',
  INTERVIEW_STARTED: 'Interview started successfully!',
  ANSWER_SUBMITTED: 'Answer submitted successfully!',
  INTERVIEW_COMPLETED: 'Interview completed successfully!',
};

export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s]+$/,
  },
  EMAIL: {
    PATTERN: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
  },
  PHONE: {
    PATTERN: /^[\+]?[\d\s\-\(\)]{10,}$/,
  },
};

export const UI_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
  },
  DEBOUNCE_DELAY: 300, // milliseconds
  ANIMATION_DURATION: 300,
  MODAL_WIDTH: {
    SMALL: 400,
    MEDIUM: 600,
    LARGE: 800,
    EXTRA_LARGE: 1000,
  },
};

export const MOCK_DATA = {
  SAMPLE_CANDIDATE: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
  },
  DEVELOPMENT_MODE: process.env.NODE_ENV === 'development',
};