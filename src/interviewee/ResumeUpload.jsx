import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Card, 
  Upload, 
  Button, 
  message, 
  Form, 
  Input, 
  Space, 
  Typography, 
  Alert,
  Spin,
  Row,
  Col
} from 'antd';
import { 
  InboxOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined 
} from '@ant-design/icons';
import { processResumeFile, validateResumeFile } from '../services/resumeParser';
import { setCandidateInfo } from '../store/slices/interviewSlice';

const { Dragger } = Upload;
const { Title, Text, Paragraph } = Typography;

const ResumeUpload = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [parsedInfo, setParsedInfo] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const uploadProps = {
    name: 'resume',
    multiple: false,
    accept: '.pdf,.docx',
    beforeUpload: (file) => {
      const validation = validateResumeFile(file);
      if (!validation.isValid) {
        message.error(validation.error);
        return Upload.LIST_IGNORE;
      }
      handleFileUpload(file);
      return false; // Prevent default upload
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
    try {
      const result = await processResumeFile(file);
      
      if (result.name && result.email && result.phone) {
        // All info extracted, proceed directly
        const candidateInfo = {
          name: result.name,
          email: result.email,
          phone: result.phone,
          resumeInfo: result,
          submittedAt: Date.now(),
        };
        dispatch(setCandidateInfo(candidateInfo));
        message.success('Resume parsed successfully! Preparing your interview...');
        setFileUploaded(true);

      } else {
        // Some info is missing, show the form for user to complete
        setParsedInfo(result);
        setFileUploaded(true);
        form.setFieldsValue({
          name: result.name || '',
          email: result.email || '',
          phone: result.phone || '',
        });
        setShowForm(true);
        message.warning('Resume uploaded successfully! Please fill in any missing information.');
      }
    } catch (error) {
      message.error(error.message || 'Failed to process resume');
      console.error('Resume processing error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (values) => {
    const candidateInfo = {
      ...values,
      resumeInfo: parsedInfo,
      submittedAt: Date.now(),
    };
    
    dispatch(setCandidateInfo(candidateInfo));
    message.success('Information saved! Preparing your interview...');
  };

  const getMissingFields = () => {
    if (!parsedInfo) return [];
    const missing = [];
    if (!parsedInfo.name) missing.push('Name');
    if (!parsedInfo.email) missing.push('Email');
    if (!parsedInfo.phone) missing.push('Phone');
    return missing;
  };

  return (
    
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={3}>
            <FileTextOutlined /> Upload Your Resume
          </Title>
          <Paragraph type="secondary">
            Please upload your resume in PDF or DOCX format. We'll extract your basic information 
            and start the interview process.
          </Paragraph>
        </div>

        {!fileUploaded ? (
          <Card>
            <Spin spinning={loading} tip="Processing resume...">
              <Dragger {...uploadProps} style={{ padding: '20px' }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text">
                  Click or drag your resume file to this area
                </p>
                <p className="ant-upload-hint">
                  Support PDF and DOCX formats. Maximum file size: 10MB
                </p>
              </Dragger>
            </Spin>
          </Card>
        ) : (
          <Card 
            title={
              <Space>
                <FileTextOutlined style={{ color: '#52c41a' }} />
                Resume Uploaded Successfully
              </Space>
            }
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {parsedInfo && (
                <Alert
                  message="Extraction Results"
                  description={
                    <div>
                      {getMissingFields().length === 0 ? (
                        <Text type="success">
                          ✓ All required information extracted successfully!
                        </Text>
                      ) : (
                        <Text type="warning">
                          Please fill in missing information: {getMissingFields().join(', ')}
                        </Text>
                      )}
                    </div>
                  }
                  
                  type={getMissingFields().length === 0 ? 'success' : 'warning'}
                  showIcon
                />
              )}
              div
              <Button 
                type="link" 
                onClick={() => {
                  setFileUploaded(false);
                  setParsedInfo(null);
                  setShowForm(false);
                  form.resetFields();
                }}
              >
                Upload Different Resume
              </Button>
            </Space>
          </Card>
        )}

        {showForm && (
          <Card title="Verify Your Information">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit}
              size="large"
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[
                      { required: true, message: 'Please enter your full name' },
                      { min: 2, message: 'Name must be at least 2 characters' },
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Enter your full name"
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined />} 
                      placeholder="Enter your email address"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: 'Please enter your phone number' },
                  { 
                    pattern: /^[\+]?[\d\s\-\(\)]{10,}$/, 
                    message: 'Please enter a valid phone number' 
                  },
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="Enter your phone number"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large"
                  style={{ minWidth: '200px' }}
                >
                  Start Interview
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}

        <Card size="small">
          <Alert
            message="Privacy Notice"
            description="Your resume and personal information will only be used for this interview process and will be handled securely."
            type="info"
            showIcon
          />
        </Card>
      </Space>
    </div>
  );
};

export default ResumeUpload;