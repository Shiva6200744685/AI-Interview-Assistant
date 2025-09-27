import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Steps, Alert, Space, Typography, Button, Divider } from 'antd';
import { UserOutlined, FileTextOutlined, MessageOutlined, TrophyOutlined } from '@ant-design/icons';
import ResumeUpload from './ResumeUpload';
import InterviewChat from './InterviewChat';
import { resetInterview } from '../store/slices/interviewSlice';

const { Title, Text } = Typography;

const ChatInterface = () => {
  const dispatch = useDispatch();
  const { 
    candidateInfo, 
    isActive, 
    isComplete, 
    currentQuestionIndex, 
    totalScore,
    finalSummary,
    loading 
  } = useSelector(state => state.interview);
  
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (candidateInfo && candidateInfo.name && candidateInfo.email && candidateInfo.phone) {
      setCurrentStep(1); // Move to interview step
    }
    if (isActive) {
      setCurrentStep(2); // Interview in progress
    }
    if (isComplete) {
      setCurrentStep(3); // Interview completed
    }
  }, [candidateInfo, isActive, isComplete]);

  const handleStartNewInterview = () => {
    dispatch(resetInterview());
    setCurrentStep(0);
  };

  const steps = [
    {
      title: 'Upload Resume',
      description: 'Upload your resume to get started',
      icon: <FileTextOutlined />,
    },
    {
      title: 'Verify Information',
      description: 'Confirm your details',
      icon: <UserOutlined />,
    },
    {
      title: 'Interview',
      description: 'Answer technical questions',
      icon: <MessageOutlined />,
    },
    {
      title: 'Results',
      description: 'View your performance',
      icon: <TrophyOutlined />,
    },
  ];

  const renderContent = () => {
    if (isComplete && finalSummary) {
      return (
        <Card 
          title={
            <Space>
              <TrophyOutlined style={{ color: '#52c41a' }} />
              Interview Completed!
            </Space>
          }
          extra={
            <Button type="primary" onClick={handleStartNewInterview}>
              Start New Interview
            </Button>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={3}>Congratulations, {finalSummary.candidateName}!</Title>
              <Text type="secondary">You have successfully completed the technical interview.</Text>
            </div>
            
            <Alert
              message="Interview Summary"
              description={
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Overall Score: </Text>
                    <Text style={{ fontSize: '18px', color: '#1890ff' }}>
                      {finalSummary.totalScore}/{finalSummary.maxPossibleScore} ({finalSummary.percentage}%)
                    </Text>
                  </div>
                  <div>
                    <Text strong>Rating: </Text>
                    <Text style={{ 
                      color: finalSummary.percentage >= 70 ? '#52c41a' : 
                             finalSummary.percentage >= 55 ? '#faad14' : '#f5222d' 
                    }}>
                      {finalSummary.overallRating}
                    </Text>
                  </div>
                  {finalSummary.strongAreas.length > 0 && (
                    <div>
                      <Text strong>Strong Areas: </Text>
                      <Text>{finalSummary.strongAreas.join(', ')}</Text>
                    </div>
                  )}
                  {finalSummary.improvementAreas.length > 0 && (
                    <div>
                      <Text strong>Improvement Areas: </Text>
                      <Text>{finalSummary.improvementAreas.join(', ')}</Text>
                    </div>
                  )}
                </Space>
              }
              type="success"
              showIcon
              style={{ textAlign: 'left' }}
            />
            
            <Card size="small" title="Recommendation">
              <Text>{finalSummary.recommendation}</Text>
            </Card>
            
            <Divider />
            
            <Text type="secondary">
              Thank you for taking the time to complete this interview. 
              Your responses have been recorded and will be reviewed by our team.
            </Text>
          </Space>
        </Card>
      );
    }

    if (isActive || (candidateInfo && candidateInfo.name && candidateInfo.email && candidateInfo.phone)) {
      return <InterviewChat />;
    }

    return <ResumeUpload />;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>AI-Powered Technical Interview</Title>
            <Text type="secondary">
              Full Stack Developer Position - React/Node.js
            </Text>
          </div>
          
          <Steps 
            current={currentStep} 
            items={steps} 
            size="small"
            style={{ margin: '20px 0' }}
          />
          
          {loading && (
            <Alert
              message="Processing..."
              description="Please wait while we process your request."
              type="info"
              showIcon
            />
          )}
          
          {renderContent()}
        </Space>
      </Card>
    </div>
  );
};

export default ChatInterface;