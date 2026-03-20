import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../api/auth/authApi";
import userApi from "../../api/userApi";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, Checkbox, message, Divider } from "antd";
import "../../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onLogin = async (values) => {
    setLoading(true);
    try {
      const res = await authApi.login(values);
      if (res && res.accessToken) {
        // Lưu token tạm để fetch profile
        localStorage.setItem("token", res.accessToken);
        
        // Lấy profile thật từ DB để biết chính xác Role
        const profileRes = await userApi.getProfile();
        const userData = profileRes.data || profileRes;
        
        // Save to AuthContext - Login now handles role normalization
        login(userData, res.accessToken);
        
        message.success("Đăng nhập thành công!");
        navigate("/"); // HomeRedirect sẽ lo phần còn lại
      }
    } catch (err) {
      console.error(err);
      message.error(typeof err === 'string' ? err : "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = (role) => {
    const mockUser = {
      id: 99,
      username: `mock_${role.toLowerCase()}`,
      fullname: `Mock ${role}`,
      email: `${role.toLowerCase()}@test.com`,
      role: role,
      avatarUrl: null
    };
    login(mockUser, "mock-token-xyz");
    message.info(`Mock login as ${role}`);
    navigate("/");
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
              <a onClick={() => navigate("/register")}>Đăng ký ngay</a>
            </div>

            <Divider style={{ margin: '20px 0' }}>Hoặc Đăng nhập nhanh (Mock)</Divider>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <Button size="small" onClick={() => handleMockLogin('ADMIN')}>Admin</Button>
              <Button size="small" onClick={() => handleMockLogin('TEACHER')}>Teacher</Button>
              <Button size="small" onClick={() => handleMockLogin('STUDENT')}>Student</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
