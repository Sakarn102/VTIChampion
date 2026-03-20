import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../api/userApi';
import { message, Button, Modal, Form, Input, Upload } from 'antd';
import { UploadOutlined, EditOutlined } from '@ant-design/icons';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userApi.getProfile();
      setUser(data.data || data);
    } catch (error) {
      message.error("Lỗi khi tải thông tin cá nhân");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [navigate]);

  const showEditModal = () => {
    form.setFieldsValue({
      fullName: user.fullname,
      username: user.username,
      email: user.email,
    });
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      const updateData = {
        fullName: values.fullName,
        username: values.username,
        email: values.email
      };
      
      formData.append(
        "data",
        new Blob([JSON.stringify(updateData)], { type: "application/json" })
      );

      if (fileList.length > 0) {
        formData.append("avatar", fileList[0].originFileObj);
      }

      await userApi.updateProfile(formData);
      message.success("Cập nhật thông tin thành công!");
      setIsModalVisible(false);
      fetchProfile();
    } catch (error) {
      message.error("Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const onUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', minHeight: 'calc(100vh - 64px)' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--blue-200, #bfdbfe)', background: 'var(--blue-50, #eff6ff)', color: 'var(--blue-600, #2563eb)', fontWeight: 'bold' }}>
        ← Quay lại
      </button>
      
      <div style={{ background: 'white', borderRadius: '16px', padding: '30px', boxShadow: 'var(--shadow-md, 0 4px 24px rgba(37,99,235,0.12))', border: '2px solid var(--blue-100, #dbeafe)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--gray-800, #1e293b)', margin: 0 }}>Hồ sơ cá nhân</h2>
          {user && (
            <Button type="primary" icon={<EditOutlined />} onClick={showEditModal} style={{ borderRadius: '8px' }}>
              Chỉnh sửa
            </Button>
          )}
        </div>
        
        {loading && !user ? (
          <p style={{ color: 'var(--gray-400, #94a3b8)' }}>Đang tải dữ liệu...</p>
        ) : user ? (
          <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: 'bold', flexShrink: 0, overflow: 'hidden' }}>
              {user.avatarUrl ? (
                <img src={`http://localhost:8080/api/v1/files/${user.avatarUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = user.avatarUrl; }} />
              ) : (
                user.fullname ? user.fullname.charAt(0).toUpperCase() : user.username ? user.username.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h3 style={{ fontSize: '24px', margin: '0 0 12px 0', color: 'var(--gray-800, #1f2937)' }}>
                {user.fullname || user.username || 'Chưa cập nhật tên'}
              </h3>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'var(--gray-50, #f8fafc)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray-400, #94a3b8)', fontWeight: '700', textTransform: 'uppercase' }}>Địa chỉ Email</span>
                  <div style={{ fontSize: '15px', color: 'var(--gray-800, #1e293b)', fontWeight: '600' }}>{user.email || 'Trống'}</div>
                </div>
                
                <div style={{ padding: '12px', background: 'var(--gray-50, #f8fafc)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray-400, #94a3b8)', fontWeight: '700', textTransform: 'uppercase' }}>Tên đăng nhập</span>
                  <div style={{ fontSize: '15px', color: 'var(--gray-800, #1e293b)', fontWeight: '600' }}>{user.username || 'Trống'}</div>
                </div>

                <div style={{ padding: '12px', background: 'var(--gray-50, #f8fafc)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray-400, #94a3b8)', fontWeight: '700', textTransform: 'uppercase' }}>Vai trò</span>
                  <div style={{ fontSize: '15px', color: 'var(--gray-800, #1e293b)', fontWeight: '600' }}>
                    <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>
                      {user.role?.name ? user.role.name.replace('ROLE_', '') : 'Học viên'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--gray-400, #94a3b8)' }}>Không có thông tin người dùng</p>
        )}
      </div>

      <Modal title="Cập nhật hồ sơ" open={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}>
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          <Form.Item name="email" label="Địa chỉ Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item label="Ảnh đại diện">
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={onUploadChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
