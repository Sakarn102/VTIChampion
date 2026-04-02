import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, Select, Tag } from 'antd';
import { PlusOutlined, UserOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import '../../styles/Admin.css';
import '../../styles/ClassManagement.css';

const { Option } = Select;

const ClassManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const dataSource = [
    { key: '1', className: 'VTI_React_01', teacher: 'Nguyễn Văn A', students: 25, status: 'Active' },
    { key: '2', className: 'VTI_Java_02', teacher: 'Trần Thị B', students: 18, status: 'Active' },
    { key: '3', className: 'VTI_AWS_03', teacher: 'Lê Văn C', students: 30, status: 'Ended' },
    { key: '4', className: 'VTI_Python_04', teacher: 'Hoàng Văn D', students: 12, status: 'Active' },
  ];

  const columns = [
    {
      title: 'Tên Lớp',
      dataIndex: 'className',
      key: 'className',
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
      dataIndex: 'teacher',
      key: 'teacher',
      render: (text) => (
        <div className="class-mgt-teacher-wrap">
          <UserOutlined className="class-mgt-teacher-icon" />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: 'Sĩ số',
      dataIndex: 'students',
      key: 'students',
      render: (count) => (
        <Tag color="blue" className="class-mgt-students-tag">{count} Học viên</Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-badge ${status === 'Active' ? 'status-active' : 'status-blocked'} ${status === 'Ended' ? 'class-mgt-status-ended' : ''}`}>
          {status === 'Active' ? 'Đang học' : 'Kết thúc'}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: () => (
        <div className="class-mgt-actions-wrap">
          <Button type="text" icon={<EditOutlined className="class-mgt-icon-edit" />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </div>
      )
    }
  ];

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Lớp học</h1>
        <button className="admin-btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusOutlined /> Tạo lớp mới
        </button>
      </div>

      <div className="admin-filter-bar">
        <Input.Search placeholder="Tìm theo tên lớp, giáo viên..." className="class-mgt-search" size="large" />
        <Select defaultValue="ALL" size="large" className="class-mgt-select">
          <Option value="ALL">Tất cả giáo viên</Option>
          <Option value="1">Nguyễn Văn A</Option>
          <Option value="2">Trần Thị B</Option>
        </Select>
      </div>

      <div className="admin-table">
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 6 }} />
      </div>

      <Modal title={<span className="class-mgt-modal-title">Tạo lớp học mới</span>} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form layout="vertical" className="class-mgt-form">
          <Form.Item label="Tên lớp học" name="className" rules={[{ required: true }]}>
            <Input size="large" placeholder="Ví dụ: VTI_REACT_2024" />
          </Form.Item>
          <Form.Item label="Giáo viên phụ trách" name="teacher" rules={[{ required: true }]}>
            <Select size="large" placeholder="Chọn giáo viên">
              <Option value="1">Nguyễn Văn A</Option>
              <Option value="2">Trần Thị B</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Học viên" name="students">
            <Select mode="multiple" size="large" placeholder="Chọn học viên vào lớp" className="class-mgt-students-select">
              <Option value="s1">Lê Văn C</Option>
              <Option value="s2">Phạm Văn D</Option>
            </Select>
          </Form.Item>
          <div className="class-mgt-modal-actions">
            <button type="button" className="admin-btn-outline" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="admin-btn-primary">Lưu thông tin</button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ClassManagement;
