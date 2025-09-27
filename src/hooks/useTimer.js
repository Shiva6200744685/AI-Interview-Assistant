import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing timer functionality
 * @param {number} initialTime - Initial time in seconds
 * @param {function} onTimeUp - Callback when timer reaches zero
 * @param {boolean} autoStart - Whether to start timer automatically
 * @returns {object} Timer state and controls
 */
const useTimer = (initialTime = 0, onTimeUp = null, autoStart = false) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  // Reset timer to initial state
  const reset = useCallback(() => {
    setTimeLeft(initialTime);
    setIsRunning(false);
    setIsPaused(false);
    setIsFinished(false);
    setStartTimeRef(null);
    setPausedTimeRef(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [initialTime]);

  // Start the timer
  const start = useCallback(() => {
    if (!isFinished) {
      setIsRunning(true);
      setIsPaused(false);
      startTimeRef.current = Date.now();
    }
  }, [isFinished]);

  // Pause the timer
  const pause = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
    pausedTimeRef.current = Date.now();
  }, []);

  // Resume the timer
  const resume = useCallback(() => {
    if (isPaused && !isFinished) {
      setIsRunning(true);
      setIsPaused(false);
      const pausedDuration = Date.now() - pausedTimeRef.current;
      startTimeRef.current += pausedDuration;
    }
  }, [isPaused, isFinished]);

  // Stop the timer completely
  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setIsFinished(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Add time to the timer
  const addTime = useCallback((seconds) => {
    setTimeLeft(prev => Math.max(0, prev + seconds));
  }, []);

  // Subtract time from the timer
  const subtractTime = useCallback((seconds) => {
    setTimeLeft(prev => Math.max(0, prev - seconds));
  }, []);

  // Set new time
  const setTime = useCallback((newTime) => {
    setTimeLeft(Math.max(0, newTime));
    if (newTime <= 0) {
      setIsFinished(true);
      setIsRunning(false);
    }
  }, []);

  // Main timer effect
  useEffect(() => {
    if (isRunning && !isPaused && !isFinished) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          
          if (newTime <= 0) {
            setIsRunning(false);
            setIsFinished(true);
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            
            // Call onTimeUp callback
            if (onTimeUp && typeof onTimeUp === 'function') {
              setTimeout(() => onTimeUp(), 0);
            }
            
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, isFinished, onTimeUp]);

  // Update timeLeft when initialTime changes
  useEffect(() => {
    if (!isRunning && !isPaused) {
      setTimeLeft(initialTime);
      setIsFinished(initialTime <= 0);
    }
  }, [initialTime, isRunning, isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Helper functions
  const getProgress = useCallback(() => {
    if (initialTime <= 0) return 100;
    return ((initialTime - timeLeft) / initialTime) * 100;
  }, [initialTime, timeLeft]);

  const getTimeRemaining = useCallback(() => {
    return Math.max(0, timeLeft);
  }, [timeLeft]);

  const formatTime = useCallback((time = timeLeft) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  const formatTimeDetailed = useCallback((time = timeLeft) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  const getWarningLevel = useCallback(() => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage <= 10) return 'critical'; // Red
    if (percentage <= 25) return 'warning';  // Orange
    if (percentage <= 50) return 'caution';  // Yellow
    return 'normal'; // Green
  }, [timeLeft, initialTime]);

  const isWarning = useCallback(() => {
    return getWarningLevel() !== 'normal';
  }, [getWarningLevel]);

  const isCritical = useCallback(() => {
    return getWarningLevel() === 'critical';
  }, [getWarningLevel]);

  return {
    // State
    timeLeft: getTimeRemaining(),
    isRunning,
    isPaused,
    isFinished,
    progress: getProgress(),
    warningLevel: getWarningLevel(),
    
    // Controls
    start,
    pause,
    resume,
    stop,
    reset,
    addTime,
    subtractTime,
    setTime,
    
    // Helpers
    formatTime,
    formatTimeDetailed,
    isWarning: isWarning(),
    isCritical: isCritical(),
    
    // Raw time for custom formatting
    rawTime: timeLeft,
  };
};

export default useTimer;