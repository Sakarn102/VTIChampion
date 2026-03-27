import { useState, useEffect } from 'react';
import classApi from '../../api/classApi';
import { Badge, Avatar } from 'antd';
import { SearchOutlined, TeamOutlined, CalendarOutlined, CheckCircleOutlined, StopOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import '../../styles/ExamList.css';

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi song song 2 API
        const [classRes, countsRes] = await Promise.all([
          classApi.getAll(),
          classApi.getStudentCounts()
        ]);
        const data = Array.isArray(classRes) ? classRes : (classRes.data || []);
        const counts = countsRes || {};
        // Ghép số lượng học viên vào từng lớp
        const enriched = data.map(cls => ({ ...cls, studentCount: counts[cls.id] ?? 0 }));
        setClasses(enriched);
      } catch (error) {
        console.error("Lỗi tải danh sách lớp:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredClasses = classes.filter(cls => 
    cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cls.teacherName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = classes.filter(c => c.isActive !== false).length;
  const inactiveCount = classes.length - activeCount;

  return (
    <div className="exam-list-container" style={{ padding: 0 }}>
      <div className="page-actions" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="page-title-h2">
            <TeamOutlined style={{ marginRight: '10px', color: '#1d4ed8' }} />
            Quản lý Lớp học
          </h2>
          <p className="page-subtitle">Danh sách lớp học và cán bộ giảng dạy phụ trách</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-item-box">
          <div className="stat-icon-wrap icon-blue"><TeamOutlined /></div>
          <div>
            <div className="stat-val">{classes.length}</div>
            <div className="stat-label">Tổng số lớp</div>
          </div>
        </div>
        <div className="stat-item-box" style={{ borderColor: '#86efac' }}>
          <div className="stat-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <CheckCircleOutlined />
          </div>
          <div>
            <div className="stat-val">{activeCount}</div>
            <div className="stat-label">Đang hoạt động</div>
          </div>
        </div>
        <div className="stat-item-box" style={{ borderColor: '#fecaca' }}>
          <div className="stat-icon-wrap" style={{ background: '#fef2f2', color: '#dc2626' }}>
            <StopOutlined />
          </div>
          <div>
            <div className="stat-val">{inactiveCount}</div>
            <div className="stat-label">Đã vô hiệu</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon-pos"><SearchOutlined /></span>
          <input 
            type="text" 
            placeholder="Tìm theo tên lớp hoặc tên giảng viên..." 
            className="search-input-field" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container-box">
        <div className="table-header-custom" style={{ gridTemplateColumns: '1.2fr 1fr 100px 150px 130px 110px', padding: '14px 40px', gap: '20px' }}>
          <div className="table-header-cell">Tên Lớp học</div>
          <div className="table-header-cell">Giảng viên phụ trách</div>
          <div className="table-header-cell center">Số HV</div>
          <div className="table-header-cell center">Ngày tạo</div>
          <div className="table-header-cell center">Trạng thái</div>
          <div className="table-header-cell center">Thao tác</div>
        </div>

        {loading ? (
          <div className="table-loading">Đang tải...</div>
        ) : filteredClasses.length === 0 ? (
          <div className="table-loading">Không tìm thấy lớp học nào.</div>
        ) : (
          filteredClasses.map((cls, index) => (
            <div key={cls.id || index} className="table-row-custom" style={{ gridTemplateColumns: '1.2fr 1fr 100px 150px 130px 110px', padding: '16px 40px', gap: '20px' }}>
              <div>
                <div className="exam-title-cell" style={{ color: '#1d4ed8' }}>{cls.name}</div>
                <div className="exam-meta-cell">Bộ phận: {cls.departmentName || 'N/A'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar size="small" icon={<UserOutlined />} style={{ background: '#e0f2fe', color: '#0369a1' }} />
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                  {cls.teacherName || 'Chưa phân công'}
                </div>
              </div>
              <div className="exam-count-cell center">
                <span style={{ fontWeight: 800, color: '#2563eb', fontSize: '16px' }}>{cls.studentCount}</span>
              </div>
              <div className="exam-duration-cell center">
                <CalendarOutlined style={{ marginRight: '5px' }} />
                {cls.createDate ? dayjs(cls.createDate).format('DD/MM/YYYY') : 'N/A'}
              </div>
              <div className="exam-status-cell center">
                {cls.isActive !== false ? (
                  <Badge status="processing" text="Hoạt động" style={{ color: '#16a34a', fontWeight: 700 }} />
                ) : (
                  <Badge status="default" text="Vô hiệu" />
                )}
              </div>
              <div className="exam-actions-cell" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button className="action-btn action-btn-view" title="Xem học viên"><TeamOutlined /></button>
                <button className="action-btn action-btn-view" style={{ borderColor: '#cbd5e1', background: '#f8fafc', color: '#64748b' }} title="Cài đặt">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
