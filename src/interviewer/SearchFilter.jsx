import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Input, Select, Space, Button, Row, Col, Typography } from 'antd';
import { SearchOutlined, ClearOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { setSearchTerm, setSortBy, setSortOrder, clearCandidates } from '../store/slices/candidateSlice';

const { Text } = Typography;
const { Option } = Select;

const SearchFilter = () => {
  const dispatch = useDispatch();
  const { searchTerm, sortBy, sortOrder, candidates } = useSelector(state => state.candidate);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleSortChange = (value) => {
    dispatch(setSortBy(value));
  };

  const handleOrderChange = (value) => {
    dispatch(setSortOrder(value));
  };

  const handleClearSearch = () => {
    dispatch(setSearchTerm(''));
  };

  const handleClearAll = () => {
    dispatch(clearCandidates());
  };

  return (
    <Card size="small">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={handleSearchChange}
            prefix={<SearchOutlined />}
            suffix={
              searchTerm && (
                <Button
                  type="text"
                  size="small"
                  icon={<ClearOutlined />}
                  onClick={handleClearSearch}
                />
              )
            }
            allowClear
          />
        </Col>
        
        <Col xs={12} sm={6} md={4}>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            style={{ width: '100%' }}
            placeholder="Sort by"
          >
            <Option value="score">Score</Option>
            <Option value="name">Name</Option>
            <Option value="timestamp">Date</Option>
          </Select>
        </Col>
        
        <Col xs={12} sm={6} md={4}>
          <Select
            value={sortOrder}
            onChange={handleOrderChange}
            style={{ width: '100%' }}
            placeholder="Order"
          >
            <Option value="desc">
              <Space>
                <SortAscendingOutlined rotate={180} />
                Descending
              </Space>
            </Option>
            <Option value="asc">
              <Space>
                <SortAscendingOutlined />
                Ascending
              </Space>
            </Option>
          </Select>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Text type="secondary">
              {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
            </Text>
            
            {candidates.length > 0 && (
              <Button
                type="text"
                danger
                size="small"
                onClick={handleClearAll}
                style={{ fontSize: '12px' }}
              >
                Clear All Data
              </Button>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default SearchFilter;