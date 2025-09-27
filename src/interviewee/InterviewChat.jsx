import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Card, 
  Button, 
  Input, 
  Space, 
  Typography, 
  Progress, 
  Alert, 
  Divider,
  Row,
  Col,
  Badge,
  message
} from 'antd';
import { 
  PlayCircleOutlined, 
  SendOutlined, 
  ClockCircleOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { startInterview, submitAnswer, updateTimer } from '../store/slices/interviewSlice';
import { addCandidate } from '../store/slices/candidateSlice';
import Timer from '../components/common/Timer';
import QuestionCard from './QuestionCard';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const InterviewChat = () => {
  const dispatch = useDispatch();
  const { 
    candidateInfo, 
    isActive, 
    currentQuestionIndex, 
    questions, 
    currentTimer, 
    totalScore, 
    loading,
    isComplete,
    finalSummary
  } = useSelector(state => state.interview);
  
  const [answer, setAnswer] = useState('');
  const [startTime, setStartTime] = useState(null);
  const answerRef = useRef(null);

  useEffect(() => {
    if (isComplete && finalSummary) {
      // Save completed candidate to candidates list
      const candidateData = {
        ...candidateInfo,
        questions,
        totalScore,
        finalSummary,
        completedAt: Date.now(),
        status: 'completed'
      };
      dispatch(addCandidate(candidateData));
    }
  }, [isComplete, finalSummary, candidateInfo, questions, totalScore, dispatch]);

  const handleStartInterview = async () => {
    try {
      setStartTime(Date.now());
      await dispatch(startInterview(candidateInfo));
      message.success('Interview started! Good luck!');
    } catch (error) {
      message.error('Failed to start interview. Please try again.');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      message.warning('Please provide an answer before submitting.');
      return;
    }

    try {
      const timeSpent = startTime ? Date.now() - startTime : 0;
      await dispatch(submitAnswer({ 
        answer: answer.trim(), 
        timeSpent: Math.round(timeSpent / 1000) // Convert to seconds
      }));
      
      setAnswer('');
      setStartTime(Date.now()); // Reset timer for next question
      
      if (currentQuestionIndex < 5) {
        message.success('Answer submitted! Next question loaded.');
      } else {
        message.success('Interview completed! Generating your results...');
      }
    } catch (error) {
      message.error('Failed to submit answer. Please try again.');
    }
  };

  const handleTimeUp = async () => {
    message.warning('Time is up! Submitting your current answer...');
    const timeSpent = startTime ? Date.now() - startTime : 0;
    
    try {
      await dispatch(submitAnswer({ 
        answer: answer.trim() || '', 
        timeSpent: Math.round(timeSpent / 1000)
      }));
      setAnswer('');
      setStartTime(Date.now());
    } catch (error) {
      message.error('Failed to auto-submit answer.');
    }
  };

  const getCurrentQuestion = () => {
    return questions[currentQuestionIndex];
  };

  const getProgressPercentage = () => {
    return Math.round(((currentQuestionIndex + 1) / 6) * 100);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#52c41a';
      case 'medium': return '#faad14';
      case 'hard': return '#f5222d';
      default: return '#1890ff';
    }
  };

  const getDifficultyText = (difficulty) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  if (!candidateInfo) {
    return (
      <Alert
        message="No candidate information found"
        description="Please upload your resume and provide your information first."
        type="warning"
        showIcon
      />
    );
  }

  if (!isActive && !isComplete) {
    return (
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <Title level={3}>Welcome, {candidateInfo.name}!</Title>
            <Paragraph>
              You are about to start the technical interview for the Full Stack Developer position.
            </Paragraph>
          </div>
          
          <Alert
            message="Interview Details"
            description={
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text>• Total Questions: 6 (2 Easy, 2 Medium, 2 Hard)</Text>
                <Text>• Time Limits: Easy (20s), Medium (60s), Hard (120s)</Text>
                <Text>• Topics: JavaScript, React, Node.js, System Design</Text>
                <Text>• You can pause and resume the interview if needed</Text>
              </Space>
            }
            type="info"
            showIcon
          />
          
          <Button 
            type="primary" 
            size="large" 
            icon={<PlayCircleOutlined />}
            onClick={handleStartInterview}
            loading={loading}
            style={{ minWidth: '200px' }}
          >
            Start Interview
          </Button>
        </Space>
      </Card>
    );
  }

  const currentQuestion = getCurrentQuestion();
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Progress Header */}
        <Card size="small">
          <Row align="middle" justify="space-between">
            <Col>
              <Space>
                <Text strong>Question {currentQuestionIndex + 1} of 6</Text>
                {currentQuestion && (
                  <Badge 
                    color={getDifficultyColor(currentQuestion.difficulty)}
                    text={getDifficultyText(currentQuestion.difficulty)}
                  />
                )}
              </Space>
            </Col>
            <Col>
              <Text type="secondary">Score: {totalScore}</Text>
            </Col>
          </Row>
          <Progress 
            percent={getProgressPercentage()} 
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            style={{ marginTop: '8px' }}
          />
        </Card>

        {/* Current Question */}
        {currentQuestion && (
          <QuestionCard 
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
          />
        )}

        {/* Timer */}
        {currentQuestion && isActive && (
          <Card size="small">
            <Row align="middle" justify="center">
              <Col>
                <Space size="large">
                  <div style={{ textAlign: 'center' }}>
                    <ClockCircleOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                    <div style={{ marginTop: '8px' }}>
                      <Timer
                        initialTime={currentQuestion.timeLimit}
                        onTimeUp={handleTimeUp}
                        isActive={isActive && !loading}
                      />
                    </div>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        )}

        {/* Answer Input */}
        {isActive && currentQuestion && (
          <Card 
            title={
              <Space>
                <SendOutlined />
                Your Answer
              </Space>
            }
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <TextArea
                ref={answerRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here... Be specific and provide examples where possible."
                rows={6}
                style={{ fontSize: '16px' }}
                disabled={loading}
              />
              
              <Row justify="space-between" align="middle">
                <Col>
                  <Text type="secondary">
                    Characters: {answer.length}
                  </Text>
                </Col>
                <Col>
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<SendOutlined />}
                    onClick={handleSubmitAnswer}
                    loading={loading}
                    disabled={!answer.trim()}
                  >
                    Submit Answer
                  </Button>
                </Col>
              </Row>
            </Space>
          </Card>
        )}

        {/* Previous Questions Summary */}
        {questions.length > 0 && currentQuestionIndex > 0 && (
          <Card 
            title="Previous Questions" 
            size="small"
            style={{ marginTop: '20px' }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {questions.slice(0, currentQuestionIndex).map((q, index) => (
                <div key={index} style={{ 
                  padding: '8px', 
                  backgroundColor: '#fafafa', 
                  borderRadius: '4px',
                  borderLeft: `4px solid ${getDifficultyColor(q.difficulty)}`
                }}>
                  <Row justify="space-between" align="middle">
                    <Col flex="auto">
                      <Text strong>Q{index + 1}: </Text>
                      <Text>{q.text.substring(0, 80)}...</Text>
                    </Col>
                    <Col>
                      <Space>
                        <Badge 
                          color={getDifficultyColor(q.difficulty)}
                          text={getDifficultyText(q.difficulty)}
                        />
                        {q.score !== undefined && (
                          <Text strong style={{ color: '#52c41a' }}>
                            <CheckCircleOutlined /> {q.score}pts
                          </Text>
                        )}
                      </Space>
                    </Col>
                  </Row>
                </div>
              ))}
            </Space>
          </Card>
        )}

        {/* Help Text */}
        <Card size="small">
          <Alert
            message="Tips for Success"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                <li>Be specific and provide concrete examples</li>
                <li>Explain your thought process</li>
                <li>Don't worry if you don't know everything - partial answers are valuable</li>
                <li>Take your time to think before answering</li>
              </ul>
            }
            type="info"
            showIcon
          />
        </Card>
      </Space>
    </div>
  );
};

export default InterviewChat;