import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout as AntLayout, Tabs, Switch, Space, Typography, Button } from 'antd';
import { UserOutlined, DashboardOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { setActiveTab } from '../../store/slices/uiSlice';
import ChatInterface from '../../interviewee/ChatInterface';
import Dashboard from '../../interviewer/Dashboard';

const { Header, Content } = AntLayout;
const { Title } = Typography;

const Layout = ({ isDarkMode, setIsDarkMode }) => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector(state => state.ui);
  const { isActive, isComplete } = useSelector(state => state.interview);
  
  const tabItems = [
    {
      key: 'interviewee',
      label: (
        <Space>
          <UserOutlined />
          Interviewee
        </Space>
      ),
      children: <ChatInterface />,
    },
    {
      key: 'interviewer',
      label: (
        <Space>
          <DashboardOutlined />
          Interviewer Dashboard
        </Space>
      ),
      children: <Dashboard />,
    },
  ];

  const handleTabChange = (key) => {
    dispatch(setActiveTab(key));
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        backgroundColor: isDarkMode ? '#001529' : '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Title level={3} style={{ 
          margin: 0, 
          color: isDarkMode ? '#fff' : '#1890ff' 
        }}>
          AI Interview Assistant
        </Title>
        
        <Space>
          {isActive && (
            <Button type="primary" size="small" ghost>
              Interview in Progress
            </Button>
          )}
          {isComplete && (
            <Button type="success" size="small" ghost>
              Interview Completed
            </Button>
          )}
          
          <Switch
            checked={isDarkMode}
            onChange={setIsDarkMode}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </Space>
      </Header>
      
      <Content style={{ 
        padding: '24px',
        backgroundColor: isDarkMode ? '#141414' : '#f5f5f5' 
      }}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          size="large"
          style={{ 
            backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
            borderRadius: '8px',
            padding: '16px',
            minHeight: 'calc(100vh - 140px)'
          }}
        />
      </Content>
    </AntLayout>
  );
};

export default Layout;