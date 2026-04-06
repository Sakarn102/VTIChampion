import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Input, Tag, Space, Card, Typography, Spin, message, Row, Col, Tooltip, Select } from "antd";
import { SearchOutlined, PlayCircleOutlined, ClockCircleOutlined, BookOutlined, LockOutlined, FilterOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import examApi from "../../api/examApi";
import takeExamApi from "../../api/takeExamApi";
import "../../styles/Admin.css";

const { Title, Text } = Typography;
const { Option } = Select;

const ExamList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allExams, setAllExams] = useState([]); // Toàn bộ data
  const [attemptsMap, setAttemptsMap] = useState({});
  const [checkingAttempts, setCheckingAttempts] = useState({});

  // Bộ lọc (xử lý client-side)
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Phân trang client-side
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await examApi.getAll({ page: 0, size: 1000 });
      const examList = res.content || [];
      setAllExams(examList);

      // Kiểm tra lượt thi song song
      if (examList.length > 0) {
        checkAttemptsForAll(examList.map(e => e.examId).filter(Boolean));
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách bài thi!");
    } finally {
      setLoading(false);
    }
  };

  const checkAttemptsForAll = async (examIds) => {
    const checking = {};
    examIds.forEach(id => { checking[id] = true; });
    setCheckingAttempts(checking);

    const results = await Promise.allSettled(
      examIds.map(id =>
        takeExamApi.checkAttempts(id)
          .then(r => ({ id, data: r.data || r }))
          .catch(() => ({ id, data: null }))
      )
    );

    const newMap = {};
    results.forEach(r => {
      if (r.status === 'fulfilled' && r.value.data) {
        newMap[r.value.id] = r.value.data;
      }
    });
    setAttemptsMap(prev => ({ ...prev, ...newMap }));
    setCheckingAttempts({});
  };

  useEffect(() => { fetchExams(); }, []);

  // Lọc client-side theo keyword + type
  const filteredExams = useMemo(() => {
    return allExams.filter(exam => {
      const matchKeyword =
        !keyword ||
        exam.title?.toLowerCase().includes(keyword.toLowerCase()) ||
        exam.code?.toLowerCase().includes(keyword.toLowerCase());
      const matchType =
        typeFilter === "ALL" ||
        (typeFilter === "Test" && exam.type === "Test") ||
        (typeFilter === "Practice" && exam.type === "Practice");
      return matchKeyword && matchType;
    });
  }, [allExams, keyword, typeFilter]);

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => { setCurrentPage(1); }, [keyword, typeFilter]);

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
      title: "Lượt làm bài",
      key: "attempts",
      align: "center",
      render: (_, record) => {
        const isPractice = record.type === 'Practice';

        if (isPractice) {
          return (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '22px', color: '#22c55e', lineHeight: 1 }}>∞</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>không giới hạn</div>
            </div>
          );
        }

        const info = attemptsMap[record.examId];
        const isChecking = checkingAttempts[record.examId];
        if (isChecking) return <Spin size="small" />;
        if (!info) return <Text type="secondary">--</Text>;

        const { maxAttempts, completedAttempts, remainingAttempts } = info;
        const color = remainingAttempts === 0 ? '#ef4444' : remainingAttempts === 1 ? '#f59e0b' : '#22c55e';

        return (
          <Tooltip title={`Đã làm: ${completedAttempts} lần | Giới hạn: ${maxAttempts} lần`}>
            <div style={{ textAlign: 'center', cursor: 'help' }}>
              <div style={{ fontWeight: 800, fontSize: '18px', color, lineHeight: 1 }}>
                {remainingAttempts}
                <span style={{ fontWeight: 400, fontSize: '12px', color: '#94a3b8' }}> / {maxAttempts}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>lượt còn lại</div>
            </div>
          </Tooltip>
        );
      }
    },
    {
      title: "Hành động",
      key: "actions",
      align: 'right',
      render: (_, record) => {
        const info = attemptsMap[record.examId];
        const isPractice = record.type === 'Practice';

        if (!isPractice && info && !info.canTakeExam) {
          return (
            <Tooltip title={`Bạn đã dùng hết ${info.maxAttempts} lượt làm bài thi này`}>
              <Button disabled shape="round" icon={<LockOutlined />} style={{ color: '#94a3b8', borderColor: '#e2e8f0', background: '#f8fafc' }}>
                Hết lượt thi
              </Button>
            </Tooltip>
          );
        }

        return (
          <Button
            type="primary"
            shape="round"
            icon={<PlayCircleOutlined />}
            style={{
              background: isPractice
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              border: 'none'
            }}
            onClick={() => navigate(`/student/take-exam/${record.examId}`, {
              state: { duration: record.duration || 60, isPractice }
            })}
          >
            {isPractice ? 'Luyện tập' : 'Vào thi ngay'}
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Danh sách Đề thi</Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Chọn một đề thi từ ngân hàng để bắt đầu đánh giá năng lực.
          {filteredExams.length !== allExams.length && (
            <span style={{ color: '#2563eb', fontWeight: 600, marginLeft: '8px' }}>
              ({filteredExams.length} / {allExams.length} kết quả)
            </span>
          )}
        </Text>
      </div>

      {/* Thanh tìm kiếm + bộ lọc */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={14}>
          <Input
            placeholder="Tìm kiếm tên đề thi, mã đề..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            size="large"
            allowClear
            style={{ borderRadius: '12px', height: '48px' }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Col>
        <Col xs={24} md={6}>
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            size="large"
            style={{ width: '100%', height: '48px' }}
          >
            <Option value="ALL">
              <Space><FilterOutlined />Tất cả loại</Space>
            </Option>
            <Option value="Test">
              <Tag color="volcano" style={{ margin: 0 }}>BÀI THI</Tag> Đề thi chính thức
            </Option>
            <Option value="Practice">
              <Tag color="green" style={{ margin: 0 }}>LUYỆN TẬP</Tag> Bài luyện tập
            </Option>
          </Select>
        </Col>
        <Col xs={24} md={4}>
          <Button
            size="large"
            style={{ width: '100%', height: '48px', borderRadius: '12px' }}
            onClick={() => { setKeyword(""); setTypeFilter("ALL"); }}
          >
            Xoá bộ lọc
          </Button>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <Table
          rowKey="examId"
          dataSource={filteredExams}
          columns={columns}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: PAGE_SIZE,
            total: filteredExams.length,
            showSizeChanger: false,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </Card>
    </div>
  );
};

export default ExamList;
