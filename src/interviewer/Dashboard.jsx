import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Statistic, Empty, Space, Typography } from 'antd';
import { 
  UserOutlined, 
  TrophyOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';
import CandidateList from './CandidateList';
import CandidateDetail from './CandidateDetail';
import SearchFilter from './SearchFilter';
import { selectCandidate } from '../store/slices/candidateSlice';

const { Title } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { candidates, selectedCandidate } = useSelector(state => state.candidate);
  const [detailVisible, setDetailVisible] = useState(false);

  const handleCandidateSelect = (candidateId) => {
    dispatch(selectCandidate(candidateId));
    setDetailVisible(true);
  };

  const handleDetailClose = () => {
    setDetailVisible(false);
  };

  const getStatistics = () => {
    const total = candidates.length;
    const completed = candidates.filter(c => c.status === 'completed').length;
    const avgScore = completed > 0 
      ? Math.round(candidates.reduce((sum, c) => sum + (c.totalScore || 0), 0) / completed)
      : 0;
    const topScore = completed > 0
      ? Math.max(...candidates.map(c => c.totalScore || 0))
      : 0;

    return { total, completed, avgScore, topScore };
  };

  const stats = getStatistics();

  if (candidates.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical">
              <Title level={4}>No Candidates Yet</Title>
              <p>Candidates who complete interviews will appear here.</p>
            </Space>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={3}>Interviewer Dashboard</Title>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Total Candidates"
                value={stats.total}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Completed"
                value={stats.completed}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Average Score"
                value={stats.avgScore}
                prefix={<ClockCircleOutlined />}
                suffix="pts"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Top Score"
                value={stats.topScore}
                prefix={<TrophyOutlined />}
                suffix="pts"
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Search and Filter */}
        <SearchFilter />

        {/* Candidates List */}
        <CandidateList onCandidateSelect={handleCandidateSelect} />

        {/* Candidate Detail Modal */}
        <CandidateDetail
          visible={detailVisible}
          candidate={selectedCandidate}
          onClose={handleDetailClose}
        />
      </Space>
    </div>
  );
};

export default Dashboard;