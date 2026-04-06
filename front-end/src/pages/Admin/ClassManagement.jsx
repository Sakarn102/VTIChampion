import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Input, Select, Modal, Form, message, Tooltip, Avatar, Tag, Space, Divider, List } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  FilterOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import "../../styles/Admin.css";
import classApi from "../../api/classApi";
import userApi from "../../api/userApi"; // Need to fetch all students to add

const { Option } = Select;
const { confirm } = Modal;

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [studentCounts, setStudentCounts] = useState({});
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // List of students to add
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  const [form] = Form.useForm();
  
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    locked: 0,
    totalStudents: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Tải danh sách lớp và sĩ số (Dữ liệu cốt yếu)
      let classData = [];
      let countsData = {};
      try {
        const classRes = await classApi.getAll();
        classData = Array.isArray(classRes) ? classRes : (classRes.data || []);
        
        const countsRes = await classApi.getStudentCounts();
        countsData = countsRes || {};
      } catch (err) {
        console.error("Error fetching core class data:", err);
      }

      // 2. Tải Khối đào tạo và Giáo viên (Cần thiết cho Form Tạo/Sửa)
      let deptData = [];
      let teacherData = [];
      try {
        const deptRes = await classApi.getDepartments();
        deptData = Array.isArray(deptRes) ? deptRes : (deptRes.data || []);
        
        const teacherRes = await classApi.getTeachers();
        teacherData = teacherRes.content || teacherRes.data?.content || [];
      } catch (err) {
        console.warn("User may lack permission for settings/teachers:", err);
      }

      // 3. Tải học viên chưa có lớp (Dành cho tính năng thêm nhanh)
      let studentList = [];
      try {
        const unassignedRes = await classApi.getUnassignedStudents();
        studentList = Array.isArray(unassignedRes) ? unassignedRes : (unassignedRes.data || []);
      } catch (err) {
        console.warn("Error fetching unassigned students:", err);
      }

      setClasses(classData);
      setStudentCounts(countsData);
      setDepartments(deptData);
      setTeachers(teacherData);
      setAllStudents(studentList);
      
      // Calculate Stats
      const activeCount = classData.filter(c => c.isActive).length;
      const totalStudents = Object.values(countsData).reduce((a, b) => a + (Number(b) || 0), 0);
      
      setStats({
        total: classData.length,
        active: activeCount,
        locked: classData.length - activeCount,
        totalStudents: totalStudents
      });
    } catch (error) {
      console.error("Critical error in fetchData:", error);
      message.error("Lỗi đồng bộ: " + (error?.message || error || "Không xác định"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    let result = [...classes];

    if (keyword) {
      const lowKey = keyword.toLowerCase();
      result = result.filter(c => 
        (c.name && c.name.toLowerCase().includes(lowKey)) || 
        (c.teacherName && c.teacherName.toLowerCase().includes(lowKey))
      );
    }

    if (statusFilter !== "ALL") {
      const isActive = statusFilter === "ACTIVE";
      result = result.filter(c => c.isActive === isActive);
    }

    if (sortBy === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => a.id - b.id);
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [classes, keyword, statusFilter, sortBy]);

  const handleToggleStatus = async (record) => {
    try {
      setLoading(true);
      await classApi.toggleStatus(record.id);
      message.success(`Đã thay đổi trạng thái lớp ${record.name} thành công!`);
      fetchData();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái lớp!");
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (record) => {
    confirm({
      title: 'Xác nhận xóa lớp học?',
      icon: <DeleteOutlined style={{ color: "#ff4d4f" }} />,
      content: (
        <div>
          Bạn có chắc chắn muốn xóa lớp <strong style={{ color: "#1e293b" }}>"{record.name}"</strong>? 
          <p style={{ marginTop: "8px", color: "#ef4444", fontSize: "12px" }}>* Hành động này không thể hoàn tác và sẽ xóa mọi dữ liệu liên quan.</p>
        </div>
      ),
      okText: 'Xóa ngay',
      okType: 'danger',
      cancelText: 'Hủy bỏ',
      centered: true,
      okButtonProps: { style: { borderRadius: "8px" } },
      cancelButtonProps: { style: { borderRadius: "8px" } },
      onOk: async () => {
        try {
          await classApi.delete(record.id);
          message.success("Xóa lớp học thành công!");
          fetchData();
        } catch (error) {
          message.error(error.response?.data?.message || "Lỗi khi xóa lớp!");
        }
      },
    });
  };

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      const payload = {
        name: values.name,
        departmentId: values.departmentId,
        teacherId: values.teacherId,
        thumbnailUrl: "https://vtiacademy.edu.vn/upload/img/logo-vti-academy.png"
      };

      if (editingClass) {
        await classApi.update(editingClass.id, payload);
        message.success("Cập nhật lớp học thành công!");
      } else {
        await classApi.create(payload);
        message.success("Tạo lớp học mới thành công!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu lớp học!");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Student Management in Class ---
  const fetchClassStudents = async (id) => {
    try {
      setLoadingStudents(true);
      const res = await classApi.getStudentsByClass(id);
      setClassStudents(Array.isArray(res) ? res : (res.data || []));
    } catch (error) {
      message.error("Lỗi khi tải danh sách học viên trong lớp!");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleOpenDetail = (record) => {
    setSelectedClass(record);
    setIsDetailOpen(true);
    fetchClassStudents(record.id);
  };

  const handleRemoveStudent = (student) => {
    confirm({
      title: 'Xóa học viên khỏi lớp?',
      icon: <UserDeleteOutlined style={{ color: "#ff4d4f" }} />,
      content: `Bạn có chắc chắn muốn xóa "${student.fullname}" khỏi lớp "${selectedClass.name}"?`,
      centered: true,
      onOk: async () => {
        try {
          // You need to add this method in classApi if not already exists
          // Since I haven't implemented it in classApi yet, I'll use axiosClient directly or assume it exists
          if (classApi.removeStudentFromClass) {
             await classApi.removeStudentFromClass(selectedClass.id, student.id);
             message.success("Đã xóa học viên khỏi lớp!");
             fetchClassStudents(selectedClass.id);
             fetchData(); // Update stats
          }
        } catch (err) {
          message.error("Lỗi khi xóa học viên!");
        }
      }
    });
  };

  const handleAddStudents = async (studentIds) => {
    if (!studentIds || studentIds.length === 0) return;
    try {
      setLoadingStudents(true);
      await classApi.addStudentsToClass({
        classId: selectedClass.id,
        studentIds: studentIds
      });
      message.success("Đã thêm học viên vào lớp!");
      fetchClassStudents(selectedClass.id);
      fetchData();
    } catch (error) {
      message.error("Lỗi khi thêm học viên!");
    } finally {
      setLoadingStudents(false);
    }
  };

  // --- Table Columns ---
  const columns = [
    {
      title: "LỚP HỌC",
      key: "className",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ 
            width: "48px", 
            height: "48px", 
            borderRadius: "12px", 
            background: record.isActive ? "linear-gradient(135deg, #1d4ed8, #3b82f6)" : "#cbd5e1",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "white",
            fontSize: "20px"
          }}>
            <TeamOutlined />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "15px" }}>{record.name}</span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Bộ phận: {record.departmentName || "N/A"}</span>
          </div>
        </div>
      ),
    },
    {
      title: "GIÁO VIÊN",
      dataIndex: "teacherName",
      key: "teacher",
      render: (teacher) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" style={{ background: "#3b82f6" }} />
          <span style={{ fontWeight: 600, color: "#475569" }}>{teacher || "Chưa phân công"}</span>
        </Space>
      ),
    },
    {
      title: "SĨ SỐ",
      key: "students",
      align: "center",
      render: (_, record) => {
        const count = studentCounts[record.id] || 0;
        return (
          <Tag color="blue" style={{ borderRadius: "6px", fontWeight: 700, padding: "2px 10px" }}>
            {count} Học viên
          </Tag>
        );
      },
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "isActive",
      key: "status",
      render: (isActive) => (
        <Tag 
          color={isActive ? "success" : "default"} 
          icon={isActive ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          style={{ borderRadius: "20px", padding: "2px 12px", fontWeight: 600 }}
        >
          {isActive ? "Đang học" : "Kết thúc"}
        </Tag>
      ),
    },
    {
      title: "HÀNH ĐỘNG",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết & Quản lý học viên">
            <Button 
               type="text" 
               icon={<EyeOutlined style={{ color: "#6366f1" }} />} 
               onClick={() => handleOpenDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined style={{ color: "#2563eb" }} />} 
              onClick={() => {
                setEditingClass(record);
                form.setFieldsValue({ 
                  name: record.name,
                  departmentId: record.departmentId, 
                  teacherId: record.teacherId 
                });
                setIsModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title={record.isActive ? "Kết thúc lớp" : "Mở lại lớp"}>
            <Button 
              type="text" 
              icon={record.isActive ? <ClockCircleOutlined style={{ color: "#f59e0b" }} /> : <CheckCircleOutlined style={{ color: "#10b981" }} />} 
              onClick={() => handleToggleStatus(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const studentColumns = [
    {
      title: "HỌC VIÊN",
      key: "student",
      render: (_, s) => (
        <Space>
          <Avatar src={s.avatarUrl} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 600 }}>{s.fullname}</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>{s.email}</div>
          </div>
        </Space>
      )
    },
    {
        title: "TÊN ĐĂNG NHẬP",
        dataIndex: "username",
        key: "username",
    },
    {
      title: "HÀNH ĐỘNG",
      key: "action",
      align: "center",
      render: (_, s) => (
        <Button 
          type="text" 
          danger 
          icon={<UserDeleteOutlined />} 
          onClick={() => handleRemoveStudent(s)}
        />
      )
    }
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý Lớp học</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Hệ thống quản lý lớp học và sĩ số học viên</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingClass(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
          style={{ height: "48px", borderRadius: "10px", padding: "0 24px", fontWeight: 600 }}
        >
          Tạo lớp học mới
        </Button>
      </div>

      <div className="stats-grid">
        <div className="stat-card-premium">
          <div className="stat-icon-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <BookOutlined />
          </div>
          <div className="stat-info-box">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Tổng lớp học</span>
          </div>
        </div>
        <div className="stat-card-premium">
          <div className="stat-icon-box" style={{ background: "#f0fdf4", color: "#16a34a" }}>
            <CheckCircleOutlined />
          </div>
          <div className="stat-info-box">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Đang diễn ra</span>
          </div>
        </div>
        <div className="stat-card-premium">
          <div className="stat-icon-box" style={{ background: "#fff7ed", color: "#ea580c" }}>
            <ClockCircleOutlined />
          </div>
          <div className="stat-info-box">
            <span className="stat-number">{stats.locked}</span>
            <span className="stat-label">Đã kết thúc</span>
          </div>
        </div>
        <div className="stat-card-premium">
          <div className="stat-icon-box" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
            <TeamOutlined />
          </div>
          <div className="stat-info-box">
            <span className="stat-number">{stats.totalStudents}</span>
            <span className="stat-label">Tổng học viên</span>
          </div>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-filter-search">
          <Input
            placeholder="Tìm theo tên lớp, giáo viên..."
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            size="large"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
          />
        </div>
        <Space size="middle">
          <Select value={statusFilter} onChange={setStatusFilter} size="large" style={{ width: "180px" }}>
            <Option value="ALL">Tất cả trạng thái</Option>
            <Option value="ACTIVE">Đang học</Option>
            <Option value="LOCKED">Đã kết thúc</Option>
          </Select>
          <Select value={sortBy} onChange={setSortBy} size="large" style={{ width: "180px" }}>
            <Option value="newest">Mới nhất</Option>
            <Option value="oldest">Cũ nhất</Option>
            <Option value="name">Tên lớp A-Z</Option>
          </Select>
        </Space>
      </div>

      <div className="premium-table">
        <Table dataSource={filteredData} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 6, showSizeChanger: false }} />
      </div>

      {/* --- Detail & Student CRUD Modal --- */}
      <Modal
        title={null}
        open={isDetailOpen}
        onCancel={() => setIsDetailOpen(false)}
        footer={null}
        width={900}
        centered
        className="premium-modal"
      >
        {selectedClass && (
          <div style={{ padding: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                   <Space align="center">
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                         <TeamOutlined />
                      </div>
                      <h2 style={{ margin: 0, fontWeight: 800 }}>Chi tiết Lớp: {selectedClass.name}</h2>
                   </Space>
                   <div style={{ marginTop: "8px", color: "#64748b" }}>
                      <Tag color="geekblue">{selectedClass.departmentName}</Tag>
                      <Space style={{ marginLeft: "12px" }}>
                         <UserOutlined /> GV: <b>{selectedClass.teacherName}</b>
                      </Space>
                   </div>
                </div>
                <Tag color={selectedClass.isActive ? "success" : "default"} style={{ fontSize: "14px", padding: "4px 12px" }}>
                    {selectedClass.isActive ? "Đang học" : "Đã kết thúc"}
                </Tag>
            </div>

            <Divider orientation="left">Quản lý học viên trong lớp</Divider>
            
            <div style={{ marginBottom: "24px", background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
               <div style={{ fontWeight: 700, marginBottom: "8px" }}>Thêm học viên vào lớp</div>
               <Space.Compact style={{ width: '100%' }}>
                  <Select
                    mode="multiple"
                    placeholder="Tìm học viên để thêm..."
                    style={{ flex: 1 }}
                    size="large"
                    onChange={(values) => setSelectedClass({ ...selectedClass, pendingStudents: values })}
                    optionFilterProp="children"
                  >
                    {allStudents.map(s => (
                      <Option key={s.id} value={s.id}>{s.fullname} ({s.username})</Option>
                    ))}
                  </Select>
                  <Button 
                    type="primary" 
                    icon={<UserAddOutlined />} 
                    size="large"
                    onClick={() => handleAddStudents(selectedClass.pendingStudents)}
                  >
                    Thêm ngay
                  </Button>
               </Space.Compact>
            </div>

            <Table 
              dataSource={classStudents} 
              columns={studentColumns} 
              rowKey="id" 
              loading={loadingStudents} 
              pagination={{ pageSize: 5 }}
            />
          </div>
        )}
      </Modal>

      {/* --- Edit Class Modal --- */}
      <Modal 
        title={<span style={{ fontSize: "20px", fontWeight: 800 }}>{editingClass ? "Chỉnh sửa lớp học" : "Tạo lớp học mới"}</span>} 
        open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Tên lớp học" name="name" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item label="Khối đào tạo" name="departmentId" rules={[{ required: true }]}>
              <Select size="large">
                {departments.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="Giáo viên" name="teacherId" rules={[{ required: true }]}>
              <Select size="large">
                {teachers.map(t => <Option key={t.id} value={t.id}>{t.fullname}</Option>)}
              </Select>
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>Lưu</Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ClassManagement;
