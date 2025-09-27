import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateQuestion, evaluateAnswer, generateFinalSummary } from '../../services/aiService';

// Async thunks
export const startInterview = createAsyncThunk(
  'interview/start',
  async (candidateInfo, { getState }) => {
    const { name, email, phone } = candidateInfo;
    const firstQuestion = await generateQuestion(1, 'easy');
    
    return {
      candidateInfo: { name, email, phone },
      currentQuestion: firstQuestion,
      startTime: Date.now(),
    };
  }
);

export const submitAnswer = createAsyncThunk(
  'interview/submitAnswer',
  async ({ answer, timeSpent }, { getState, dispatch }) => {
    const state = getState().interview;
    const { currentQuestionIndex, questions, candidateInfo } = state;
    
    // Evaluate current answer
    const evaluation = await evaluateAnswer(
      questions[currentQuestionIndex],
      answer,
      questions[currentQuestionIndex].difficulty
    );
    
    // Check if interview is complete
    if (currentQuestionIndex >= 5) {
      // Generate final summary
      const allAnswers = [...questions.slice(0, currentQuestionIndex + 1)];
      allAnswers[currentQuestionIndex] = {
        ...allAnswers[currentQuestionIndex],
        answer,
        score: evaluation.score,
        timeSpent,
      };
      
      const finalSummary = await generateFinalSummary(allAnswers, candidateInfo);
      
      return {
        answer,
        evaluation,
        timeSpent,
        isComplete: true,
        finalSummary,
      };
    } else {
      // Generate next question
      const nextQuestionIndex = currentQuestionIndex + 1;
      const difficulty = nextQuestionIndex < 2 ? 'easy' : nextQuestionIndex < 4 ? 'medium' : 'hard';
      const nextQuestion = await generateQuestion(nextQuestionIndex + 1, difficulty);
      
      return {
        answer,
        evaluation,
        timeSpent,
        nextQuestion,
        isComplete: false,
      };
    }
  }
);

const initialState = {
  isActive: false,
  isComplete: false,
  isPaused: false,
  hasUnfinishedSession: false,
  candidateInfo: null,
  currentQuestionIndex: 0,
  questions: [],
  currentTimer: 0,
  totalScore: 0,
  startTime: null,
  endTime: null,
  finalSummary: null,
  loading: false,
  error: null,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    resetInterview: (state) => {
      return { ...initialState };
    },
    pauseInterview: (state) => {
      state.isPaused = true;
    },
    resumeInterview: (state) => {
      state.isPaused = false;
      state.hasUnfinishedSession = false;
    },
    updateTimer: (state, action) => {
      state.currentTimer = action.payload;
    },
    timeUp: (state) => {
      // Auto-submit empty answer when time runs out
      state.currentTimer = 0;
    },
    checkUnfinishedSession: (state) => {
      if (state.isActive && !state.isComplete) {
        state.hasUnfinishedSession = true;
      }
    },
    setCandidateInfo: (state, action) => {
      state.candidateInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startInterview.fulfilled, (state, action) => {
        const { candidateInfo, currentQuestion, startTime } = action.payload;
        state.loading = false;
        state.isActive = true;
        state.candidateInfo = candidateInfo;
        state.questions = [currentQuestion];
        state.startTime = startTime;
        state.currentTimer = currentQuestion.timeLimit;
      })
      .addCase(startInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(submitAnswer.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        const { answer, evaluation, timeSpent, nextQuestion, isComplete, finalSummary } = action.payload;
        
        // Update current question with answer and score
        state.questions[state.currentQuestionIndex] = {
          ...state.questions[state.currentQuestionIndex],
          answer,
          score: evaluation.score,
          feedback: evaluation.feedback,
          timeSpent,
        };
        
        state.totalScore += evaluation.score;
        state.loading = false;
        
        if (isComplete) {
          state.isComplete = true;
          state.isActive = false;
          state.endTime = Date.now();
          state.finalSummary = finalSummary;
        } else {
          state.currentQuestionIndex += 1;
          state.questions.push(nextQuestion);
          state.currentTimer = nextQuestion.timeLimit;
        }
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  resetInterview,
  pauseInterview,
  resumeInterview,
  updateTimer,
  timeUp,
  checkUnfinishedSession,
  setCandidateInfo,
} = interviewSlice.actions;

export default interviewSlice.reducer;