import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import { useState } from "react";
import authApi from "../../api/auth/authApi";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, Checkbox, message } from "antd";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onLogin = async (values) => {
    setLoading(true);
    try {
      // 1. Gọi API login với tài khoản mới (test3@gmail.com)
      const res = await authApi.login(values);

      if (res && res.accessToken) {
        // 2. Lưu token vào LocalStorage để các trang khác dùng
        localStorage.setItem("token", res.accessToken);
        message.success("Đăng nhập thành công");

        // 3. Nhảy sang trang Home
        navigate("/home");
      } else {
        message.error("Đăng nhập thành công nhưng không thấy Token!");
      }
    } catch (err) {
      message.error(err || "Tài khoản hoặc mật khẩu không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-brand-section">
          <div className="brand-overlay"></div>
          <div className="brand-info">
            <div className="logo-box">
              <UserOutlined style={{ fontSize: "32px", color: "#fff" }} />
            </div>
            <h1 className="brand-title">VTI Champion</h1>
            <p className="brand-subtitle">
              Hệ thống luyện thi trắc nghiệm thông minh. Nâng tầm kiến thức,
              chinh phục thử thách.
            </p>
            <div className="brand-features">
              <div className="feature-item">✓ Ngân hàng câu hỏi đa dạng</div>
              <div className="feature-item">✓ Chấm điểm tức thì</div>
              <div className="feature-item">✓ Phân tích lộ trình học tập</div>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-header">
            <h2>Chào mừng trở lại!</h2>
            <p>Vui lòng đăng nhập để tiếp tục</p>
          </div>

          <Form
            onFinish={onLogin}
            layout="vertical"
            className="modern-form"
            size="large"
          >
            <Form.Item
              label="Email hoặc Username"
              name="usernameOrEmail"
              rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="anhn58022@gmail.com"
              />
            </Form.Item>

            <Form.Item
              label={
                <div className="password-label">
                  <span>Mật khẩu</span>
                  <a href="/forgot">Quên mật khẩu?</a>
                </div>
              }
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="••••••••"
              />
            </Form.Item>

            <Form.Item name="rememberMe" valuePropName="checked">
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="login-btn"
              loading={loading}
              block
            >
              Đăng nhập ngay
            </Button>

            <div className="register-link">
              Chưa có tài khoản?{" "}
              <a onClick={() => navigate("/register")}>Đăng ký ngay</a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
