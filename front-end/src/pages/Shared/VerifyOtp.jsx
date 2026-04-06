import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authApi from "../../api/auth/authApi";
import { Button, Input, message, Card, Typography, Space } from "antd";
import {
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function VerifyOtp(props) {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy email từ "state" mà trang Register đã truyền sang
  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  // Tạo ref để điều khiển ô Input
  const otpRef = useRef(null);
  const handleVerifyCode = async () => {
    if (otp.length < 6) {
      return message.warning("Vui lòng nhập đủ 6 số xác thực!");
    }
    setLoading(true);
    try {
      await authApi.verifyCode({ email, code: otp });
      message.success("Xác thực thành công! Đang về trang Login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Lỗi Backend:", err);
      message.error(err.response?.data || "Mã sai hoặc hết hạn!");
      setOtp("");
      setLoading(false);
      setTimeout(() => {
        otpRef.current?.focus();
      }, 100);
    } finally {
      if (otp !== "") setLoading(false);
    }
  };

  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleResendCode = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
        await authApi.resendOtp(email);
        message.success("Mã xác thực mới đã được gửi vào Email của bạn!");
        setCountdown(60); // Đợi 60s mới cho gửi lại
    } catch (err) {
        message.error("Không thể gửi mã, vui lòng thử lại!");
    } finally {
        setResending(false);
    }
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (!email) navigate("/login");
  }, [email, navigate]);

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
        style={{
          width: 400,
          borderRadius: 15,
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              Xác thực OTP
            </Title>
            <Text type="secondary">
              Mã xác nhận đã được gửi tới email:
              <br />
              <Text strong>{email}</Text>
            </Text>
          </div>

          <Input.OTP
            size="large"
            length={6}
            value={otp}
            onChange={(val) => setOtp(val)}
            disabled={loading}
          />

          <Button
            type="primary"
            size="large"
            block
            icon={<SafetyCertificateOutlined />}
            onClick={handleVerifyCode}
            loading={loading}
            style={{ height: 50, borderRadius: 8, fontWeight: 600 }}
          >
            {loading ? "Đang xác thực..." : "Xác nhận tài khoản"}
          </Button>

          <div style={{ marginTop: '10px' }}>
            <Text type="secondary">Không nhận được mã? </Text>
            <Button 
                type="link" 
                onClick={handleResendCode} 
                disabled={resending || countdown > 0}
                style={{ padding: 0, fontWeight: 700 }}
            >
                {resending ? "Đang gửi..." : countdown > 0 ? `Gửi lại sau (${countdown}s)` : "Gửi mã xác thực vào Email"}
            </Button>
          </div>

          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            disabled={loading}
            onClick={() => navigate("/login")}
            style={{ color: "#bfbfbf" }}
          >
            Quay lại trang Đăng nhập
          </Button>
        </Space>
      </Card>
    </div>
  );
}

export default VerifyOtp;
