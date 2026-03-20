import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, Select, Tag, Upload, message, Radio, Space } from 'antd';
import { 
  PlusOutlined, 
  ImportOutlined, 
  QuestionCircleOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import '../../styles/Admin.css';

const { Option } = Select;

const QuestionManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const dataSource = [
    { key: '1', content: 'React component lifecycle method nào được gọi duy nhất 1 lần?', type: 'Single Choice', category: 'ReactJS', level: 'Easy' },
    { key: '2', content: 'Giải thích sự khác nhau giữa var, let và const?', type: 'Essay', category: 'JavaScript', level: 'Medium' },
    { key: '3', content: 'Từ khóa nào dùng để định nghĩa một interface trong Java?', type: 'Single Choice', category: 'Java', level: 'Easy' },
    { key: '4', content: 'Các lợi ích của Docker là gì? (Chọn nhiều đáp án)', type: 'Multiple Choice', category: 'DevOps', level: 'Hard' },
  ];

  const columns = [
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'content',
      key: 'content',
      width: '40%',
      render: (text) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <QuestionCircleOutlined style={{ color: '#3b82f6', marginTop: '4px' }} />
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{text}</span>
        </div>
      )
    },
    {
      title: 'Chủ đề',
      dataIndex: 'category',
      key: 'category',
      render: (tag) => <Tag color="blue" style={{borderRadius: '12px'}}>{tag}</Tag>
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Mức độ',
      dataIndex: 'level',
      key: 'level',
      render: (lvl) => {
        let color = '#10b981';
        if (lvl === 'Medium') color = '#f59e0b';
        if (lvl === 'Hard') color = '#ef4444';
        return <span style={{ color, fontWeight: 700 }}>{lvl}</span>
      }
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
        <h1 className="admin-page-title">Ngân hàng Câu hỏi</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="admin-btn-outline">
            <ImportOutlined /> Import Excel
          </button>
          <button className="admin-btn-primary" onClick={() => setIsModalOpen(true)}>
            <PlusOutlined /> Thêm câu hỏi
          </button>
        </div>
      </div>

      <div className="admin-filter-bar">
        <Input placeholder="Tìm kiếm câu hỏi..." prefix={<SearchOutlined />} style={{ width: 350 }} size="large" />
        <Select defaultValue="ALL" size="large" style={{ width: 160 }}>
          <Option value="ALL">Mọi chủ đề</Option>
          <Option value="1">Frontend</Option>
          <Option value="2">Backend</Option>
        </Select>
        <Select defaultValue="ALL" size="large" style={{ width: 160 }}>
          <Option value="ALL">Độ khó</Option>
          <Option value="EASY">Dễ</Option>
          <Option value="MED">Trung bình</Option>
          <Option value="HARD">Khó</Option>
        </Select>
      </div>

      <div className="admin-table">
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 6 }} />
      </div>

      <Modal 
        title={<span style={{fontSize: '20px', fontWeight: 800}}>Soạn thảo câu hỏi mới</span>} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        width={700}
        footer={null}
      >
        <Form layout="vertical" style={{ marginTop: '20px' }}>
          <Form.Item label="Nội dung câu hỏi" name="content" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Ví dụ: HTML là viết tắt của..." />
          </Form.Item>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item label="Loại câu hỏi" name="type" initialValue="SINGLE">
              <Select size="large">
                <Option value="SINGLE">Trắc nghiệm 1 đáp án</Option>
                <Option value="MULTI">Trắc nghiệm nhiều đáp án</Option>
                <Option value="ESSAY">Tự luận</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Chủ đề" name="tag">
               <Select size="large" placeholder="Chọn Category">
                  <Option value="1">ReactJS</Option>
                  <Option value="2">Java Spring</Option>
               </Select>
            </Form.Item>
          </div>

          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontWeight: 700, marginBottom: '12px' }}>Đáp án trắc nghiệm:</p>
            <Space direction="vertical" style={{ width: '100%' }}>
               <Input addonBefore={<Radio />} placeholder="Đáp án A" />
               <Input addonBefore={<Radio />} placeholder="Đáp án B" />
               <Input addonBefore={<Radio />} placeholder="Đáp án C" />
               <Input addonBefore={<Radio />} placeholder="Đáp án D" />
            </Space>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <button type="button" className="admin-btn-outline" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="admin-btn-primary">Lưu câu hỏi</button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default QuestionManagement;
