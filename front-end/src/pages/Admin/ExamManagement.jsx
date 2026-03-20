import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, Select, InputNumber, Space, Tag, message } from 'antd';
import { PlusOutlined, ClockCircleOutlined, FileTextOutlined, EditOutlined, DeleteOutlined, ShareAltOutlined } from '@ant-design/icons';
import '../../styles/Admin.css';
import examApi from '../../api/examApi';

const { Option } = Select;

const ExamManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

  const fetchExams = async (params = {}) => {
    try {
      setLoading(true);
      const res = await examApi.getAll({
        page: params.page || pagination.current,
        size: params.size || pagination.pageSize,
        keyworld: params.keyword || '',
      });
      
      setExams(res.content || []);
      setPagination({
        ...pagination,
        total: res.totalElements || 0,
        current: (res.number || 0) + 1,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa đề thi này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await examApi.delete(id);
          message.success("Xóa đề thi thành công!");
          fetchExams();
        } catch (error) {
          message.error("Lỗi khi xóa bài thi!");
        }
      }
    });
  };

  const handleTableChange = (newPagination) => {
    fetchExams({
      page: newPagination.current,
      size: newPagination.pageSize,
    });
  };

  const columns = [
    {
      title: 'Mã bài thi',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Tên Đề Thi',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: '#fff7ed', borderRadius: '8px', color: '#ea580c' }}>
            <FileTextOutlined />
          </div>
          <span style={{ fontWeight: 700, color: '#1e293b' }}>{text}</span>
        </div>
      )
    },
    {
      title: 'Người tạo',
      dataIndex: 'creatorName',
      key: 'creatorName',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="text" icon={<EditOutlined style={{ color: '#3b82f6' }} />} title="Sửa" />
          <Button type="text" icon={<ShareAltOutlined style={{ color: '#10b981' }} />} title="Gán cho lớp" />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} title="Xóa" />
        </div>
      )
    }
  ];

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Đề thi</h1>
        <button className="admin-btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusOutlined /> Tạo đề thi
        </button>
      </div>

      <div className="admin-filter-bar">
        <Input.Search 
          placeholder="Tìm kiếm tên đề thi..." 
          style={{ width: 350 }} 
          size="large" 
          onSearch={(v) => fetchExams({ keyword: v, page: 1 })}
        />
        <Select defaultValue="ALL" size="large" style={{ width: 180 }}>
          <Option value="ALL">Tất cả bài thi</Option>
        </Select>
      </div>

      <div className="admin-table">
        <Table 
          rowKey="id"
          dataSource={exams} 
          columns={columns} 
          loading={loading}
          pagination={pagination} 
          onChange={handleTableChange}
        />
      </div>

      <Modal title={<span style={{fontSize: '20px', fontWeight: 800}}>Thông tin đề thi mới</span>} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form layout="vertical" style={{ marginTop: '20px' }}>
          <Form.Item label="Tiêu đề bài thi" name="title" rules={[{ required: true }]}>
            <Input size="large" placeholder="Nhập tên đề thi" />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item label="Thời gian (phút)" name="duration" rules={[{ required: true }]}>
              <InputNumber size="large" style={{ width: '100%' }} min={1} />
            </Form.Item>
            <Form.Item label="Chuyên mục" name="category" rules={[{ required: true }]}>
              <Select size="large">
                <Option value="1">Công nghệ</Option>
                <Option value="2">Tiếng Anh</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item label="Mô tả đề thi" name="description">
            <Input.TextArea rows={4} placeholder="Nhập mô tả ngắn gọn..." />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <button type="button" className="admin-btn-outline" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="admin-btn-primary">Tạo đề và thêm câu hỏi</button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ExamManagement;
