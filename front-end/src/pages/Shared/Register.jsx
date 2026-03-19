import { Link, useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import authApi from "../../api/auth/authApi";
import { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Divider } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

export default function Register() {
  const { Title, Text } = Typography;
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

      // Nếu lỗi trùng email, bạn có thể tự động focus vào ô Email
      if (errorMessage.includes("Email")) {
        form.focusField("email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 450,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Title level={2} style={{ color: "#1890ff" }}>
            Đăng Ký Tài Khoản
          </Title>
          <Text type="secondary">VTI Champion - Hệ thống quản lý học tập</Text>
        </div>

        <Form
          form={form}
          name="register_form"
          layout="vertical"
          onFinish={onRegister}
          scrollToFirstError
        >
          {/* Trường Họ và Tên */}
          <Form.Item
            name="fullname"
            label="Họ và tên"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên của bạn!" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Nguyễn Tuấn Anh"
            />
          </Form.Item>

          {/* Trường Username */}
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="tuananh_vti"
            />
          </Form.Item>

          {/* Trường Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: "email", message: "Email không đúng định dạng!" },
              { required: true, message: "Vui lòng nhập email của bạn!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="your-email@gmail.com"
            />
          </Form.Item>

          {/* Trường Mật khẩu */}
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="123"
            />
          </Form.Item>

          {/* Nút Đăng ký */}
          <Form.Item style={{ marginTop: 20 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              icon={<ArrowRightOutlined />}
            >
              Đăng ký & Nhận mã OTP
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>
          <Text type="secondary">Hoặc</Text>
        </Divider>

        <div style={{ textAlign: "center" }}>
          <Text>
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}
