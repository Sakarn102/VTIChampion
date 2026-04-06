import React, { useState } from 'react';
import { 
  Table, 
  Tag, 
  Button, 
  Input, 
  Space, 
  Card, 
  Typography, 
  Badge, 
  Avatar, 
  Row, 
  Col, 
  Statistic, 
  Tooltip,
  Dropdown,
  message
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  MoreOutlined, 
  MessageOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  WarningOutlined,
  UserOutlined,
  ExportOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const SupportManagement = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Mock data for support requests
  const mockSupports = [
    {
      id: "SUP-2024-001",
      user: { name: "Nguyễn Văn A", email: "vana@gmail.com", avatar: "" },
      subject: "Lỗi không thể nộp bài thi Java_06",
      category: "Kỹ thuật",
      date: "2024-04-03 20:30",
      priority: "High",
      status: "Pending"
    },
    {
      id: "SUP-2024-002",
      user: { name: "Trần Thị B", email: "thib@gmail.com", avatar: "" },
      subject: "Yêu cầu cấp lại mật khẩu tài khoản",
      category: "Tài khoản",
      date: "2024-04-03 18:45",
      priority: "Medium",
      status: "Processing"
    },
    {
      id: "SUP-2024-003",
      user: { name: "Lê Văn C", email: "vanc@gmail.com", avatar: "" },
      subject: "Thắc mắc về cách tính điểm bài thi trắc nghiệm",
      category: "Học vụ",
      date: "2024-04-02 14:15",
      priority: "Low",
      status: "Resolved"
    },
    {
      id: "SUP-2024-004",
      user: { name: "Phạm Minh D", email: "minhd@gmail.com", avatar: "" },
      subject: "Báo cáo lỗi hiển thị trên thiết bị di động",
      category: "Giao diện",
      date: "2024-04-02 09:00",
      priority: "High",
      status: "Pending"
    }
  ];

  const columns = [
    {
      title: 'Mã yêu cầu',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text strong style={{ color: '#2563eb' }}>#{id}</Text>,
    },
    {
      title: 'Người gửi',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar icon={<UserOutlined />} src={user.avatar} style={{ backgroundColor: '#e2e8f0' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Chuyên mục',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => <Tag color="blue" style={{ borderRadius: '6px' }}>{cat}</Tag>
    },
    {
      title: 'Nội dung hỗ trợ',
      dataIndex: 'subject',
      key: 'subject',
      render: (text) => (
        <div style={{ maxWidth: '300px' }}>
          <Text ellipsis={{ tooltip: text }} style={{ fontWeight: 500 }}>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Mức độ',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        let color = '#64748b';
        if (priority === 'High') color = '#ef4444';
        if (priority === 'Medium') color = '#f59e0b';
        return (
          <Space>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
            <span style={{ fontWeight: 600, color: color }}>{priority}</span>
          </Space>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          Pending: { color: 'error', icon: <ClockCircleOutlined />, label: 'Chờ xử lý' },
          Processing: { color: 'processing', icon: <SyncOutlined />, label: 'Đang xử lý' },
          Resolved: { color: 'success', icon: <CheckCircleOutlined />, label: 'Đã giải quyết' }
        };
        const st = statusMap[status] || { color: 'default', icon: <ClockCircleOutlined />, label: status };
        return <Tag icon={st.icon} color={st.color} style={{ borderRadius: '12px', padding: '2px 10px' }}>{st.label}</Tag>;
      }
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'date',
      key: 'date',
      render: (date) => <Text type="secondary">{date}</Text>
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      render: () => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined style={{ color: '#6366f1' }} />} />
          </Tooltip>
          <Tooltip title="Phản hồi">
            <Button type="text" icon={<MessageOutlined style={{ color: '#10b981' }} />} />
          </Tooltip>
          <Dropdown menu={{ items: [
            { key: '1', label: 'Duyệt hoàn thành', icon: <CheckCircleOutlined /> },
            { key: '2', label: 'Chuyển cấp trên', icon: <ExportOutlined /> },
          ] }}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Trung tâm hỗ trợ</Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>Quản lý và giải quyết các yêu cầu hỗ trợ từ học viên và giáo viên.</Text>
        </div>
        <Button type="primary" size="large" icon={<ExportOutlined />} style={{ borderRadius: '10px', fontWeight: 600 }}>Xuất báo cáo</Button>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={6}>
          <Card bordered={false} className="stat-card" style={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <Statistic title="Tổng yêu cầu" value={124} prefix={<MessageOutlined style={{ color: '#3b82f6' }} />} valueStyle={{ fontWeight: 800 }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} className="stat-card" style={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <Statistic title="Chưa xử lý" value={18} prefix={<ClockCircleOutlined style={{ color: '#ef4444' }} />} valueStyle={{ fontWeight: 800, color: '#ef4444' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} className="stat-card" style={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <Statistic title="Đang xử lý" value={42} prefix={<SyncOutlined spin style={{ color: '#f59e0b' }} />} valueStyle={{ fontWeight: 800, color: '#f59e0b' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} className="stat-card" style={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <Statistic title="Hoàn thành" value={64} prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />} valueStyle={{ fontWeight: 800, color: '#10b981' }} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            placeholder="Tìm kiếm theo mã, người gửi, nội dung..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            style={{ width: 400, borderRadius: '12px' }}
            size="large"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <Space>
            <Button size="large" icon={<FilterOutlined />} style={{ borderRadius: '10px' }}>Lọc nâng cao</Button>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={mockSupports} 
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          rowKey="id"
          style={{ padding: '0 0px' }}
        />
      </Card>
    </div>
  );
};

// Help helper for icons
const SyncOutlined = ({ spin, style }) => (
  <svg 
    viewBox="64 64 896 896" 
    focusable="false" 
    data-icon="sync" 
    width="1em" 
    height="1em" 
    fill="currentColor" 
    aria-hidden="true" 
    style={{ ...style, animation: spin ? 'antRotate 2s linear infinite' : 'none' }}
  >
    <path d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.9 27c40.9 17.3 77.7 42.1 109.4 73.7s56.4 68.5 73.7 109.4c15.9 37.7 25 77 26.9 116.9 1.4 28-21.9 51.6-50 51.6h-24.3c-24.5 0-45.5-17.6-49.3-41.9-1.2-7.8-2-15.7-2.3-23.7-.8-18.9-4.2-37.1-10-54.3-8.8-26.4-22.1-50.5-39.7-71.7a251.4 251.4 0 00-60-55.9c-23.3-15-49.1-25.5-76.5-31.2a252.23 252.23 0 00-105.1 0c-27.4 5.7-53.2 16.2-76.5 31.2a251.4 251.4 0 00-60 55.9c-17.6 21.2-31 45.3-39.7 71.7-5.8 17.2-9.2 35.4-10 54.3-.3 8.1-1.1 16-2.3 23.9-3.8 24.3-24.8 41.9-49.3 41.9H191c-28.1 0-51.4-23.6-50-51.6zM856 519.8l-123-.1c1 43.7 10 86.1 26.9 126 17.3 41 42.1 77.7 73.7 109.4a249.6 249.6 0 00109.4 73.7c42.4 17.9 87.4 27 133.9 27s91.5-9.1 133.9-27c40.9-17.3 77.7-42.1 109.4-73.7s56.4-68.5 73.7-109.4c15.9-37.7 25-77 26.9-116.9 1.4-28-21.9-51.6-50-51.6h-24.3c-24.5 0-45.5 17.6-49.3 41.9-1.2 7.8-2 15.7-2.3 23.7-.8 18.9-4.2 37.1-10 54.3-8.8 26.4-22.1 50.5-39.7 71.7-17.6 21.2-37.8 40.1-60 55.9-23.3 15-49.1 25.5-76.5 31.2a252.23 252.23 0 01105.1 0c27.4-5.7 53.2-16.2 76.5-31.2 22.3-14.3 42.4-33 60-55.9 17.6-21.2 30.9-45.3 39.7-71.7 5.8-17.2 9.2-35.4 10-54.3.3-8.1 1.1-16 2.3-23.9 3.8-24.3 24.8-41.9 49.3-41.9h24.3c28.1 0 51.4 23.6 50 51.6z"></path>
  </svg>
);

export default SupportManagement;
