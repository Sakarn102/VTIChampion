import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Button, Progress, List, Spin, message, Badge, Tag, Statistic, Space } from "antd";
import { 
  TrophyOutlined, 
  BookOutlined, 
  FireOutlined, 
  ArrowRightOutlined,
  PlayCircleOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import resultApi from "../../api/resultApi";
import examApi from "../../api/examApi";
import { useAuth } from "../../context/AuthContext";

const { Title, Text, Paragraph } = Typography;

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Assuming useAuth provides current user details

  const [history, setHistory] = useState([]);
  const [availableExams, setAvailableExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resHistory, resExams] = await Promise.all([
          resultApi.getHistory(),
          examApi.getAll({ size: 20 }) // Fetch latest 20 exams
        ]);

        const historyData = resHistory.data || resHistory || [];
        setHistory(Array.isArray(historyData) ? historyData : []);

        const examsData = resExams.data?.content || resExams?.content || resExams?.data || [];
        setAvailableExams(Array.isArray(examsData) ? examsData : []);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
        message.error("Không thể tải dữ liệu bảng điều khiển!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute stats
  const examsCompleted = history.length;
  const avgScore = history.length > 0 
    ? (history.reduce((acc, curr) => acc + (curr.score || 0), 0) / history.length).toFixed(1) 
    : 0;
  
  // Lọc bài thi đang mở (nếu cần logic status, hiện tại giả sử tất cả các bài được mở đang ACTIVE)
  const activeExamsCount = availableExams.length;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto", animation: "fadeIn 0.5s ease" }}>
      
      {/* Welcome Banner */}
      <div style={{ 
        background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", 
        padding: "40px", 
        borderRadius: "24px", 
        marginBottom: "32px",
        color: "white",
        boxShadow: "0 15px 30px rgba(37,99,235,0.2)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div>
          <Title level={2} style={{ color: "white", margin: 0, fontWeight: 800 }}>
            Chào mừng trở lại, {user?.fullname || user?.username || "Học viên"}! 👋
          </Title>
          <Paragraph style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px", marginTop: "8px", marginBottom: 0 }}>
            Hôm nay là một ngày tuyệt vời để học hỏi điều mới. Hãy chinh phục các kỳ thi nhé!
          </Paragraph>
        </div>
        <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", padding: "16px 24px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.2)" }}>
          <Text style={{ color: "rgba(255,255,255,0.8)", display: "block", marginBottom: "4px" }}>Tổng thời gian học</Text>
          <Title level={3} style={{ color: "white", margin: 0 }}>{examsCompleted * 45} <span style={{ fontSize: "16px", fontWeight: "normal" }}>phút</span></Title>
        </div>
      </div>

      {/* Stats Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05, fontSize: '120px' }}><TrophyOutlined /></div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                <TrophyOutlined />
              </div>
              <div style={{ flex: 1 }}>
                <Text type="secondary" style={{ fontSize: "15px", fontWeight: 600 }}>Điểm trung bình</Text>
                <Title level={2} style={{ margin: 0, color: "#1e293b" }}>{avgScore} <span style={{ fontSize: "18px", color: "#94a3b8" }}>/ 10</span></Title>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <Progress percent={avgScore * 10} strokeColor={{ '0%': '#3b82f6', '100%': '#10b981' }} strokeWidth={10} format={() => null} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05, fontSize: '120px' }}><BookOutlined /></div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "#fef9c3", color: "#ca8a04", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                <CheckCircleOutlined />
              </div>
              <div style={{ flex: 1 }}>
                <Text type="secondary" style={{ fontSize: "15px", fontWeight: 600 }}>Đã hoàn thành</Text>
                <Statistic value={examsCompleted} suffix="bài thi" valueStyle={{ fontSize: "32px", fontWeight: 700, margin: 0, color: "#1e293b" }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05, fontSize: '120px' }}><FireOutlined /></div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "#fef2f2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                <FireOutlined />
              </div>
              <div style={{ flex: 1 }}>
                <Text type="secondary" style={{ fontSize: "15px", fontWeight: 600 }}>Bài thi có sẵn</Text>
                <Statistic value={activeExamsCount} suffix="đề mở" valueStyle={{ fontSize: "32px", fontWeight: 700, margin: 0, color: "#1e293b" }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[32, 32]}>
        {/* Available Exams */}
        <Col xs={24} lg={14}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
              <BookOutlined style={{ color: "#3b82f6", marginRight: "8px" }} />Bài thi mới dành cho bạn
            </Title>
            <Button type="link" onClick={() => navigate("/student/exams")}>Khám phá toàn bộ <ArrowRightOutlined /></Button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {availableExams.length === 0 ? (
              <Card bordered={false} style={{ borderRadius: "16px", textAlign: "center", padding: "40px" }}>
                <Text type="secondary">Hiện chưa có bài thi nào đang mở.</Text>
              </Card>
            ) : (
               // Lấy 3 bài mới nhất để mock giao diện
               availableExams.slice(0, 4).map((exam, idx) => (
                <Card 
                  key={exam.id || idx} 
                  hoverable 
                  bordered={false} 
                  style={{ borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}
                  bodyStyle={{ padding: "20px" }}
                >
                  <Row align="middle" gutter={[16, 16]}>
                    <Col>
                      <div style={{ width: "56px", height: "56px", background: "#f8fafc", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0" }}>
                        <BookOutlined style={{ fontSize: "24px", color: "#64748b" }} />
                      </div>
                    </Col>
                    <Col flex={1}>
                      <Title level={5} style={{ margin: 0 }}>{exam.title}</Title>
                      <Space size="middle" style={{ marginTop: "4px" }}>
                        <Text type="secondary" style={{ fontSize: "13px" }}><ClockCircleOutlined /> Thời gian: {exam.duration || 60} phút</Text>
                        <Tag color="geekblue">{exam.subject || "Chung"}</Tag>
                      </Space>
                    </Col>
                    <Col>
                      <Button type="primary" shape="round" icon={<PlayCircleOutlined />} onClick={() => navigate(`/student/take-exam/${exam.id}`)}>
                        Bắt đầu thi
                      </Button>
                    </Col>
                  </Row>
                </Card>
               ))
            )}
          </div>
        </Col>

        {/* Recent History */}
        <Col xs={24} lg={10}>
          <Card 
            bordered={false} 
            style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", height: "100%" }}
            title={
              <Space>
                <HistoryOutlined style={{ color: "#8b5cf6" }} />
                <span style={{ fontWeight: 700 }}>Lịch sử gần nhất</span>
              </Space>
            }
            extra={<Button type="link" onClick={() => navigate("/student/results")}>Xem tất cả</Button>}
          >
            {history.length === 0 ? (
               <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <Text type="secondary">Chưa có dữ liệu lịch sử.</Text>
               </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={history.slice(0, 5)}
                renderItem={(item) => (
                  <List.Item
                    style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}
                    actions={[
                      <div style={{ textAlign: 'right' }}>
                        <Title level={4} style={{ color: item.score >= 8 ? "#10b981" : item.score >= 5 ? "#3b82f6" : "#ef4444", margin: 0 }}>
                          {item.score} đ
                        </Title>
                      </div>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Badge status={item.score >= 5 ? "success" : "error"} />}
                      title={<Text strong style={{ fontSize: "15px", color: "#1e293b" }}>{item.examTitle || `Bài thi ID ${item.examId}`}</Text>}
                      description={
                        <Space style={{ marginTop: "4px", fontSize: "13px" }}>
                          <CalendarOutlined /> {new Date(item.startTime || Date.now()).toLocaleDateString('vi-VN')}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
