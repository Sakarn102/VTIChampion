import React, { useState } from "react";
import { Card, Input, Button, Typography, Space, message } from "antd";
import { LockOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import authApi from "../../api/auth/authApi";

const { Title, Text } = Typography;

function ResetPassword(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // Lấy email từ trang trước truyền sang

  const [formData, setFormData] = useState({
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const { code, newPassword, confirmPassword } = formData;

    if (!code) {
      return message.warning("Vui lòng nhập mã OTP!");
    }

    if (!newPassword || !confirmPassword) {
      return message.warning("Vui lòng nhập đầy đủ mật khẩu mới!");
    }

    if (code.length < 6) return message.warning("Mã OTP gồm 6 số!");

    if (newPassword !== confirmPassword)
      return message.error("Mật khẩu xác nhận không khớp!");

    setLoading(true);
    try {
      // API: /api/v1/auth/reset-password
      await authApi.resetPassword({ email, code, newPassword });

      message.success(
        "Đổi mật khẩu thành công! Đang quay lại trang đăng nhập...",
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // Nếu sai mã, hiện lỗi và RESET ô OTP
      message.error(err.response?.data?.message || "Mã xác thực không đúng!");
      setFormData({ ...formData, code: "" }); // Reset chỉ ô OTP
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
      <Card style={{ width: 450, borderRadius: 12 }}>
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", textAlign: "center" }}
        >
          <Title level={3}>Đặt lại mật khẩu</Title>
          <Text>
            Mã xác thực đã gửi tới: <Text strong>{email}</Text>
          </Text>

          <Input.OTP
            length={6}
            value={formData.code}
            onChange={(val) => setFormData({ ...formData, code: val })}
          />

          <Input.Password
            placeholder="Mật khẩu mới"
            prefix={<LockOutlined />}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
          />

          <Input.Password
            placeholder="Xác nhận mật khẩu mới"
            prefix={<CheckCircleOutlined />}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />

          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleReset}
            disabled={
              formData.code.length < 6 ||
              !formData.newPassword ||
              !formData.confirmPassword
            }
          >
            Cập nhật mật khẩu
          </Button>
        </Space>
      </Card>
    </div>
  );
}

export default ResetPassword;
