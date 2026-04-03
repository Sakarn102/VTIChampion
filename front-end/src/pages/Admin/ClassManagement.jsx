import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, message } from 'antd';
import { PlusOutlined, EyeOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import '../../styles/Admin.css';
import '../../styles/ClassManagement.css';

const ClassManagement = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/admin/get-all-class', { params: { size: 100 } });
        const data = res?.content || res?.data?.content || [];
        setClasses(data);
      } catch (err) {
        console.error('Lỗi load lớp học:', err);
        message.error('Không thể tải danh sách lớp học');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleViewDetail = (cls) => {
    navigate(`/admin/classes/${cls.id}`, { state: { classData: cls } });
  };

  const columns = [
    {
      title: 'Tên Lớp',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div className="class-mgt-className-wrap">
          <div className="class-mgt-className-icon">
            <TeamOutlined />
          </div>
          <span className="class-mgt-className-text">{text}</span>
        </div>
      )
    },
    {
      title: 'Giáo viên phụ trách',
      dataIndex: 'teacherName',
      key: 'teacherName',
      render: (text) => (
        <div className="class-mgt-teacher-wrap">
          <UserOutlined className="class-mgt-teacher-icon" />
          <span>{text || 'Chưa phân công'}</span>
        </div>
      )
    },
    {
      title: 'Sĩ số',
      dataIndex: 'studentCount',
      key: 'studentCount',
      render: (count) => (
        <Tag color="blue" className="class-mgt-students-tag">{count ?? 0} Học viên</Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <span className={`status-badge ${isActive !== false ? 'status-active' : 'status-blocked'}`}>
          {isActive !== false ? 'Đang học' : 'Kết thúc'}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div className="class-mgt-actions-wrap">
          <Button
            type="primary"
            ghost
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Xem & Quản lý
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Lớp học</h1>
      </div>

      <div className="admin-filter-bar">
        <Input.Search placeholder="Tìm theo tên lớp, giáo viên..." className="class-mgt-search" size="large" />
      </div>

      <div className="admin-table">
        <Table
          dataSource={classes}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'Chưa có lớp học nào' }}
        />
      </div>
    </>
  );
};

export default ClassManagement;
