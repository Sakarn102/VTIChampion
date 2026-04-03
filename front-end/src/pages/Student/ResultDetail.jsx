import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Typography, Card, Button, Space, Tag, Divider, 
  List, Row, Col, Spin, message, Result, Alert
} from "antd";
import { 
  ArrowLeftOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ClockCircleOutlined,
  BulbOutlined,
  UserOutlined
} from "@ant-design/icons";
import takeExamApi from "../../api/takeExamApi";

const { Title, Text, Paragraph } = Typography;

export default function ResultDetail() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await takeExamApi.getResultDetail(resultId);
        setData(res.data || res);
      } catch (error) {
        console.error(error);
        message.error("Không thể tải chi tiết kết quả.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [resultId]);

  if (loading) return <div style={{ textAlign: "center", padding: "100px" }}><Spin size="large" tip="Đang tải chi tiết bài làm..." /></div>;
  if (!data) return <Result status="404" title="Không tìm thấy kết quả" extra={<Button type="primary" onClick={() => navigate("/student/results")}>Quay lại danh sách</Button>} />;

  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleString("vi-VN");
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "32px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header Section */}
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate("/student/results")}
          style={{ marginBottom: "24px", borderRadius: "8px" }}
        >
          Quay lại lịch sử
        </Button>

        <Card bordered={false} style={{ borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", marginBottom: "32px", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", padding: "32px", color: "white" }}>
            <Row align="middle" justify="space-between">
              <Col>
                <Title level={2} style={{ color: "white", margin: 0, fontWeight: 800 }}>{data.examTitle}</Title>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}>Mã bài thi: {data.examCode}</Text>
              </Col>
              <Col style={{ textAlign: "right" }}>
                <div style={{ background: "rgba(255,255,255,0.2)", padding: "12px 24px", borderRadius: "16px", backdropFilter: "blur(4px)" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>ĐIỂM SỐ</div>
                    <div style={{ fontSize: "36px", fontWeight: 800 }}>{data.score} <span style={{ fontSize: "16px" }}>/ 10</span></div>
                </div>
              </Col>
            </Row>
          </div>
          
          <div style={{ padding: "24px" }}>
            <Row gutter={32}>
              <Col span={8}>
                <Space direction="vertical" size={2}>
                  <Text type="secondary"><ClockCircleOutlined /> Thời gian bắt đầu</Text>
                  <Text strong>{formatTime(data.startTime)}</Text>
                </Space>
              </Col>
              <Col span={8}>
                <Space direction="vertical" size={2}>
                  <Text type="secondary"><ClockCircleOutlined /> Thời gian hoàn thành</Text>
                  <Text strong>{formatTime(data.endTime)}</Text>
                </Space>
              </Col>
              <Col span={8}>
                 <Space direction="vertical" size={2}>
                  <Text type="secondary">Trạng thái</Text>
                  <Tag color={data.score >= 5 ? "success" : "error"} style={{ borderRadius: "6px", fontWeight: 700 }}>
                    {data.score >= 5 ? "ĐẠT" : "KHÔNG ĐẠT"}
                  </Tag>
                </Space>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Questions Detail */}
        <Title level={4} style={{ marginBottom: "20px", fontWeight: 700 }}>Chi tiết từng câu hỏi</Title>
        
        {data.questions?.map((q, idx) => {
          const isUserCorrect = q.options.find(opt => opt.answerId === q.chosenAnswerId)?.isCorrect;
          
          return (
            <Card 
              key={q.questionId} 
              style={{ marginBottom: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}
              bodyStyle={{ padding: "24px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <Tag color="blue" style={{ borderRadius: "4px" }}>Câu hỏi {idx + 1}</Tag>
                {q.chosenAnswerId ? (
                   isUserCorrect ? 
                    <Tag icon={<CheckCircleOutlined />} color="success">Chính xác</Tag> : 
                    <Tag icon={<CloseCircleOutlined />} color="error">Sai rồi</Tag>
                ) : (
                  <Tag color="warning">Chưa trả lời</Tag>
                )}
              </div>

              <Paragraph style={{ fontSize: "17px", fontWeight: 600, color: "#1e293b", marginBottom: "24px" }}>
                {q.content}
              </Paragraph>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {q.options.map((opt, oIdx) => {
                   const isChosen = opt.answerId === q.chosenAnswerId;
                   const isCorrect = opt.isCorrect;

                   let bgColor = "white";
                   let borderColor = "#e2e8f0";
                   let icon = null;

                   if (isCorrect) {
                     bgColor = "#f0fdf4";
                     borderColor = "#22c55e";
                     icon = <CheckCircleOutlined style={{ color: "#22c55e", marginLeft: "auto" }} />;
                   } else if (isChosen && !isCorrect) {
                     bgColor = "#fef2f2";
                     borderColor = "#ef4444";
                     icon = <CloseCircleOutlined style={{ color: "#ef4444", marginLeft: "auto" }} />;
                   }

                   return (
                     <div 
                       key={opt.answerId}
                       style={{ 
                         padding: "16px 20px", 
                         borderRadius: "12px", 
                         border: `1px solid ${borderColor}`,
                         background: bgColor,
                         display: "flex",
                         alignItems: "center",
                         transition: "all 0.2s"
                       }}
                     >
                       <span style={{ fontWeight: 700, marginRight: "12px", color: "#64748b" }}>{String.fromCharCode(65 + oIdx)}.</span>
                       <span style={{ flex: 1, fontWeight: (isChosen || isCorrect) ? 600 : 400 }}>{opt.content}</span>
                       {isChosen && <Tag style={{ marginLeft: "8px" }}>Lựa chọn của bạn</Tag>}
                       {icon}
                     </div>
                   );
                })}
              </div>

              {q.explanation && (
                <div style={{ marginTop: "24px", padding: "16px", background: "#f8fafc", borderRadius: "12px", borderLeft: "4px solid #3b82f6" }}>
                  <Text strong><BulbOutlined /> Lời giải chi tiết:</Text>
                  <Paragraph style={{ marginTop: "8px", color: "#475569", marginBottom: 0 }}>
                    {q.explanation}
                  </Paragraph>
                </div>
              )}
            </Card>
          );
        })}

        <div style={{ textAlign: "center", marginTop: "40px", paddingBottom: "60px" }}>
           <Button type="primary" size="large" onClick={() => navigate("/student/results")} style={{ borderRadius: "10px", height: "48px", padding: "0 40px" }}>
             Xong
           </Button>
        </div>
      </div>
    </div>
  );
}
