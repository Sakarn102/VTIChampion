import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, Modal, Form, message } from "antd";
import {
  PlusOutlined,
  LockOutlined,
  EditOutlined,
  DeleteOutlined,
  UnlockOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "../../styles/Admin.css";
import userApi from "../../api/userApi";

const { Option } = Select;

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAll({
        page: pagination.current,
        size: pagination.pageSize,
      });
      // Giả sử API trả về Page object hoặc array
      const data = res.content || res.data || [];
      setUsers(data);
      setPagination((prev) => ({
        ...prev,
        total: res.totalElements || data.length,
      }));
    } catch (error) {
      console.error("Lỗi fetch users:", error);
      // Fallback data if API not exists yet to keep UI working for now
      // message.error("Không thể kết nối API người dùng (404)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.current]);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xóa người dùng",
      content: "Thao tác này không thể hoàn tác. Bạn có chắc chắn?",
      onOk: async () => {
        try {
          await userApi.delete(id);
          message.success("Đã xóa người dùng!");
          fetchUsers();
        } catch (error) {
          message.error("Lỗi khi xóa!");
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Avatar",
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      render: (url, record) => (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            overflow: "hidden",
          }}
        >
          {url ? (
            <img
              src={url}
              alt="avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            record.username[0].toUpperCase()
          )}
        </div>
      ),
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <span style={{ fontWeight: 700, color: "#1e293b" }}>{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const roleName = role?.name || role || "STUDENT";
        let color = "#3b82f6";
        let bg = "#eff6ff";
        if (roleName === "Admin" || roleName === "ADMIN") {
          color = "#9333ea";
          bg = "#f3e8ff";
        } else if (roleName === "Teacher" || roleName === "TEACHER") {
          color = "#ca8a04";
          bg = "#fef9c3";
        }
        return (
          <span
            style={{
              color,
              background: bg,
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 800,
            }}
          >
            {roleName}
          </span>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <span
          className={`status-badge ${isActive ? "status-active" : "status-blocked"}`}
        >
          {isActive ? "Active" : "Locked"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#3b82f6" }} />}
            title="Chỉnh sửa"
          />
          <Button
            type="text"
            icon={
              record.isActive ? (
                <LockOutlined style={{ color: "#fbbf24" }} />
              ) : (
                <UnlockOutlined style={{ color: "#10b981" }} />
              )
            }
            title={record.isActive ? "Khóa" : "Mở khóa"}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            title="Xóa"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý User</h1>
        <button
          className="admin-btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined /> Thêm thành viên
        </button>
      </div>

      <div className="admin-filter-bar">
        <Input.Search
          placeholder="Tìm theo Username, Email..."
          style={{ width: 300 }}
          size="large"
          onSearch={(v) => fetchUsers({ keyword: v })}
        />
        <Select defaultValue="ALL" size="large" style={{ width: 150 }}>
          <Option value="ALL">Tất cả vai trò</Option>
          <Option value="ADMIN">Quản trị viên</Option>
          <Option value="TEACHER">Giáo viên</Option>
          <Option value="STUDENT">Học viên</Option>
        </Select>
      </div>

      <div className="admin-table">
        <Table
          rowKey="id"
          dataSource={users}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onChange={(p) => setPagination(p)}
        />
      </div>

      <Modal
        title={
          <span style={{ fontSize: "20px", fontWeight: 800 }}>
            Thêm người dùng mới
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" style={{ marginTop: "20px" }}>
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true }]}
          >
            <Input size="large" placeholder="Nhập username" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input size="large" placeholder="Nhập địa chỉ email" />
          </Form.Item>
          <Form.Item
            label="Phân quyền (Role)"
            name="role"
            rules={[{ required: true }]}
          >
            <Select size="large" placeholder="Chọn vai trò">
              <Option value="ADMIN">Admin</Option>
              <Option value="TEACHER">Teacher</Option>
              <Option value="STUDENT">Student</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Mật khẩu khởi tạo"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password size="large" placeholder="Tự động hoặc nhập tay" />
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "32px",
            }}
          >
            <button
              type="button"
              className="admin-btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </button>
            <button type="submit" className="admin-btn-primary">
              Tạo mới
            </button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default UserManagement;
