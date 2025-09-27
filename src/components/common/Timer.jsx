import React, { useState, useEffect } from 'react';
import { Typography, Progress } from 'antd';

const { Text } = Typography;

const Timer = ({ initialTime, onTimeUp, isActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    setTimeLeft(initialTime);
    setIsWarning(false);
  }, [initialTime]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        
        // Warning when 25% time remaining or less than 10 seconds
        const warningThreshold = Math.max(Math.floor(initialTime * 0.25), 10);
        setIsWarning(newTime <= warningThreshold);
        
        if (newTime <= 0) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, initialTime, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercent = () => {
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  const getProgressColor = () => {
    const percent = (timeLeft / initialTime) * 100;
    if (percent <= 25) return '#f5222d'; // Red
    if (percent <= 50) return '#faad14'; // Orange
    return '#52c41a'; // Green
  };

  const getTextColor = () => {
    if (timeLeft === 0) return '#f5222d';
    if (isWarning) return '#faad14';
    return '#52c41a';
  };

  return (
    <div style={{ textAlign: 'center', minWidth: '120px' }}>
      <Text 
        style={{ 
          fontSize: '20px', 
          fontWeight: 'bold',
          color: getTextColor(),
          fontFamily: 'monospace'
        }}
      >
        {formatTime(timeLeft)}
      </Text>
      
      <Progress
        percent={100 - getProgressPercent()}
        strokeColor={getProgressColor()}
        trailColor="#f0f0f0"
        strokeWidth={8}
        showInfo={false}
        style={{ 
          marginTop: '4px',
          maxWidth: '120px'
        }}
      />
      
      {timeLeft === 0 && (
        <Text type="danger" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
          Time's Up!
        </Text>
      )}
      
      {isWarning && timeLeft > 0 && (
        <Text type="warning" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
          Hurry up!
        </Text>
      )}
    </div>
  );
};

export default Timer;