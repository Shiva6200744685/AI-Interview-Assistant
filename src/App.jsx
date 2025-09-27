import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ConfigProvider, theme } from 'antd';
import Layout from './components/common/Layout';
import WelcomeBackModal from './components/common/WelcomeBackModal';
import { checkUnfinishedSession } from './store/slices/interviewSlice';
import './App.css';

const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
  const dispatch = useDispatch();
  const { hasUnfinishedSession } = useSelector(state => state.interview);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for unfinished sessions on app load
    dispatch(checkUnfinishedSession());
  }, [dispatch]);

  const themeConfig = {
    algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 8,
      colorBgContainer: isDarkMode ? '#001529' : '#ffffff',
    },
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <div className="App">
        <Layout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <WelcomeBackModal visible={hasUnfinishedSession} />
      </div>
    </ConfigProvider>
  );
}

export default App;