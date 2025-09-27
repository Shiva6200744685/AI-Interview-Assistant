import { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import {
  startInterview,
  submitAnswer,
  pauseInterview,
  resumeInterview,
  resetInterview,
  updateTimer,
  timeUp,
  setCandidateInfo
} from '../store/slices/interviewSlice';
import { addCandidate, updateCandidate } from '../store/slices/candidateSlice';
import useTimer from './useTimer';

/**
 * Custom hook for managing interview functionality
 * @returns {object} Interview state and controls
 */
const useInterview = () => {
  const dispatch = useDispatch();
  
  // Get interview state from Redux
  const interviewState = useSelector(state => state.interview);
  const candidateState = useSelector(state => state.candidate);
  
  const {
    candidateInfo,
    isActive,
    isComplete,
    isPaused,
    currentQuestionIndex,
    questions,
    totalScore,
    finalSummary,
    loading,
    error,
    hasUnfinishedSession
  } = interviewState;

  // Get current question
  const currentQuestion = useMemo(() => {
    return questions[currentQuestionIndex] || null;
  }, [questions, currentQuestionIndex]);

  // Timer management
  const {
    timeLeft,
    isRunning: timerIsRunning,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
    formatTime
  } = useTimer(
    currentQuestion?.timeLimit || 0,
    () => handleTimeUp(),
    isActive && !isPaused
  );

  // Handle time up
  const handleTimeUp = useCallback(async () => {
    if (isActive && !isPaused) {
      message.warning('Time is up! Auto-submitting your answer...');
      dispatch(timeUp());
      
      // Auto-submit with empty answer if no answer provided
      try {
        await dispatch(submitAnswer({ 
          answer: '', 
          timeSpent: currentQuestion?.timeLimit || 0 
        }));
      } catch (error) {
        console.error('Error auto-submitting answer:', error);
      }
    }
  }, [dispatch, isActive, isPaused, currentQuestion]);

  // Start interview
  const handleStartInterview = useCallback(async (candidateData) => {
    try {
      if (!candidateData || !candidateData.name || !candidateData.email) {
        throw new Error('Complete candidate information is required');
      }

      dispatch(setCandidateInfo(candidateData));
      const result = await dispatch(startInterview(candidateData));
      
      if (startInterview.fulfilled.match(result)) {
        message.success('Interview started successfully!');
        return { success: true };
      } else {
        throw new Error(result.error?.message || 'Failed to start interview');
      }
    } catch (error) {
      message.error(error.message || 'Failed to start interview');
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  // Submit answer
  const handleSubmitAnswer = useCallback(async (answer) => {
    try {
      if (!answer || typeof answer !== 'string') {
        throw new Error('Answer is required');
      }

      const timeSpent = currentQuestion?.timeLimit ? 
        (currentQuestion.timeLimit - timeLeft) : 0;

      const result = await dispatch(submitAnswer({ 
        answer: answer.trim(), 
        timeSpent 
      }));

      if (submitAnswer.fulfilled.match(result)) {
        const { isComplete } = result.payload;
        
        if (isComplete) {
          message.success('Interview completed! Check your results.');
          // Add completed candidate to candidates list
          const candidateData = {
            ...candidateInfo,
            questions: questions,
            totalScore,
            finalSummary: result.payload.finalSummary,
            completedAt: Date.now(),
            status: 'completed'
          };
          dispatch(addCandidate(candidateData));
        } else {
          message.success('Answer submitted! Moving to next question.');
        }
        
        return { success: true, isComplete };
      } else {
        throw new Error(result.error?.message || 'Failed to submit answer');
      }
    } catch (error) {
      message.error(error.message || 'Failed to submit answer');
      return { success: false, error: error.message };
    }
  }, [dispatch, currentQuestion, timeLeft, candidateInfo, questions, totalScore]);

  // Pause interview
  const handlePauseInterview = useCallback(() => {
    dispatch(pauseInterview());
    pauseTimer();
    message.info('Interview paused');
  }, [dispatch, pauseTimer]);

  // Resume interview
  const handleResumeInterview = useCallback(() => {
    dispatch(resumeInterview());
    startTimer();
    message.info('Interview resumed');
  }, [dispatch, startTimer]);

  // Reset interview
  const handleResetInterview = useCallback(() => {
    dispatch(resetInterview());
    resetTimer();
    message.info('Interview reset');
  }, [dispatch, resetTimer]);

  // Get interview progress
  const getProgress = useCallback(() => {
    const totalQuestions = 6;
    const completedQuestions = Math.min(currentQuestionIndex, totalQuestions);
    return {
      completed: completedQuestions,
      total: totalQuestions,
      percentage: Math.round((completedQuestions / totalQuestions) * 100)
    };
  }, [currentQuestionIndex]);

  // Get current difficulty
  const getCurrentDifficulty = useCallback(() => {
    if (!currentQuestion) return null;
    return currentQuestion.difficulty;
  }, [currentQuestion]);

  // Get question statistics
  const getQuestionStats = useCallback(() => {
    const answeredQuestions = questions.filter(q => q.answer !== undefined);
    const totalScore = answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0);
    const averageScore = answeredQuestions.length > 0 ? 
      totalScore / answeredQuestions.length : 0;

    return {
      answered: answeredQuestions.length,
      total: questions.length,
      totalScore,
      averageScore: Math.round(averageScore * 10) / 10
    };
  }, [questions]);

  // Check if can submit answer
  const canSubmitAnswer = useCallback((answer) => {
    return isActive && 
           !isPaused && 
           !loading && 
           currentQuestion && 
           answer && 
           answer.trim().length > 0;
  }, [isActive, isPaused, loading, currentQuestion]);

  // Get time warning level
  const getTimeWarningLevel = useCallback(() => {
    if (!currentQuestion || timeLeft <= 0) return 'expired';
    
    const percentage = (timeLeft / currentQuestion.timeLimit) * 100;
    if (percentage <= 10) return 'critical';
    if (percentage <= 25) return 'warning';
    if (percentage <= 50) return 'caution';
    return 'normal';
  }, [timeLeft, currentQuestion]);

  // Auto-save progress
  useEffect(() => {
    if (isActive && candidateInfo) {
      // Auto-save could be implemented here
      // For now, Redux Persist handles this
    }
  }, [isActive, candidateInfo, currentQuestionIndex, questions]);

  // Sync timer with Redux state
  useEffect(() => {
    dispatch(updateTimer(timeLeft));
  }, [dispatch, timeLeft]);

  // Handle page visibility changes (pause when tab not visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isActive && !isPaused) {
        if (document.hidden) {
          // Page is hidden, pause timer but don't change interview state
          pauseTimer();
        } else {
          // Page is visible again, resume timer
          startTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, isPaused, pauseTimer, startTimer]);

  // Return interview interface
  return {
    // State
    candidateInfo,
    isActive,
    isComplete,
    isPaused,
    currentQuestionIndex,
    questions,
    currentQuestion,
    totalScore,
    finalSummary,
    loading,
    error,
    hasUnfinishedSession,
    
    // Timer state
    timeLeft,
    timerIsRunning,
    formattedTime: formatTime(),
    timeWarningLevel: getTimeWarningLevel(),
    
    // Actions
    startInterview: handleStartInterview,
    submitAnswer: handleSubmitAnswer,
    pauseInterview: handlePauseInterview,
    resumeInterview: handleResumeInterview,
    resetInterview: handleResetInterview,
    
    // Utilities
    getProgress,
    getCurrentDifficulty,
    getQuestionStats,
    canSubmitAnswer,
    
    // Computed values
    progress: getProgress(),
    questionStats: getQuestionStats(),
    isTimeWarning: getTimeWarningLevel() !== 'normal',
    isTimeCritical: getTimeWarningLevel() === 'critical',
    canPause: isActive && !isPaused && !loading,
    canResume: isActive && isPaused && !loading,
  };
};

export default useInterview;