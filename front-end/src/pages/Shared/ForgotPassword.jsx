import React, { useState } from "react";
import { Card, Input, Button, Typography, Space, message } from "antd";
import { MailOutlined, ArrowLeftOutlined, LockOutlined, CloseOutlined } from "@ant-design/icons";
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
        backgroundColor: "#f8fafc",
        padding: "20px"
      }}
    >
      <Card
        style={{ 
          width: 480, 
          borderRadius: "24px", 
          textAlign: "center",
          padding: "20px 10px",
          position: "relative",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
      >
        <Button 
          type="text" 
          icon={<CloseOutlined style={{ color: "#94a3b8" }}/>} 
          onClick={() => navigate("/login")}
          style={{ position: "absolute", top: "24px", right: "24px", background: "#f8fafc", borderRadius: "8px" }}
        />

        <div style={{ 
          margin: "0 auto 32px",
          width: "80px", 
          height: "80px", 
          borderRadius: "50%", 
          backgroundColor: "#e0f2fe", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <LockOutlined style={{ fontSize: "32px", color: "#2563eb" }} />
        </div>

        <Title level={2} style={{ fontWeight: 800, margin: "0 0 12px 0", color: "#1e293b" }}>
          Quên mật khẩu?
        </Title>
        <Text style={{ color: "#64748b", fontSize: "15px", display: "block", marginBottom: "40px", padding: "0 20px" }}>
          Nhập email đăng ký để nhận mã xác thực OTP.
        </Text>

        <div style={{ textAlign: "left", width: "100%" }}>
           <div style={{ fontSize: "12px", fontWeight: 800, color: "#475569", marginBottom: "8px", paddingLeft: "4px" }}>
              EMAIL
           </div>
           <Input
            size="large"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              borderRadius: "12px", 
              height: "56px", 
              backgroundColor: "#f0f9ff", 
              borderColor: "#bae6fd",
              fontSize: "16px"
            }}
          />

          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleSendOtp}
            style={{ 
              marginTop: "32px", 
              height: "64px", 
              borderRadius: "16px", 
              fontSize: "17px", 
              fontWeight: 700,
              backgroundColor: "#2563eb",
              boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)"
            }}
          >
            Gửi mã xác nhận
          </Button>

          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/login")}
            style={{ width: "100%", marginTop: "16px", color: "#64748b" }}
          >
            Quay lại đăng nhập
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ForgotPassword;
