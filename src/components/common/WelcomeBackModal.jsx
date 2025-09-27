import React from 'react';
import { Modal, Space, Typography, Button, Alert } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { resumeInterview, resetInterview } from '../../store/slices/interviewSlice';

const { Title, Text, Paragraph } = Typography;

const WelcomeBackModal = ({ visible }) => {
  const dispatch = useDispatch();
  const { candidateInfo, currentQuestionIndex, questions } = useSelector(state => state.interview);

  const handleResume = () => {
    dispatch(resumeInterview());
  };

  const handleStartNew = () => {
    Modal.confirm({
      title: 'Start New Interview?',
      content: 'This will delete your current progress and start a completely new interview. This action cannot be undone.',
      okText: 'Yes, Start New',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        dispatch(resetInterview());
      }
    });
  };

  const getCurrentQuestion = () => {
    return questions[currentQuestionIndex];
  };

  if (!visible || !candidateInfo) {
    return null;
  }

  return (
    <Modal
      title={
        <Space>
          <PlayCircleOutlined style={{ color: '#1890ff' }} />
          Welcome Back!
        </Space>
      }
      open={visible}
      footer={null}
      closable={false}
      centered
      width={500}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4}>Hello, {candidateInfo.name}!</Title>
          <Paragraph>
            We found an unfinished interview session. You can continue where you left off 
            or start a new interview.
          </Paragraph>
        </div>

        <Alert
          message="Your Progress"
          description={
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div>
                <Text strong>Questions Completed: </Text>
                <Text>{currentQuestionIndex} of 6</Text>
              </div>
              
              {getCurrentQuestion() && (
                <div>
                  <Text strong>Current Question: </Text>
                  <Text>
                    Question {currentQuestionIndex + 1} - {getCurrentQuestion().difficulty}
                  </Text>
                </div>
              )}
              
              <div>
                <Text strong>Candidate: </Text>
                <Text>{candidateInfo.email}</Text>
              </div>
            </Space>
          }
          type="info"
          showIcon
        />

        <div style={{ textAlign: 'center' }}>
          <Space size="large">
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleResume}
              size="large"
            >
              Continue Interview
            </Button>
            
            <Button
              type="default"
              icon={<DeleteOutlined />}
              onClick={handleStartNew}
              size="large"
            >
              Start New Interview
            </Button>
          </Space>
        </div>

        <Alert
          message="Note"
          description="Your progress is automatically saved locally. You can safely close the browser and return later to continue your interview."
          type="success"
          showIcon
          style={{ marginTop: '16px' }}
        />
      </Space>
    </Modal>
  );
};

export default WelcomeBackModal;