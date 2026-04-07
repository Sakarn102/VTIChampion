import React, { useState } from "react";
import { Button, Result, Typography, Card, Spin } from "antd";
import { HourglassOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import userApi from "../../api/userApi";

const { Paragraph, Text } = Typography;

export default function StudentPending() {
  const navigate = useNavigate();
  const { logout, login } = useAuth();
  const [checking, setChecking] = useState(false);

  const handleRefresh = async () => {
    setChecking(true);
    try {
      const profileRes = await userApi.getProfile();
      const userData = profileRes?.data || profileRes;
      
      console.log('[StudentPending] hasClass:', userData?.hasClass);

      const token = localStorage.getItem("token");
      
      // Cập nhật localStorage trực tiếp trước khi redirect
      const normalizedRole = typeof userData?.role === 'object' 
        ? (userData.role?.name || 'STUDENT').toUpperCase().replace('ROLE_', '')
        : (userData?.role || 'STUDENT').toUpperCase().replace('ROLE_', '');
      
      const updatedUser = { ...userData, role: normalizedRole };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      if (userData?.hasClass === true) {
        // Hard redirect để AuthContext đọc lại localStorage mới
        window.location.href = '/student/dashboard';
      } else {
        setChecking(false);
        alert('Bạn chưa được thêm vào lớp nào. Vui lòng liên hệ giáo viên!');
      }
    } catch (err) {
      console.error("Lỗi kiểm tra trạng thái:", err);
      setChecking(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: "20px",
      }}
    >
      <Card
        style={{
          maxWidth: "600px",
          width: "100%",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
        bordered={false}
      >
        <Result
          icon={<HourglassOutlined style={{ color: "#3b82f6" }} />}
          title={
            <span style={{ fontWeight: 800, color: "#1e293b" }}>
              Tài khoản đang chờ duyệt lớp
            </span>
          }
          subTitle={
            <div style={{ marginTop: "16px" }}>
              <Paragraph style={{ fontSize: "16px", color: "#64748b" }}>
                Chào mừng bạn đã đến với <b>VTI Champion</b>! Tài khoản của bạn
                đã được tạo thành công, nhưng hiện tại bạn chưa được xếp vào
                lớp học nào.
              </Paragraph>
              <Paragraph style={{ fontSize: "16px", color: "#64748b" }}>
                Vui lòng đợi Giảng viên hoặc Quản trị viên thêm bạn vào danh
                sách lớp để có thể bắt đầu làm bài và luyện tập nhé.
              </Paragraph>
            </div>
          }
          extra={[
            <Button
              type="primary"
              size="large"
              key="refresh"
              icon={checking ? <Spin size="small" /> : <ReloadOutlined />}
              onClick={handleRefresh}
              loading={checking}
              style={{
                borderRadius: "8px",
                fontWeight: 600,
                padding: "0 32px",
              }}
            >
              {checking ? "Đang kiểm tra..." : "Kiểm tra trạng thái"}
            </Button>,
            <Button
              size="large"
              key="logout"
              onClick={logout}
              style={{ borderRadius: "8px", fontWeight: 600 }}
            >
              Đăng xuất
            </Button>,
          ]}
        />
        <div
          style={{
            textAlign: "center",
            marginTop: "32px",
            padding: "16px",
            background: "#eff6ff",
            borderRadius: "12px",
          }}
        >
          <Text type="secondary">
            Sau khi giáo viên thêm bạn vào lớp, nhấn <b>"Kiểm tra trạng thái"</b> để vào ngay mà không cần đăng xuất lại.
          </Text>
        </div>
      </Card>
    </div>
  );
}
