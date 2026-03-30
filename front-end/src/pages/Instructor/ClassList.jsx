import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classApi from '../../api/classApi';
import userApi from '../../api/userApi';
import { Avatar, Pagination } from 'antd';
import { SearchOutlined, TeamOutlined, CalendarOutlined, CheckCircleOutlined, StopOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import '../../styles/ExamList.css';
import '../../styles/ClassList.css';

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await userApi.getProfile();
        const profile = userRes.data || userRes;
        setCurrentUser(profile);

        const [classRes, countsRes] = await Promise.all([
          classApi.getAll({ teacher_id: profile.id }),
          classApi.getStudentCounts()
        ]);
        
        const data = Array.isArray(classRes) ? classRes : (classRes.data || classRes.content || []);
        const counts = countsRes || {};
        
        let enriched = data.map(cls => ({ 
          ...cls, 
          studentCount: counts[cls.id] ?? 0
        }));
        
        if (profile.fullname) {
          enriched = enriched.filter(cls => 
            cls.teacherName && cls.teacherName.toLowerCase() === profile.fullname.toLowerCase()
          );
        }

        setClasses(enriched);
      } catch (error) {
        console.error("Lỗi tải danh sách lớp:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAndSortedClasses = [...classes]
    .filter(cls => {
      const matchesSearch = 
        cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cls.teacherName?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (statusFilter === 'active') return cls.isActive !== false;
      if (statusFilter === 'inactive') return cls.isActive === false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'newest') return dayjs(b.createDate).unix() - dayjs(a.createDate).unix();
      if (sortBy === 'oldest') return dayjs(a.createDate).unix() - dayjs(b.createDate).unix();
      return 0;
    });

  const activeCount = classes.filter(c => c.isActive !== false).length;
  const inactiveCount = classes.length - activeCount;

  const handleOpenDetail = (cls) => {
    navigate(`/teacher/students/${cls.id}`, { state: { classData: cls } });
  };

  return (
    <div className="exam-list-container class-list-container">
      <div className="page-actions class-list-page-actions">
        <div>
          <h2 className="page-title-h2">
            <TeamOutlined className="class-list-page-icon" />
            Quản lý Lớp học
          </h2>
          <p className="page-subtitle">Danh sách lớp học và cán bộ giảng dạy phụ trách</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item-box">
          <div className="stat-icon-wrap icon-blue"><TeamOutlined /></div>
          <div>
            <div className="stat-val">{classes.length}</div>
            <div className="stat-label">Tổng số lớp</div>
          </div>
        </div>
        <div className="stat-item-box stat-item-box-active">
          <div className="stat-icon-wrap stat-icon-wrap-active">
            <CheckCircleOutlined />
          </div>
          <div>
            <div className="stat-val">{activeCount}</div>
            <div className="stat-label">Đang hoạt động</div>
          </div>
        </div>
        <div className="stat-item-box stat-item-box-inactive">
          <div className="stat-icon-wrap stat-icon-wrap-inactive">
            <StopOutlined />
          </div>
          <div>
            <div className="stat-val">{inactiveCount}</div>
            <div className="stat-label">Đã vô hiệu</div>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon-pos"><SearchOutlined /></span>
          <input 
            type="text" 
            placeholder="Tìm theo tên lớp..." 
            className="search-input-field" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Đã vô hiệu</option>
        </select>

        <select 
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Sắp xếp: Mới nhất</option>
          <option value="oldest">Sắp xếp: Cũ nhất</option>
          <option value="name">Tên A-Z</option>
        </select>
      </div>

      <div className="table-container-box">
        <div className="table-header-custom class-list-table-header">
          <div className="table-header-cell">Tên lớp học</div>
          <div className="table-header-cell center">Sĩ số</div>
          <div className="table-header-cell center">Ngày tạo</div>
          <div className="table-header-cell center">Trạng thái</div>
          <div className="table-header-cell center">Thao tác</div>
        </div>

        {loading ? (
          <div className="table-loading">Đang tải...</div>
        ) : filteredAndSortedClasses.length === 0 ? (
          <div className="table-loading">Không tìm thấy lớp học nào.</div>
        ) : (
          <>
            {filteredAndSortedClasses
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((cls, index) => (
                <div key={cls.id || index} className="table-row-custom class-list-table-row">
                  <div>
                    <div className="exam-title-cell class-list-exam-title">{cls.name}</div>
                    <div className="exam-meta-cell">Bộ phận: {cls.departmentName || 'N/A'}</div>
                  </div>
                  <div className="exam-count-cell center">
                    <span className="class-list-student-count">{cls.studentCount}</span>
                  </div>
                  <div className="exam-duration-cell center">
                    <CalendarOutlined className="class-list-calendar-icon" />
                    {cls.createDate ? dayjs(cls.createDate).format('DD/MM/YYYY') : 'N/A'}
                  </div>
                  <div className="exam-status-cell center">
                    {cls.isActive !== false ? (
                      <span className="status-text-active"><CheckCircleOutlined /> Hoạt động</span>
                    ) : (
                      <span className="status-text-inactive"><StopOutlined /> Vô hiệu</span>
                    )}
                  </div>
                  <div className="exam-actions-cell class-list-actions">
                    <button className="action-btn action-btn-view" title="Xem chi tiết lớp" onClick={() => handleOpenDetail(cls)}>
                      <EyeOutlined />
                    </button>
                  </div>
                </div>
              ))}
            
            <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', paddingBottom: '24px' }}>
              <Pagination 
                current={currentPage}
                pageSize={pageSize}
                total={filteredAndSortedClasses.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                className="custom-pagination"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
