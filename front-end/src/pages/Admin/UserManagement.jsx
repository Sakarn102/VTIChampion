import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Input, Select, Modal, Form, message, Tooltip, Avatar, Upload, Switch } from "antd";
import {
  PlusOutlined,
  LockOutlined,
  EditOutlined,
  DeleteOutlined,
  UnlockOutlined,
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  IdcardOutlined,
  FilterOutlined,
  SafetyCertificateOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "../../styles/Admin.css";
import userApi from "../../api/userApi";

const { Option } = Select;

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    teachers: 0,
    students: 0,
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAll({
        page: 0, 
        size: 1000, 
      });
      
      console.log("API Response:", res); // Debug log (visible if devtools open)

      // Robust data extraction
      let rawContent = [];
      let total = 0;

      if (res) {
        if (Array.isArray(res)) {
          rawContent = res;
        } else if (res.content && Array.isArray(res.content)) {
          rawContent = res.content;
          total = res.totalElements || res.content.length;
        } else if (res.data && res.data.content && Array.isArray(res.data.content)) {
          rawContent = res.data.content;
          total = res.data.totalElements || res.data.content.length;
        } else if (res.data && Array.isArray(res.data)) {
          rawContent = res.data;
        }
      }

      const data = rawContent || [];
      setUsers(data);
      setPagination(prev => ({
        ...prev,
        total: total || data.length
      }));
      
      // Counting logic
      const counts = data.reduce((acc, user) => {
        const roleObj = user.role;
        const roleName = (typeof roleObj === 'string' ? roleObj : roleObj?.name || "").toUpperCase();
        
        if (roleName === "ADMIN") acc.admins++;
        else if (roleName === "TEACHER") acc.teachers++;
        else if (roleName === "STUDENT") acc.students++;
        return acc;
      }, { admins: 0, teachers: 0, students: 0 });

      setStats({
        total: data.length,
        admins: counts.admins,
        teachers: counts.teachers,
        students: counts.students,
      });
    } catch (error) {
      console.error("Lỗi fetch users:", error);
      message.error("Lỗi: " + (typeof error === 'string' ? error : "Không thể tải danh sách người dùng!"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Client-side filtering logic (FAST)
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // 1. Filter by keyword
    if (keyword) {
      const lowKey = keyword.toLowerCase();
      result = result.filter(u => 
        (u.username && u.username.toLowerCase().includes(lowKey)) || 
        (u.email && u.email.toLowerCase().includes(lowKey))
      );
    }

    // 2. Filter by role
    if (roleFilter !== "ALL") {
      result = result.filter(u => {
        const r = (u.role?.name || u.role || "").toUpperCase();
        return r === roleFilter;
      });
    }

    // 3. Sort logic
    if (sortBy === "name") {
      result.sort((a, b) => (a.username || "").localeCompare(b.username || ""));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => a.id - b.id);
    } else {
      // newest (default)
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [users, keyword, roleFilter, sortBy]);

  const handleRoleChange = (value) => {
    setRoleFilter(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearch = (value) => {
    setKeyword(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xóa người dùng",
      content: (
        <div style={{ marginTop: "12px" }}>
          Thao tác này <b>không thể hoàn tác</b>. <br/>
          Bạn có chắc chắn muốn xóa người dùng này khỏi hệ thống?
        </div>
      ),
      icon: <DeleteOutlined style={{ color: "#ef4444" }} />,
      okText: "Xóa vĩnh viễn",
      okType: "danger",
      cancelText: "Hủy",
      className: "ant-modal-confirm-premium",
      centered: true,
      onOk: async () => {
        try {
          await userApi.delete(id);
          message.success("Đã xóa người dùng thành công!");
          fetchUsers();
        } catch (error) {
          message.error("Lỗi khi xóa người dùng!");
        }
      },
    });
  };

  const handleToggleStatus = (record) => {
    const actionText = record.isActive ? "khóa" : "mở khóa";
    Modal.confirm({
      title: `Xác nhận ${actionText} tài khoản`,
      icon: record.isActive ? <LockOutlined style={{ color: "#f59e0b" }} /> : <UnlockOutlined style={{ color: "#10b981" }} />,
      content: (
        <div style={{ marginTop: "12px" }}>
          Bạn có chắc chắn muốn <b>{actionText}</b> người dùng <b>{record.username}</b>? 
          {record.isActive ? 
            " Người dùng này sẽ không thể đăng nhập vào hệ thống sau khi bị khóa." : 
            " Người dùng này sẽ có thể truy cập lại hệ thống bình thường."}
        </div>
      ),
      okText: record.isActive ? "Khóa tài khoản" : "Mở khóa",
      okType: record.isActive ? "danger" : "primary",
      cancelText: "Hủy",
      centered: true,
      className: "ant-modal-confirm-premium",
      onOk: async () => {
        try {
          await userApi.toggleStatus(record.id, !record.isActive);
          message.success(`Đã ${actionText} tài khoản thành công!`);
          
          setUsers(prev => prev.map(u => 
            u.id === record.id ? { ...u, isActive: !u.isActive } : u
          ));
        } catch (error) {
          console.error("Error toggling status:", error);
          message.error(`Không thể ${actionText} tài khoản. Vui lòng thử lại!`);
        }
      },
    });
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    // Determine the numeric ID for the role
    let currentRoleId = user.role?.id;
    if (!currentRoleId && user.role) {
      const name = (typeof user.role === 'string' ? user.role : user.role.name || "").toUpperCase();
      if (name === "ADMIN") currentRoleId = 3;
      else if (name === "STUDENT") currentRoleId = 4;
      else if (name === "TEACHER") currentRoleId = 5;
    }

    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      role: currentRoleId || 4, // Default to STUDENT (4) if not found
    });
    setAvatarPreview(user.avatarUrl);
    setAvatarFile(null);
    setIsModalOpen(true);
  };

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      if (editingUser) {
        const formData = new FormData();
        
        // Map string role to ID if form uses names or keep as is if it uses IDs
        const payload = {
          fullName: values.fullname,
          email: values.email,
          roleId: values.role, // values.role is ID
          status: editingUser.isActive // Stay as is
        };
        
        formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
        if (avatarFile) {
          formData.append("avatar", avatarFile);
        }
        await userApi.update(editingUser.id, formData);
        message.success("Cập nhật thông tin thành công!");
      } else {
        // Assume creation is still JSON or separate logic
        // await userApi.create(values);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể tải lên file JPG/PNG/WebP!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Kích thước ảnh phải nhỏ hơn 2MB!");
    }
    
    if (isJpgOrPng && isLt2M) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
    return false; // Prevent automatic upload
  };

  const columns = [
    {
      title: "NGƯỜI DÙNG",
      key: "user",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: record.isActive ? "linear-gradient(135deg, #3b82f6, #60a5fa)" : "#cbd5e1",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            {record.avatarUrl ? (
              <img src={record.avatarUrl} alt="" style={{ width: "100%", height: "100%", borderRadius: "10px", objectFit: "cover" }} />
            ) : (
              (record.username || "U")[0].toUpperCase()
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "14px" }}>{record.fullname || record.username}</span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Email: {record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "VAI TRÒ",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const roleName = (role?.name || role || "STUDENT").toUpperCase();
        let color = "#3b82f6";
        let bg = "#eff6ff";
        let displayLabel = "Student";
        
        if (roleName === "ADMIN") {
          color = "#9333ea";
          bg = "#f3e8ff";
          displayLabel = "Admin";
        } else if (roleName === "TEACHER") {
          color = "#ca8a04";
          bg = "#fef9c3";
          displayLabel = "Teacher";
        }

        return (
          <span
            style={{
              color,
              background: bg,
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 800,
            }}
          >
            {displayLabel}
          </span>
        );
      },
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <span className={`status-badge ${isActive ? "status-active" : "status-blocked"}`}>
          {isActive ? "Đang hoạt động" : "Bị khóa"}
        </span>
      ),
    },
    {
      title: "HÀNH ĐỘNG",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <Tooltip title="Chỉnh sửa">
            <button className="action-btn-custom" onClick={() => handleOpenEdit(record)}>
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title={record.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}>
            <button className="action-btn-custom" onClick={() => handleToggleStatus(record)}>
              {record.isActive ? <LockOutlined style={{ color: "#f59e0b" }} /> : <UnlockOutlined style={{ color: "#10b981" }} />}
            </button>
          </Tooltip>
          <Tooltip title="Xóa">
            <button className="action-btn-custom danger" onClick={() => handleDelete(record.id)}>
              <DeleteOutlined />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Danh sách Người dùng</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Quản lý và phân quyền thành viên trong hệ thống</p>
        </div>
        <button
          className="admin-btn-primary"
          onClick={handleOpenAdd}
          style={{ height: "48px", padding: "0 24px" }}
        >
          <PlusOutlined /> Thêm thành viên mới
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card-premium">
          <div className="stat-icon-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <TeamOutlined />
          </div>
          <div className="stat-info-box">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Tổng người dùng</span>
          </div>
        </div>
        <div className="stat-card-premium">
          <div className="stat-icon-box" style={{ background: "#f3e8ff", color: "#9333ea" }}>
            <SafetyCertificateOutlined />
          </div>
          <div className="stat-info-box">
            <span className="stat-number">{stats.admins}</span>
            <span className="stat-label">Quản trị viên</span>
          </div>
        </div>
        <div className="stat-card-premium">
          <div className="stat-icon-box" style={{ background: "#fef9c3", color: "#ca8a04" }}>
            <IdcardOutlined />
          </div>
          <div className="stat-info-box">
            <span className="stat-number">{stats.teachers}</span>
            <span className="stat-label">Giáo viên</span>
          </div>
        </div>
        <div className="stat-card-premium">
          <div className="stat-icon-box" style={{ background: "#f0fdf4", color: "#16a34a" }}>
            <UserOutlined />
          </div>
          <div className="stat-info-box">
            <span className="stat-number">{stats.students}</span>
            <span className="stat-label">Học viên</span>
          </div>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-filter-search">
          <Input
            placeholder="Tìm nhanh theo tên đăng nhập hoặc email..."
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            size="large"
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Select 
            value={roleFilter} 
            onChange={handleRoleChange}
            size="large" 
            className="admin-filter-select"
            suffixIcon={<FilterOutlined />}
          >
            <Option value="ALL">Tất cả vai trò</Option>
            <Option value="ADMIN">Quản trị viên</Option>
            <Option value="TEACHER">Giáo viên</Option>
            <Option value="STUDENT">Học viên</Option>
          </Select>
          <Select 
            value={sortBy}
            onChange={handleSortChange}
            size="large" 
            className="admin-filter-select"
            style={{ width: "160px" }}
          >
            <Option value="newest">Sắp xếp: Mới nhất</Option>
            <Option value="oldest">Sắp xếp: Cũ nhất</Option>
            <Option value="name">Theo tên A-Z</Option>
          </Select>
        </div>
      </div>

      <div className="premium-table">
        <Table
          rowKey="id"
          dataSource={filteredUsers}
          columns={columns}
          loading={loading}
          pagination={{
            ...pagination,
            className: "premium-pagination",
            showSizeChanger: true,
          }}
          onChange={(p) => setPagination(p)}
        />
      </div>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ 
              width: "40px", 
              height: "40px", 
              borderRadius: "10px", 
              background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "white" 
            }}>
              {editingUser ? <EditOutlined /> : <PlusOutlined />}
            </div>
            <span style={{ fontSize: "20px", fontWeight: 800 }}>
              {editingUser ? "Cập nhật thông tin" : "Thêm người dùng mới"}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
        className="premium-modal"
        centered
      >
        <Form 
          form={form}
          layout="vertical" 
          style={{ marginTop: "0px" }}
          onFinish={onFinish}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <div style={{ position: "relative" }}>
              <Avatar 
                size={100} 
                src={avatarPreview} 
                icon={<UserOutlined />}
                style={{ border: "4px solid #eff6ff", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
              />
              <Upload
                showUploadList={false}
                beforeUpload={beforeUpload}
                accept="image/*"
              >
                <Button 
                  type="primary"
                  shape="circle"
                  icon={<UploadOutlined />}
                  style={{ 
                    position: "absolute", 
                    bottom: 0, 
                    right: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)" 
                  }}
                />
              </Upload>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập username" }]}
            >
              <Input size="large" placeholder="Nhập username" disabled={!!editingUser} />
            </Form.Item>
            <Form.Item
              label="Họ và tên"
              name="fullname"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input size="large" placeholder="Nhập họ và tên đầy đủ" />
            </Form.Item>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" }
              ]}
            >
              <Input size="large" placeholder="Nhập địa chỉ email" />
            </Form.Item>
            <Form.Item
              label="Vai trò (Role)"
              name="role"
              rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
            >
              <Select size="large" placeholder="Chọn vai trò">
                <Option value={3}>Admin</Option>
                <Option value={5}>Teacher</Option>
                <Option value={4}>Student</Option>
              </Select>
            </Form.Item>
          </div>
          {!editingUser && (
            <Form.Item
              label="Mật khẩu khởi tạo"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password size="large" placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}
          
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
              disabled={submitting}
            >
              Hủy bỏ
            </button>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="admin-btn-primary" 
              loading={submitting}
              style={{ height: "48px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {editingUser ? "Lưu thay đổi" : "Tạo tài khoản"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default UserManagement;
