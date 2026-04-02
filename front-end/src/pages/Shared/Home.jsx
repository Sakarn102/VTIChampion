import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Row, Col, Card } from 'antd';
import { RocketOutlined, BookOutlined, AimOutlined, ArrowRightOutlined, CheckCircleOutlined, UserOutlined, AppstoreAddOutlined, SolutionOutlined } from '@ant-design/icons';
import '../../styles/Home.css';

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Header / Navbar */}
      <header style={{ padding: '20px 40px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 20px rgba(0,0,0,0.03)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px', boxShadow: '0 4px 10px rgba(37,99,235,0.3)' }}>
            V
          </div>
          <Title level={4} style={{ margin: 0, color: '#0f172a', fontWeight: 800, letterSpacing: '-0.5px' }}>VTI Champion</Title>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Button type="text" onClick={() => navigate('/register')} style={{ fontWeight: 600, color: '#64748b', fontSize: '15px' }}>
            Đăng ký tham gia
          </Button>
          <Button className="cta-button" type="primary" onClick={() => navigate('/login')} icon={<UserOutlined />} style={{ borderRadius: '8px', fontWeight: 600, height: '42px', padding: '0 24px', fontSize: '15px' }}>
            Đăng nhập
          </Button>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* === HERO SECTION === */}
        <section className="hero-section">
          <div className="hero-blob blob-1"></div>
          <div className="hero-blob blob-2"></div>
          
          <div className="hero-content" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
            {/* Left Copy */}
            <div className="animate-fade-in-up" style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2 }}>
              <Title level={1} style={{ fontSize: '64px', color: '#0f172a', marginBottom: '24px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.5px' }}>
                Nền tảng thi trắc nghiệm <br /> 
                <span className="gradient-text">thông minh & tối ưu</span>
              </Title>
              <Paragraph style={{ fontSize: '20px', color: '#64748b', maxWidth: '600px', marginBottom: '40px', lineHeight: 1.6 }}>
                Hệ thống đánh giá năng lực trực tuyến hàng đầu dành cho trường học và doanh nghiệp. Tự động chấm điểm, chống gian lận đa lớp và cung cấp lộ trình phát triển rõ ràng.
              </Paragraph>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Button className="cta-button" type="primary" size="large" onClick={() => navigate('/login')} style={{ height: '56px', padding: '0 36px', fontSize: '17px', borderRadius: '12px', fontWeight: 600 }}>
                  Bắt đầu ngay hôm nay <ArrowRightOutlined />
                </Button>
           
              </div>
            </div>

            {/* Right Graphic Mockup */}
            <div className="animate-fade-in-up float-element delay-200" style={{ flex: '1 1 400px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="ui-mockup" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="ui-mockup-header">
                  <div className="ui-mockup-dot red"></div>
                  <div className="ui-mockup-dot yellow"></div>
                  <div className="ui-mockup-dot green"></div>
                </div>
                <div className="ui-mockup-bar highlight w-3-4"></div>
                <div className="ui-mockup-bar w-full"></div>
                <div className="ui-mockup-bar w-1-2"></div>
                
                {/* Embedded Mini Card */}
                <div style={{ marginTop: '30px', background: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                      <CheckCircleOutlined />
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>98%</span>
                  </div>
                  <Typography.Text strong style={{ fontSize: '16px' }}>Tỷ lệ vượt qua môn học</Typography.Text>
                  <p style={{ margin: 0, marginTop: '8px', color: '#64748b', fontSize: '13px' }}>Tính toán thông minh dựa trên hơn 12,000 dữ liệu.</p>
                </div>
                {/* Floating element */}
                <div className="float-reverse" style={{ position: 'absolute', right: '-30px', bottom: '20px', background: 'white', borderRadius: '16px', padding: '16px 24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 10 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f59e0b' }}>⭐ Đánh giá 4.9/5</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === STATS / IMPACT SECTION === */}
        <section style={{ padding: '40px 20px', background: 'white', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '1200px', margin: '-80px auto 0', background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', display: 'flex', flexWrap: 'wrap', gap: '20px', border: '1px solid #f1f5f9' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#10b981', marginBottom: '8px' }}>50K+</div>
              <div style={{ color: '#64748b', fontWeight: 600, fontSize: '16px' }}>Học viên tin dùng</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '20px', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#3b82f6', marginBottom: '8px' }}>12M+</div>
              <div style={{ color: '#64748b', fontWeight: 600, fontSize: '16px' }}>Câu hỏi đã hoàn thành</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#8b5cf6', marginBottom: '8px' }}>99%</div>
              <div style={{ color: '#64748b', fontWeight: 600, fontSize: '16px' }}>Độ ổn định hệ thống</div>
            </div>
          </div>
        </section>

        {/* === FEATURES SECTION === */}
        <section style={{ padding: '120px 40px', background: 'white' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Title level={2} style={{ fontSize: '40px', fontWeight: 800, color: '#0f172a' }}>Mọi thứ bạn cần cho một kỳ thi</Title>
            <Paragraph style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>Được thiết kế tỉ mỉ để đáp ứng hoàn hảo nhu cầu từ cá nhân ôn nguyện tới tổ chức giải đấu quy mô lớn.</Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center" style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <Col xs={24} sm={12} lg={8}>
              <div className="glass-card">
                <div className="feature-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                  <AimOutlined />
                </div>
                <Title level={4} style={{ marginBottom: '16px', fontWeight: 700 }}>Ngân hàng đề vô hạn</Title>
                <Paragraph style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6 }}>Quản lý câu hỏi linh hoạt, hỗ trợ import/export đa định dạng. Thuật toán tự động xáo trộn đảm bảo mỗi học viên có một đề thi riêng biệt.</Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="glass-card delay-100">
                <div className="feature-icon-wrapper" style={{ background: '#fdf4ff', color: '#d946ef' }}>
                  <SolutionOutlined />
                </div>
                <Title level={4} style={{ marginBottom: '16px', fontWeight: 700 }}>Chấm điểm Real-time</Title>
                <Paragraph style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6 }}>Hệ thống tự động chấm tự luận và trắc nghiệm chưa tới 1s. Báo cáo chi tiết ngay sau khi nộp bài giúp học viên nhìn nhận lỗ hổng kiến thức.</Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="glass-card delay-200">
                <div className="feature-icon-wrapper" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                  <RocketOutlined />
                </div>
                <Title level={4} style={{ marginBottom: '16px', fontWeight: 700 }}>Lộ trình cá nhân hóa</Title>
                <Paragraph style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6 }}>Thu thập và phân tích dữ liệu lịch sử thi để AI đề xuất các bài tập yếu điểm. Giúp tăng 40% hiệu suất ôn luyện trong các kỳ thi lớn.</Paragraph>
              </div>
            </Col>
          </Row>
        </section>

        {/* === HOW IT WORKS === */}
        <section style={{ padding: '120px 40px', background: '#f8fafc' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Title level={2} style={{ fontSize: '40px', fontWeight: 800, color: '#0f172a' }}>Đơn giản hóa quy trình</Title>
            <Paragraph style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>Chỉ với 3 bước đơn giản, bạn đã có thể tổ chức và quản lý một kỳ thi đạt chuẩn quốc tế.</Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Col xs={24} md={8}>
              <div className="step-card">
                <div className="step-number">1</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '60px', height: '60px', background: '#e0e7ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontSize: '24px', marginBottom: '24px' }}>
                    <AppstoreAddOutlined />
                  </div>
                  <Title level={3} style={{ fontWeight: 700, marginBottom: '16px', fontSize: '24px' }}>Khởi tạo đề thi</Title>
                  <Paragraph style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.6 }}>Giảng viên import danh sách câu hỏi từ Excel hoặc tạo thủ công. Thuật toán AI cấu trúc đề thi thông minh.</Paragraph>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="step-card delay-100">
                <div className="step-number">2</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '60px', height: '60px', background: '#dbeafe', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontSize: '24px', marginBottom: '24px' }}>
                    <BookOutlined />
                  </div>
                  <Title level={3} style={{ fontWeight: 700, marginBottom: '16px', fontSize: '24px' }}>Tổ chức thi</Title>
                  <Paragraph style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.6 }}>Học viên làm bài trên giao diện tối giản, tập trung. Hệ thống có cơ chế cảnh báo chuyển tab và chống gian lận.</Paragraph>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="step-card delay-200">
                <div className="step-number">3</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '60px', height: '60px', background: '#dcfce7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontSize: '24px', marginBottom: '24px' }}>
                    <AimOutlined />
                  </div>
                  <Title level={3} style={{ fontWeight: 700, marginBottom: '16px', fontSize: '24px' }}>Trích xuất Báo cáo</Title>
                  <Paragraph style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.6 }}>Ban quản lý nhận bảng điểm tức thì. Thống kê biểu đồ điểm, phân tích độ phân mảnh năng lực hoàn chỉnh.</Paragraph>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {/* === CALL TO ACTION === */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <section className="cta-section">
            <div className="cta-inner">
              <Title level={2} style={{ fontSize: '48px', fontWeight: 900, color: 'white', marginBottom: '24px' }}>Tự tin chinh phục điểm số</Title>
              <Paragraph style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 40px' }}>
                Gia nhập mạng lưới của hàng chục ngàn học viên và vượt qua ranh giới của bản thân trong các kỳ thi sắp tới.
              </Paragraph>
              <Button className="cta-button-light" size="large" onClick={() => navigate('/login')} style={{ height: '60px', padding: '0 40px', fontSize: '18px', borderRadius: '12px', fontWeight: 700 }}>
                Tham gia miễn phí ngay
              </Button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '60px 40px', background: '#0f172a', color: '#94a3b8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#3b82f6', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                V
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'white' }}>VTI Champion</span>
            </div>
            <Paragraph style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>Nền tảng thi trắc nghiệm hiện đại & thông minh nhất. Tạo môi trường công bằng, an toàn và tối đa hóa năng lực thí sinh.</Paragraph>
          </div>
          <div style={{ display: 'flex', gap: '80px' }}>
            <div>
              <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '20px' }}>Sản phẩm</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Tính năng</a></li>
                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Đối tượng</a></li>
                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Bảng giá</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '20px' }}>Hỗ trợ</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Tài liệu</a></li>
                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Câu hỏi thường gặp</a></li>
                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Liên hệ</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1e293b', marginTop: '60px', paddingTop: '30px', textAlign: 'center', fontSize: '14px' }}>
          © 2026 VTI Champion System. Phát triển tại Việt Nam.
        </div>
      </footer>
    </div>
  );
}
