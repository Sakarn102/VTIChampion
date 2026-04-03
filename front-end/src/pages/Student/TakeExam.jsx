import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Typography, Button, Card, Radio, Space, Progress, 
  Modal, Row, Col, Spin, message, Tag, Divider, Statistic 
} from "antd";
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  LeftOutlined, 
  RightOutlined,
  SendOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import takeExamApi from "../../api/takeExamApi";

const { Title, Text, Paragraph } = Typography;

export default function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examResultId, setExamResultId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const initExam = async () => {
      try {
        setLoading(true);
        // Start exam in backend
        const startRes = await takeExamApi.startExam({ examId: parseInt(examId) });
        setExamResultId(startRes.data || startRes);

        // Fetch questions
        const questionsRes = await takeExamApi.getQuestions(examId);
        const questionData = questionsRes.data || questionsRes || [];
        setQuestions(questionData);

        // Set duration from params or default to 60
        const durationMin = location.state?.duration || 60;
        setTimeLeft(durationMin * 60);
      } catch (error) {
        console.error("Init exam error:", error);
        message.error(`Lỗi khởi tạo: ${error}`);
        navigate("/student/exams");
      } finally {
        setLoading(false);
      }
    };
    initExam();
  }, [examId]);

  // Timer Effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft === null]);

  // Handle timeout
  useEffect(() => {
    if (timeLeft === 0 && !submitting && examResultId) {
       message.warning("Đã hết thời gian làm bài, hệ thống tự động nộp bài!");
       doSubmit();
    }
  }, [timeLeft, submitting, examResultId]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAnswer = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
    // Soft save to backend (optional, but requested in backend controller)
    takeExamApi.saveAnswer({
      examResultId,
      questionId,
      answerId: optionId
    }).catch(console.error);
  };

  const doSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await takeExamApi.submitExam(examResultId);
      Modal.success({
        title: "Đã nộp bài thành công!",
        content: (
          <div>
            <Title level={4}>Kết quả của bạn:</Title>
            <Statistic title="Điểm số" value={res.data?.score || res.score} suffix="/ 10" />
            <p style={{marginTop: '10px'}}>Số câu đúng: {res.data?.totalCorrect || res.totalCorrect} / {res.data?.totalQuestions || res.totalQuestions || questions.length}</p>
          </div>
        ),
        onOk: () => navigate("/student/results")
      });
    } catch (error) {
      message.error("Lỗi khi nộp bài!");
      setSubmitting(false); // Only set to false if error, so user can retry. If success, we navigate anyway.
    }
  };

  const handleSubmit = () => {
    Modal.confirm({
      title: "Xác nhận nộp bài",
      icon: <QuestionCircleOutlined />,
      content: "Bạn có chắc chắn muốn kết thúc bài thi và nộp bài không?",
      okText: "Nộp bài",
      cancelText: "Tiếp tục làm",
      onOk: doSubmit
    });
  };

  if (loading) return <div style={{textAlign: 'center', padding: '100px'}}><Spin size="large" tip="Đang chuẩn bị đề thi..." /></div>;
  if (!questions.length) return <div style={{textAlign: 'center', padding: '100px'}}><Text>Không tìm thấy câu hỏi.</Text></div>;

  const currentQ = questions[currentIdx];
  const progressPercent = Math.round((Object.keys(answers).length / questions.length) * 100);

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Bar */}
        <Row gutter={[24, 24]} align="middle" style={{ marginBottom: '24px' }}>
          <Col xs={24} md={12}>
             <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>Thoát</Button>
             <span style={{ marginLeft: '16px', fontWeight: 600, fontSize: '18px' }}>Đang thi: {currentIdx + 1} / {questions.length}</span>
             {location.state?.isPractice && <Tag color="green" style={{ marginLeft: '12px' }}>CHẾ ĐỘ LUYỆN TẬP</Tag>}
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Card bodyStyle={{ padding: '8px 20px' }} style={{ display: 'inline-block', borderRadius: '12px' }}>
              <Space size="large">
                <Text strong style={{ color: timeLeft < 300 ? '#ef4444' : '#1e293b' }}>
                  <ClockCircleOutlined /> Thời gian còn lại: {formatTime(timeLeft)}
                </Text>
                <Button type="primary" icon={<SendOutlined />} onClick={handleSubmit} loading={submitting}>Nộp bài</Button>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Question Display */}
          <Col xs={24} lg={16}>
            <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', minHeight: '500px' }}>
              <div style={{ padding: '20px' }}>
                 <Tag color="blue" style={{ marginBottom: '16px' }}>Câu hỏi {currentIdx + 1}</Tag>
                 <Title level={4} style={{ marginBottom: '40px', lineHeight: 1.6 }}>{currentQ.content}</Title>

                 <Radio.Group 
                  onChange={(e) => handleAnswer(currentQ.id, e.target.value)} 
                  value={answers[currentQ.id]} 
                  style={{ width: '100%' }}
                 >
                   <Space direction="vertical" style={{ width: '100%' }} size="large">
                     {currentQ.answers?.map((opt, idx) => (
                       <Radio.Button 
                        key={opt.id} 
                        value={opt.id} 
                        style={{ 
                          width: '100%', 
                          height: 'auto', 
                          padding: '16px 24px', 
                          borderRadius: '12px',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          border: answers[currentQ.id] === opt.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                          background: answers[currentQ.id] === opt.id ? '#eff6ff' : 'white'
                        }}
                       >
                         <span style={{ fontWeight: 600, marginRight: '12px' }}>{String.fromCharCode(65 + idx)}.</span>
                         {opt.content}
                       </Radio.Button>
                     ))}
                   </Space>
                 </Radio.Group>
              </div>

              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px 20px' }}>
                 <Button 
                  size="large" 
                  icon={<LeftOutlined />} 
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                 >Câu trước</Button>
                 
                 <Button 
                  size="large" 
                  type="primary" 
                  icon={<RightOutlined />} 
                  disabled={currentIdx === questions.length - 1}
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                 >Câu sau</Button>
              </div>
            </Card>
          </Col>

          {/* Navigation Panel */}
          <Col xs={24} lg={8}>
            <Card title="Danh sách câu hỏi" bordered={false} style={{ borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                   <Text type="secondary">Tiến độ hoàn thành</Text>
                   <Text strong>{progressPercent}%</Text>
                </div>
                <Progress percent={progressPercent} strokeColor="#3b82f6" showInfo={false} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {questions.map((q, idx) => (
                  <Button 
                    key={q.id}
                    style={{ 
                      height: '40px', 
                      borderRadius: '8px',
                      background: answers[q.id] ? '#3b82f6' : (currentIdx === idx ? '#dbeafe' : 'white'),
                      color: answers[q.id] ? 'white' : (currentIdx === idx ? '#2563eb' : '#64748b'),
                      border: currentIdx === idx ? '1px solid #2563eb' : '1px solid #e2e8f0',
                      fontWeight: 700
                    }}
                    onClick={() => setCurrentIdx(idx)}
                  >
                    {idx + 1}
                  </Button>
                ))}
              </div>

              <Divider />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '3px' }}></div>
                  <Text type="secondary">Đã trả lời</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#dbeafe', borderRadius: '3px', border: '1px solid #2563eb' }}></div>
                  <Text type="secondary">Đang chọn</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '3px' }}></div>
                  <Text type="secondary">Chưa làm</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
