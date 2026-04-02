import React, { useState } from "react";
import {
  QuestionCircleOutlined,
  BookOutlined,
  MessageOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Card, Input, Row, Col, Collapse, Button, Tag } from "antd";
import "../../styles/Admin.css";
import "../../styles/TeacherDashboard.css";

const { Panel } = Collapse;

const HelpCenter = () => {
  const [searchText, setSearchText] = useState("");

  const faqs = [
    {
      category: "Quản lý Đề thi",
      questions: [
        {
          q: "Làm thế nào để tạo một bài thi mới?",
          a: 'Bạn vào mục "Quản lý Đề thi" -> Nhấn nút "Tạo bài thi" và điền các thông tin cần thiết.',
        },
        {
          q: "Tôi có thể sửa bài thi sau khi học viên đã nộp bài không?",
          a: "Để đảm bảo tính công bằng, bạn không thể sửa câu hỏi khi đã có ít nhất một học viên hoàn thành bài thi.",
        },
      ],
    },
    {
      category: "Quản lý Lớp học",
      questions: [
        {
          q: "Làm sao để thêm học viên vào lớp?",
          a: 'Quản trị viên (Admin) sẽ phụ trách việc thêm học viên vào lớp. Bạn có thể xem danh sách tại mục "Quản lý lớp học".',
        },
        {
          q: "Cách xuất bảng điểm cho cả lớp?",
          a: "Hiện tại bạn có thể xem điểm chi tiết của từng học viên trong trang chi tiết lớp học.",
        },
      ],
    },
    {
      category: "Tài khoản & Bảo mật",
      questions: [
        {
          q: "Thay đổi mật khẩu ở đâu?",
          a: "Bạn hãy truy cập vào mục Profile (góc trên bên phải) để cập nhật thông tin cá nhân và mật khẩu.",
        },
      ],
    },
  ];

  return (
    <div
      className="teacher-dashboard-container"
      style={{ maxWidth: "1200px", margin: "0 auto" }}
    >
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Trung tâm Hỗ trợ</h1>
          <p style={{ color: "#64748b" }}>
            Tìm câu trả lời cho mọi thắc mắc của bạn về VTI Champion.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Input
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          placeholder="Bạn cần hỗ trợ điều gì? Nhập từ khóa tại đây..."
          size="large"
          className="help-search-input"
          style={{
            maxWidth: "600px",
            height: "50px",
            borderRadius: "25px",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.1)",
            border: "2px solid #eff6ff",
          }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col span={8}>
          <Card
            hoverable
            className="admin-card help-card"
            style={{
              textAlign: "center",
              height: "100%",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                background: "#eff6ff",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                color: "#2563eb",
                fontSize: "24px",
              }}
            >
              <BookOutlined />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 800 }}>
              Tài liệu hướng dẫn
            </h3>
            <p style={{ color: "#64748b" }}>
              Khám phá các hướng dẫn chi tiết về mọi tính năng của giảng viên.
            </p>
            <Button type="link" icon={<RightOutlined />}>
              Xem thêm
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            className="admin-card help-card"
            style={{
              textAlign: "center",
              height: "100%",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                background: "#ecfdf5",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                color: "#10b981",
                fontSize: "24px",
              }}
            >
              <SafetyCertificateOutlined />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 800 }}>
              Video bài giảng
            </h3>
            <p style={{ color: "#64748b" }}>
              Xem video thao tác các bước tạo đề, chấm điểm và quản lý lớp học
              hiệu quả.
            </p>
            <Button
              type="link"
              icon={<RightOutlined />}
              style={{ color: "#10b981" }}
            >
              Xem thêm
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            className="admin-card help-card"
            style={{
              textAlign: "center",
              height: "100%",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                background: "#fff7ed",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                color: "#f97316",
                fontSize: "24px",
              }}
            >
              <MessageOutlined />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 800 }}>
              Cộng đồng Giáo viên
            </h3>
            <p style={{ color: "#64748b" }}>
              Tham gia diễn đàn thảo luận và chia sẻ kinh nghiệm cùng các đồng
              nghiệp.
            </p>
            <Button
              type="link"
              icon={<RightOutlined />}
              style={{ color: "#f97316" }}
            >
              Truy cập
            </Button>
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={16}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 800,
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <QuestionCircleOutlined style={{ color: "#2563eb" }} /> Câu hỏi
            thường gặp
          </h2>
          <Card
            className="admin-card"
            style={{ borderRadius: "16px", padding: "16px" }}
          >
            <Collapse ghost expandIconPlacement="end">
              {faqs.map((cat, i) =>
                cat.questions.map((item, j) => (
                  <Panel
                    header={
                      <span style={{ fontWeight: 600, fontSize: "15px" }}>
                        {item.q}
                      </span>
                    }
                    key={`${i}-${j}`}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <p style={{ color: "#475569", lineHeight: 1.6 }}>
                      {item.a}
                    </p>
                  </Panel>
                )),
              )}
            </Collapse>
          </Card>
        </Col>

        <Col span={8}>
          <h2
            style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px" }}
          >
            Liên hệ trực tiếp
          </h2>
          <Card
            className="admin-card"
            style={{
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(135deg, #1e40af, #2563eb)",
              color: "white",
            }}
          >
            <div style={{ padding: "8px" }}>
              <p style={{ color: "#dbeafe", marginBottom: "20px" }}>
                Đội ngũ hỗ trợ kỹ thuật luôn sẵn sàng phục vụ 24/7.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <MailOutlined style={{ fontSize: "20px" }} />
                <div>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    Email hỗ trợ
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    support@vtichampion.edu.vn
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <PhoneOutlined style={{ fontSize: "20px" }} />
                <div>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    Hotline kĩ thuật
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    024-6666-8888 (EXT: 102)
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <GlobalOutlined style={{ fontSize: "20px" }} />
                <div>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    Cổng góp ý
                  </div>
                  <div style={{ fontWeight: 600 }}>feedback.vti.academy</div>
                </div>
              </div>

              <Button
                block
                style={{
                  height: "45px",
                  borderRadius: "12px",
                  border: "none",
                  fontWeight: 700,
                  color: "#2563eb",
                }}
              >
                Gửi yêu cầu ngay
              </Button>
            </div>
          </Card>

          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              borderRadius: "12px",
              background: "#f8fafc",
              border: "1px dashed #cbd5e1",
            }}
          >
            <Tag color="blue" style={{ marginBottom: "8px" }}>
              Chính sách mới
            </Tag>
            <h4 style={{ margin: "0 0 8px 0" }}>
              Cập nhật quy định ra đề 2024
            </h4>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
              Vui lòng kiểm tra các tiêu chuẩn ra đề mới được áp dụng từ học kỳ
              1 năm nay...
            </p>
          </div>
        </Col>
      </Row>

      <div style={{ marginTop: "50px", textAlign: "center", color: "#94a3b8" }}>
        VTI Champion Support Center - v1.4.2
      </div>
    </div>
  );
};

export default HelpCenter;
