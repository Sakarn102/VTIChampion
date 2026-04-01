import { Link, useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import authApi from "../../api/auth/authApi";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onRegister = async (values) => {
    setLoading(true);
    try {
      await authApi.register(values);
      message.success("Đăng ký thành công! Hãy check email lấy mã xác thực.");
      navigate("/verify-otp", { state: { email: values.email } });
    } catch (err) {
      const errorMessage =
        err.response?.data || "Đăng ký thất bại, vui lòng thử lại!";
      message.error(errorMessage);

      if (errorMessage.includes("Email")) {
        form.focusField("email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content" style={{ maxWidth: '1000px' }}>
        <div className="login-brand-section">
          <div className="brand-overlay"></div>
          <div className="brand-info">
            <div className="logo-box">
              <CheckCircleOutlined style={{ fontSize: "32px", color: "#fff" }} />
            </div>
            <h1 className="brand-title">VTI Champion</h1>
            <p className="brand-subtitle">
              Gia nhập hàng ngàn học viên để chinh phục các kỳ thi lớn. Tạo tài khoản trong chưa đầy 1 phút!
            </p>
            <div className="brand-features" style={{ marginTop: '20px' }}>
              <div className="feature-item">✓ Cơ sở dữ liệu 12 triệu+ câu hỏi</div>
              <div className="feature-item">✓ Chấm điểm tự động siêu tốc</div>
              <div className="feature-item">✓ Lộ trình học tập AI cá nhân hóa</div>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-header">
            <h2>Tạo tài khoản mới!</h2>
            <p>Vui lòng điền thông tin để bắt đầu</p>
          </div>

          <Form
            form={form}
            onFinish={onRegister}
            layout="vertical"
            className="modern-form"
            size="large"
            scrollToFirstError
          >
            <Form.Item
              label="Họ và tên"
              name="fullname"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên của bạn!" }]}
              style={{ marginBottom: '16px' }}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Nguyễn Tuấn Anh"
              />
            </Form.Item>

            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
              style={{ marginBottom: '16px' }}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="tuananh_vti"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { type: "email", message: "Email không đúng định dạng!" },
                { required: true, message: "Vui lòng nhập email của bạn!" },
              ]}
              style={{ marginBottom: '16px' }}
            >
              <Input
                prefix={<MailOutlined className="input-icon" />}
                placeholder="your-email@gmail.com"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              style={{ marginBottom: '24px' }}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="************"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="login-btn"
              loading={loading}
              icon={<ArrowRightOutlined />}
              block
            >
              Đăng ký ngay
            </Button>

            <div className="register-link" style={{ marginTop: '20px' }}>
              Đã có tài khoản? <Link to="/login" style={{ fontWeight: 600 }}>Đăng nhập ngay</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
