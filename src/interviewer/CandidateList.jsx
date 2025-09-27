import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Tag, Button, Space, Typography, Avatar, Tooltip } from 'antd';
import { 
  UserOutlined, 
  EyeOutlined, 
  MailOutlined, 
  PhoneOutlined,
  TrophyOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { selectFilteredCandidates } from '../store/slices/candidateSlice';
import dayjs from 'dayjs';

const { Text } = Typography;

const CandidateList = ({ onCandidateSelect }) => {
  const filteredCandidates = useSelector(selectFilteredCandidates);
  const { loading } = useSelector(state => state.candidate);

  const getRatingColor = (score, maxScore) => {
    if (!maxScore) return 'default';
    const percentage = (score / maxScore) * 100;
    if (percentage >= 85) return 'success';
    if (percentage >= 70) return 'processing';
    if (percentage >= 55) return 'warning';
    return 'error';
  };

  const getRatingText = (score, maxScore) => {
    if (!maxScore) return 'N/A';
    const percentage = (score / maxScore) * 100;
    if (percentage >= 85) return 'Excellent';
    if (percentage >= 70) return 'Good';
    if (percentage >= 55) return 'Average';
    return 'Poor';
  };

  const getStatusTag = (candidate) => {
    if (candidate.status === 'completed') {
      return <Tag color="success">Completed</Tag>;
    }
    return <Tag color="processing">In Progress</Tag>;
  };

  const columns = [
    {
      title: 'Candidate',
      key: 'candidate',
      render: (_, record) => (
        <Space>
          <Avatar 
            size="large" 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#1890ff' }}
          >
            {record.name ? record.name.charAt(0).toUpperCase() : '?'}
          </Avatar>
          <div>
            <div>
              <Text strong style={{ fontSize: '16px' }}>
                {record.name || 'Unknown'}
              </Text>
            </div>
            <div>
              <Space size="small">
                <MailOutlined style={{ color: '#666' }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {record.email || 'No email'}
                </Text>
              </Space>
            </div>
            {record.phone && (
              <div>
                <Space size="small">
                  <PhoneOutlined style={{ color: '#666' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {record.phone}
                  </Text>
                </Space>
              </div>
            )}
          </div>
        </Space>
      ),
      width: 250,
    },
    {
      title: 'Score',
      key: 'score',
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '4px' }}>
            <TrophyOutlined style={{ color: '#faad14', marginRight: '4px' }} />
            <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
              {record.totalScore || 0}
            </Text>
            <Text type="secondary">
              /{record.finalSummary?.maxPossibleScore || 0}
            </Text>
          </div>
          <Tag color={getRatingColor(record.totalScore, record.finalSummary?.maxPossibleScore)}>
            {getRatingText(record.totalScore, record.finalSummary?.maxPossibleScore)}
          </Tag>
        </div>
      ),
      sorter: (a, b) => (a.totalScore || 0) - (b.totalScore || 0),
      width: 120,
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_, record) => {
        const summary = record.finalSummary;
        if (!summary) return <Text type="secondary">N/A</Text>;
        
        return (
          <Space direction="vertical" size="small">
            <div>
              <Text strong>{summary.percentage}%</Text>
              <Text type="secondary"> overall</Text>
            </div>
            {summary.strongAreas.length > 0 && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Strong: {summary.strongAreas.slice(0, 2).join(', ')}
                  {summary.strongAreas.length > 2 && '...'}
                </Text>
              </div>
            )}
            {summary.improvementAreas.length > 0 && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Needs: {summary.improvementAreas.slice(0, 2).join(', ')}
                  {summary.improvementAreas.length > 2 && '...'}
                </Text>
              </div>
            )}
          </Space>
        );
      },
      width: 150,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {getStatusTag(record)}
          <div>
            <Space size="small">
              <CalendarOutlined style={{ color: '#666' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {dayjs(record.completedAt || record.timestamp).format('MMM DD, HH:mm')}
              </Text>
            </Space>
          </div>
        </Space>
      ),
      sorter: (a, b) => (a.completedAt || a.timestamp || 0) - (b.completedAt || b.timestamp || 0),
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => onCandidateSelect(record.id)}
              size="small"
            >
              View
            </Button>
          </Tooltip>
        </Space>
      ),
      width: 80,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredCandidates}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} of ${total} candidates`,
      }}
      scroll={{ x: 800 }}
      size="middle"
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
      }}
      rowClassName={(record, index) => 
        index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
      }
    />
  );
};

export default CandidateList;