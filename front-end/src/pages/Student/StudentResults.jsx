import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Space, Card, Typography, Spin, message, Row, Col, Statistic } from "antd";
import { SearchOutlined, EyeOutlined, HistoryOutlined, TrophyOutlined, CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined, BookOutlined } from "@ant-design/icons";
import resultApi from "../../api/resultApi";
import "../../styles/Admin.css";

const { Title, Text } = Typography;

const StudentResults = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [keyword, setKeyword] = useState("");

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await resultApi.getHistory();
      const historyData = res.data || res || [];
      setResults(Array.isArray(historyData) ? historyData : []);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải lịch sử kết quả thi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const totalExams = results.length;
  const avgScore = totalExams > 0 
    ? (results.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalExams).toFixed(1) 
    : 0;
  const passedExams = results.filter(r => (r.score || 0) >= 4.0).length;

  const filteredResults = results.filter(item => 
    (item.examTitle || `Bài thi ${item.examId}`).toLowerCase().includes(keyword.toLowerCase())
  );

  const columns = [
    {
      title: "Thông tin bài thi",
      dataIndex: "examTitle",
      key: "examTitle",
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
            <HistoryOutlined style={{ fontSize: '18px' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>{text || `Đề thi ID ${record.examId}`}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Ngày thực hiện: {new Date(record.startTime).toLocaleDateString('vi-VN')}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "score",
      key: "status",
      render: (score) => (
        score >= 4.0 
        ? <Tag color="success" icon={<CheckCircleOutlined />} style={{ borderRadius: '12px', padding: '2px 12px' }}>ĐẠT</Tag>
        : <Tag color="error" icon={<CloseCircleOutlined />} style={{ borderRadius: '12px', padding: '2px 12px' }}>KHÔNG ĐẠT</Tag>
      )
    },
    {
      title: "Điểm số",
      dataIndex: "score",
      key: "score",
      render: (score) => {
        let color = '#3b82f6';
        if (score < 4.0) color = '#ef4444';
        else if (score >= 8.0) color = '#10b981';
        return (
          <span style={{ 
            color, 
            fontWeight: 800, 
            fontSize: '18px', 
            background: `${color}15`, 
            padding: '4px 16px', 
            borderRadius: '24px',
            border: `1px solid ${color}30`
          }}>
            {score.toFixed(1)}
          </span>
        );
      }
    },
    {
       title: "Hành động",
       key: "actions",
       align: 'right',
       render: () => (
         <Button 
           type="text" 
           icon={<EyeOutlined />} 
           style={{ color: '#6366f1', fontWeight: 600 }}
         >
           Chi tiết
         </Button>
       )
    }
  ];

  return (
    <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Lịch sử Kết quả</Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>Theo dõi hành trình học tập và kết quả qua các bài kiểm tra.</Text>
        </div>
        <Button size="large" icon={<CalendarOutlined />} style={{ borderRadius: '10px' }}>Lọc theo thời gian</Button>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <Statistic 
              title={<span style={{ fontWeight: 600, fontSize: '15px' }}>Tổng số bài thi</span>} 
              value={totalExams} 
              prefix={<BookOutlined style={{ color: '#3b82f6' }} />} 
              valueStyle={{ fontWeight: 800, color: '#1e293b' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <Statistic 
              title={<span style={{ fontWeight: 600, fontSize: '15px' }}>Điểm trung bình</span>} 
              value={avgScore} 
              prefix={<TrophyOutlined style={{ color: '#f59e0b' }} />} 
              valueStyle={{ fontWeight: 800, color: '#1e293b' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <Statistic 
              title={<span style={{ fontWeight: 600, fontSize: '15px' }}>Đã vượt qua</span>} 
              value={passedExams} 
              prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />} 
              valueStyle={{ fontWeight: 800, color: '#1e293b' }} 
              suffix={<span style={{fontSize: '14px', color: '#94a3b8'}}> / {totalExams}</span>}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginBottom: "20px" }}>
        <Input 
          placeholder="Tìm bài thi theo tên..." 
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
          size="large"
          style={{ width: 400, borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <Table
          rowKey="id"
          dataSource={filteredResults}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      </Card>
    </div>
  );
};

export default StudentResults;
