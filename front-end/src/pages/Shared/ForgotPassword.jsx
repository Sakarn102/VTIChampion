import React, { useState } from "react";
import { Card, Input, Button, Typography, Space, message } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/auth/authApi";

const { Title, Text } = Typography;

function ForgotPassword(props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) return message.warning("Vui lòng nhập Email!");

    setLoading(true);
    try {
      await authApi.forgotPassword(email);

      message.success("Mã OTP đã được gửi vào Email của bạn!");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      message.error(err.response?.data?.message || "Email không tồn tại!");
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
        hoverable
        style={{ width: 400, borderRadius: 12, textAlign: "center" }}
      >
        <Title level={3}>Quên mật khẩu?</Title>
        <Text type="secondary">
          Nhập email đăng ký để nhận mã xác thực OTP.
        </Text>

        <Space
          direction="vertical"
          size="middle"
          style={{ width: "100%", marginTop: 25 }}
        >
          <Input
            size="large"
            placeholder="Email của bạn"
            prefix={<MailOutlined />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleSendOtp}
          >
            Gửi mã xác nhận
          </Button>

          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/login")}
          >
            Quay lại đăng nhập
          </Button>
        </Space>
      </Card>
    </div>
  );
}

export default ForgotPassword;
