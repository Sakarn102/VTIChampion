import React, { useState, useEffect } from "react";
import { Table, Button, Input, Tag, Space, Card, Typography, Spin, message, Row, Col, Statistic } from "antd";
import { SearchOutlined, PlayCircleOutlined, ClockCircleOutlined, BookOutlined, FilterOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import examApi from "../../api/ExamApi";
import "../../styles/Admin.css";

const { Title, Text } = Typography;

const ExamList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });
  const [keyword, setKeyword] = useState("");

  const fetchExams = async (params = {}) => {
    try {
      setLoading(true);
      const res = await examApi.getAll({
        page: params.page || pagination.current,
        size: params.size || pagination.pageSize,
        keyworld: params.keyword !== undefined ? params.keyword : keyword,
      });

      setExams(res.content || []);
      setPagination({
        ...pagination,
        total: res.totalElements || 0,
        current: (res.number || 0) + 1,
      });
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách bài thi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchExams({
      page: newPagination.current,
      size: newPagination.pageSize,
    });
  };

  const columns = [
    {
      title: "Tên Đề Thi",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <BookOutlined style={{ fontSize: '20px' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Mã: <Tag color="blue" style={{ fontSize: '10px', margin: 0 }}>{record.code}</Tag></div>
          </div>
        </div>
      ),
    },
    {
      title: "Chuyên mục",
      dataIndex: "category",
      key: "category",
      render: (cat) => <Tag color="geekblue" style={{ borderRadius: '12px', padding: '2px 12px' }}>{cat || "Chung"}</Tag>
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
      render: (min) => (
        <Space style={{ color: '#64748b' }}>
          <ClockCircleOutlined />
          <span>{min || 60} phút</span>
        </Space>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "Test" ? "volcano" : "green"}>
          {type === "Test" ? "BÀI THI" : "LUYỆN TẬP"}
        </Tag>
      )
    },
    {
      title: "Số câu hỏi",
      dataIndex: "questionCount",
      key: "questionCount",
      render: (count) => <Text strong>{count || 50} câu</Text>
    },
    {
      title: "Hành động",
      key: "actions",
      align: 'right',
      render: (_, record) => (
        <Button 
          type="primary" 
          shape="round" 
          icon={<PlayCircleOutlined />} 
          style={{ background: record.type === 'Practice' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', border: 'none' }}
          onClick={() => navigate(`/student/take-exam/${record.examId}`, { state: { duration: record.duration || 60, isPractice: record.type === 'Practice' } })}
        >
          {record.type === 'Practice' ? 'Luyện tập' : 'Vào thi ngay'}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Danh sách Đề thi</Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>Chọn một đề thi từ ngân hàng để bắt đầu đánh giá năng lực.</Text>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
         <Col xs={24} md={16}>
            <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
               <Input 
                placeholder="Tìm kiếm tên đề thi, mã đề..." 
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
                size="large"
                style={{ borderRadius: '10px' }}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={() => fetchExams({ keyword, page: 1 })}
               />
            </Card>
         </Col>
         <Col xs={24} md={8}>
            <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
               <Button block size="large" icon={<FilterOutlined />} style={{ borderRadius: '10px', fontWeight: 600 }}>Lọc nâng cao</Button>
            </Card>
         </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <Table
          rowKey="examId"
          dataSource={exams}
          columns={columns}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['8', '16', '32'],
          }}
          onChange={handleTableChange}
          style={{ cursor: 'pointer' }}
        />
      </Card>
    </div>
  );
};

export default ExamList;
