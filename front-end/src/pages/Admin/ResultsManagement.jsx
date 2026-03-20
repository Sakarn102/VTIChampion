import React from 'react';
import { Table, Tag, Button, Input, Space } from 'antd';
import { EyeOutlined, SearchOutlined, BarChartOutlined } from '@ant-design/icons';
import '../../styles/Admin.css';

const ResultsManagement = () => {
  const dataSource = [
    { key: '1', user: 'Lê Văn An', exam: 'TOEIC Đề 01', score: 9.5, time: '20/03/2024 14:30', duration: '115 phút' },
    { key: '2', user: 'Nguyễn B', exam: 'JS Fund Final', score: 7.0, time: '20/03/2024 15:15', duration: '40 phút' },
    { key: '3', user: 'Trần C', exam: 'SQL Advanced', score: 4.5, time: '19/03/2024 09:00', duration: '60 phút' },
    { key: '4', user: 'Hoàng D', exam: 'JS Fund Final', score: 8.5, time: '19/03/2024 10:20', duration: '42 phút' },
  ];

  const columns = [
    {
      title: 'Học viên',
      dataIndex: 'user',
      key: 'user',
      render: (text) => <span style={{ fontWeight: 700, color: '#1e293b' }}>{text}</span>
    },
    {
      title: 'Bài thi',
      dataIndex: 'exam',
      key: 'exam',
      render: (text) => <Tag color="geekblue" style={{borderRadius: '12px'}}>{text}</Tag>
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      key: 'score',
      render: (score) => {
        let color = '#10b981';
        if (score < 5) color = '#ef4444';
        else if (score < 8) color = '#f59e0b';
        return (
          <span style={{ 
            color, 
            fontWeight: 800, 
            fontSize: '16px', 
            background: `${color}15`, 
            padding: '4px 12px', 
            borderRadius: '20px' 
          }}>
            {score.toFixed(1)}
          </span>
        )
      }
    },
    {
      title: 'Thời điểm nộp',
      dataIndex: 'time',
      key: 'time',
      render: (time) => <span style={{ color: '#64748b', fontSize: '13px' }}>{time}</span>
    },
    {
      title: 'Thời gian làm',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Chi tiết',
      key: 'actions',
      render: () => (
        <Button type="primary" size="small" ghost icon={<EyeOutlined />} style={{ borderRadius: '8px' }}>
          Xem bài
        </Button>
      )
    }
  ];

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Kết quả</h1>
        <button className="admin-btn-outline">
          <BarChartOutlined /> Thống kê chung
        </button>
      </div>

      <div className="admin-filter-bar">
        <Input placeholder="Tìm học viên, tên bài..." prefix={<SearchOutlined />} style={{ width: 400 }} size="large" />
        <Space>
           <Tag color="green" style={{ cursor: 'pointer', padding: '4px 12px' }}>Pass</Tag>
           <Tag color="red" style={{ cursor: 'pointer', padding: '4px 12px' }}>Fail</Tag>
        </Space>
      </div>

      <div className="admin-table">
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </>
  );
};

export default ResultsManagement;
