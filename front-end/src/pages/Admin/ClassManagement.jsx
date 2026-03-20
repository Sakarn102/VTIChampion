import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, Select, Tag } from 'antd';
import { PlusOutlined, UserOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import '../../styles/Admin.css';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}>
            <TeamOutlined />
          </div>
          <span style={{ fontWeight: 700, color: '#1e293b' }}>{text}</span>
        </div>
      )
    },
    {
      title: 'Giáo viên phụ trách',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserOutlined style={{ color: '#64748b' }} />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: 'Sĩ số',
      dataIndex: 'students',
      key: 'students',
      render: (count) => (
        <Tag color="blue" style={{ borderRadius: '12px', fontWeight: 600 }}>{count} Học viên</Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-badge ${status === 'Active' ? 'status-active' : 'status-blocked'}`} style={status === 'Ended' ? {background: '#f1f5f9', color: '#64748b'} : {}}>
          {status === 'Active' ? 'Đang học' : 'Kết thúc'}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="text" icon={<EditOutlined style={{ color: '#3b82f6' }} />} />
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
        <Input.Search placeholder="Tìm theo tên lớp, giáo viên..." style={{ width: 350 }} size="large" />
        <Select defaultValue="ALL" size="large" style={{ width: 180 }}>
          <Option value="ALL">Tất cả giáo viên</Option>
          <Option value="1">Nguyễn Văn A</Option>
          <Option value="2">Trần Thị B</Option>
        </Select>
      </div>

      <div className="admin-table">
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 6 }} />
      </div>

      <Modal title={<span style={{fontSize: '20px', fontWeight: 800}}>Tạo lớp học mới</span>} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form layout="vertical" style={{ marginTop: '20px' }}>
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
            <Select mode="multiple" size="large" placeholder="Chọn học viên vào lớp" style={{ width: '100%' }}>
              <Option value="s1">Lê Văn C</Option>
              <Option value="s2">Phạm Văn D</Option>
            </Select>
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <button type="button" className="admin-btn-outline" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="admin-btn-primary">Lưu thông tin</button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ClassManagement;
