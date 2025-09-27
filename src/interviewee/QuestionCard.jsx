import React from 'react';
import { Card, Tag, Space, Typography, Badge } from 'antd';
import { QuestionCircleOutlined, TagOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const QuestionCard = ({ question, questionNumber }) => {
  if (!question) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';  
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const getTimeLimitColor = (timeLimit) => {
    if (timeLimit <= 30) return '#52c41a';
    if (timeLimit <= 90) return '#faad14';
    return '#f5222d';
  };

  return (
    <Card
      title={
        <Space>
          <QuestionCircleOutlined style={{ color: '#1890ff' }} />
          Question {questionNumber}
        </Space>
      }
      extra={
        <Space>
          <Tag color={getDifficultyColor(question.difficulty)}>
            {question.difficulty.toUpperCase()}
          </Tag>
          <Badge 
            count={`${question.timeLimit}s`} 
            style={{ backgroundColor: getTimeLimitColor(question.timeLimit) }}
          />
        </Space>
      }
      style={{ 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: '1px solid #d9d9d9'
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ marginBottom: '16px', color: '#1890ff' }}>
            {question.text}
          </Title>
        </div>
        
        {question.topic && (
          <div>
            <Space>
              <TagOutlined style={{ color: '#666' }} />
              <Text type="secondary">Topic: {question.topic}</Text>
            </Space>
          </div>
        )}
        
        <div style={{ 
          backgroundColor: 'rgba(24, 144, 255, 0.1)', 
          padding: '12px', 
          borderRadius: '6px',
          borderLeft: '4px solid #1890ff'
        }}>
          <Space>
            <ClockCircleOutlined style={{ color: '#1890ff' }} />
            <Text strong style={{ color: '#1890ff' }}>
              Time Limit: {question.timeLimit} seconds
            </Text>
          </Space>
        </div>

        {question.expectedPoints && question.expectedPoints.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <strong>Consider covering:</strong> {question.expectedPoints.join(' • ')}
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default QuestionCard;