import React from 'react';
import { useDispatch } from 'react-redux';
import { 
  Modal, 
  Card, 
  Space, 
  Typography, 
  Divider, 
  Row, 
  Col, 
  Tag, 
  Alert,
  Timeline,
  Progress,
  Avatar,
  Button,
  Tooltip
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { clearSelectedCandidate } from '../store/slices/candidateSlice';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const { Title, Text, Paragraph } = Typography;

const CandidateDetail = ({ visible, candidate, onClose }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(clearSelectedCandidate());
    onClose();
  };

  if (!candidate) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const getScoreColor = (score, maxScore) => {
    if (!maxScore) return '#666';
    const percentage = (score / maxScore) * 100;
    if (percentage >= 85) return '#52c41a';
    if (percentage >= 70) return '#1890ff';
    if (percentage >= 55) return '#faad14';
    return '#f5222d';
  };

  const formatDuration = (seconds) => {
    const d = dayjs.duration(seconds, 'seconds');
    if (d.asMinutes() >= 1) {
      return `${Math.floor(d.asMinutes())}m ${d.seconds()}s`;
    }
    return `${d.seconds()}s`;
  };

  const renderQuestionTimeline = () => {
    if (!candidate.questions || candidate.questions.length === 0) {
      return <Text type="secondary">No questions data available</Text>;
    }

    return (
      <Timeline>
        {candidate.questions.map((question, index) => (
          <Timeline.Item
            key={index}
            color={getScoreColor(question.score, question.difficulty === 'easy' ? 10 : question.difficulty === 'medium' ? 15 : 25)}
            dot={<CheckCircleOutlined />}
          >
            <Card size="small" style={{ marginBottom: '8px' }}>
              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <Space>
                    <Text strong>Q{index + 1}</Text>
                    <Tag color={getDifficultyColor(question.difficulty)}>
                      {question.difficulty.toUpperCase()}
                    </Tag>
                    <Text type="secondary">{question.topic}</Text>
                  </Space>
                </Col>
                
                <Col span={24}>
                  <Text style={{ fontSize: '14px' }}>
                    {question.text}
                  </Text>
                </Col>
                
                <Col span={24}>
                  <div style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '8px', 
                    borderRadius: '4px',
                    marginTop: '8px'
                  }}>
                    <Text strong>Answer: </Text>
                    <Text>
                      {question.answer || 'No answer provided'}
                    </Text>
                  </div>
                </Col>
                
                <Col span={12}>
                  <Space>
                    <TrophyOutlined style={{ color: '#faad14' }} />
                    <Text strong style={{ color: getScoreColor(question.score, 25) }}>
                      {question.score || 0} pts
                    </Text>
                  </Space>
                </Col>
                
                <Col span={12}>
                  <Space>
                    <ClockCircleOutlined />
                    <Text>
                      {question.timeSpent ? formatDuration(question.timeSpent) : 'N/A'}
                    </Text>
                  </Space>
                </Col>
                
                {question.feedback && (
                  <Col span={24}>
                    <Alert
                      message="AI Feedback"
                      description={question.feedback}
                      type="info"
                      showIcon
                      style={{ marginTop: '8px' }}
                    />
                  </Col>
                )}
              </Row>
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  };

  const renderPerformanceOverview = () => {
    const summary = candidate.finalSummary;
    if (!summary) return null;

    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={summary.percentage}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                format={() => `${summary.percentage}%`}
              />
              <div style={{ marginTop: '8px' }}>
                <Text strong>Overall Score</Text>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card size="small">
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div>
                  <Text strong>Total Score: </Text>
                  <Text style={{ fontSize: '16px', color: '#1890ff' }}>
                    {summary.totalScore}/{summary.maxPossibleScore}
                  </Text>
                </div>
                <div>
                  <Text strong>Rating: </Text>
                  <Tag color={summary.percentage >= 70 ? 'success' : summary.percentage >= 55 ? 'warning' : 'error'}>
                    {summary.overallRating}
                  </Tag>
                </div>
                <div>
                  <Text strong>Questions: </Text>
                  <Text>{summary.questionsCount} completed</Text>
                </div>
                <div>
                  <Text strong>Average: </Text>
                  <Text>{Math.round(summary.averageScore * 10) / 10} pts/question</Text>
                </div>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    );
  };

  return (
    <Modal
      title={
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
            {candidate.name ? candidate.name.charAt(0).toUpperCase() : '?'}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: '18px' }}>
              {candidate.name || 'Unknown Candidate'}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Interview Details
            </Text>
          </div>
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button key="close" type="primary" onClick={handleClose}>
          Close
        </Button>
      ]}
      width={900}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Candidate Information */}
        <Card title="Candidate Information" size="small">
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={8}>
              <Space>
                <MailOutlined />
                <Text>{candidate.email || 'No email'}</Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space>
                <PhoneOutlined />
                <Text>{candidate.phone || 'No phone'}</Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space>
                <ClockCircleOutlined />
                <Text>
                  {dayjs(candidate.completedAt || candidate.timestamp).format('MMM DD, YYYY HH:mm')}
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Performance Overview */}
        {candidate.finalSummary && (
          <Card title="Performance Overview" size="small">
            {renderPerformanceOverview()}
            
            <Divider />
            
            {candidate.finalSummary.strongAreas.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ color: '#52c41a' }}>Strong Areas: </Text>
                <Text>{candidate.finalSummary.strongAreas.join(', ')}</Text>
              </div>
            )}
            
            {candidate.finalSummary.improvementAreas.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ color: '#faad14' }}>Improvement Areas: </Text>
                <Text>{candidate.finalSummary.improvementAreas.join(', ')}</Text>
              </div>
            )}
            
            <Alert
              message="AI Recommendation"
              description={candidate.finalSummary.recommendation}
              type="info"
              showIcon
            />
          </Card>
        )}

        {/* Question by Question Analysis */}
        <Card 
          title={
            <Space>
              <FileTextOutlined />
              Question by Question Analysis
            </Space>
          }
          size="small"
        >
          {renderQuestionTimeline()}
        </Card>
      </Space>
    </Modal>
  );
};

export default CandidateDetail;