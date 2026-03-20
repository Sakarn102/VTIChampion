import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import { useState } from "react";
import authApi from "../../api/auth/authApi";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, Checkbox, message } from "antd";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // values sẽ bao gồm: usernameOrEmail, password và rememberMe (do name="rememberMe")
      const res = await authApi.login(values);
      const token = res.accessToken || res.data?.token || res.token;

      if (token) {
        // Xóa các token cũ để tránh xung đột
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        if (values.rememberMe) {
          // Nếu tích vào "Ghi nhớ": Lưu vào LocalStorage
          localStorage.setItem("token", token);
        } else {
          // Nếu không tích: Lưu vào SessionStorage (tắt tab là mất)
          sessionStorage.setItem("token", token);
        }

        message.success("Đăng nhập thành công");
        navigate("/home");
      } else {
        message.error("Đăng nhập thành công nhưng không thấy Token!");
      }
    } catch (err) {
      // Xử lý hiển thị lỗi từ backend nếu có
      const errorMsg =
        err.response?.data?.message ||
        "Tài khoản hoặc mật khẩu không chính xác!";
      message.error(errorMsg);
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
            onFinish={handleLogin}
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
                </div>
              }
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              style={{ marginBottom: "4px" }}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="************"
              />
            </Form.Item>

            <div style={{ textAlign: "right" }}>
              <a href="/forgot" style={{ fontSize: "13px", color: "#1890ff" }}>
                Quên mật khẩu?
              </a>
            </div>

            <Form.Item
              name="rememberMe"
              valuePropName="checked"
              style={{ marginBottom: "20px" }}
            >
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
