import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllExams } from '../../api/examService';

import '../../styles/ExamList.css';

export default function ExamList() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getAllExams();
        setExams(data.content || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài thi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <>
      
<div className="screen active exam-list-container" id="exam-list">
  <div className="home-screen">
    <div className="app-header">
      <div className="app-logo">
        <div className="logo-dot"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
        <span className="logo-text">MCQ Training</span>
      </div>
      <nav className="app-nav">
        <a onClick={() => console.log('Action triggered')} className="cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Dashboard</a>
        <a className="active cursor-pointer" onClick={() => navigate('/exam-list')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1" ry="1"/></svg> Quản lý Exam</a>
        <a onClick={() => console.log('Action triggered')} className="cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Học viên</a>
        <a onClick={() => console.log('Action triggered')} className="cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Báo cáo</a>
      </nav>
      <div className="header-right">
        <div className="instructor-header-card">
          <div className="instructor-avatar">T</div>
          <div>
            <div className="instructor-name">Trung Hiện</div>
            <div className="instructor-role">Instructor</div>
          </div>
        </div>
      </div>
    </div>

    <div className="home-content">
      {/*  Page header  */}
      <div className="page-actions">
        <div>
          <h2 className="page-title-h2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1" ry="1"/></svg> Danh sách Bài thi</h2>
          <p className="page-subtitle">Quản lý tất cả bài thi bạn đã tạo</p>
        </div>
        <button onClick={() => navigate('/create-exam')} className="btn-create-exam">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Tạo bài thi mới
        </button>
      </div>

      {/*  Stats row  */}
      <div className="stats-grid">
        <div className="stat-item-box">
          <div className="stat-icon-wrap icon-blue"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
          <div><div className="stat-val">8</div><div className="stat-label">Tổng bài thi</div></div>
        </div>
        <div className="stat-item-box">
          <div className="stat-icon-wrap" style={{ background: '#dcfce7' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polyline points="20 6 9 17 4 12"/></svg></div>
          <div><div className="stat-val">5</div><div className="stat-label">Đang hoạt động</div></div>
        </div>
        <div className="stat-item-box">
          <div className="stat-icon-wrap" style={{ background: '#fef9c3' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
          <div><div className="stat-val">342</div><div className="stat-label">Lượt làm bài</div></div>
        </div>
        <div className="stat-item-box">
          <div className="stat-icon-wrap" style={{ background: '#f3e8ff' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <div><div className="stat-val">7.8</div><div className="stat-label">Điểm TB</div></div>
        </div>
      </div>

      {/*  Filters  */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon-pos"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
          <input type="text" placeholder="Tìm kiếm bài thi..." className="search-input-field" />
        </div>
        <select className="filter-select">
          <option>Tất cả trạng thái</option>
          <option>Đang hoạt động</option>
          <option>Đã vô hiệu</option>
          <option>Bản nháp</option>
        </select>
        <select className="filter-select">
          <option>Sắp xếp: Mới nhất</option>
          <option>Sắp xếp: Cũ nhất</option>
          <option>Sắp xếp: Tên A-Z</option>
          <option>Sắp xếp: Lượt làm</option>
        </select>
      </div>

      {/*  Exam Table  */}
      <div className="exam-table-wrap">
      <div className="table-container-box">
        {/*  Table header  */}
        <div className="table-header-custom">
          <div className="table-header-cell">Tên bài thi</div>
          <div className="table-header-cell center">Câu hỏi</div>
          <div className="table-header-cell center">Thời gian</div>
          <div className="table-header-cell center">Lượt làm</div>
          <div className="table-header-cell center">Điểm TB</div>
          <div className="table-header-cell center">Trạng thái</div>
          <div className="table-header-cell center">Hành động</div>
        </div>

{loading ? (
          <div className="table-loading">Đang tải dữ liệu...</div>
        ) : exams.length === 0 ? (
          <div className="table-loading">Không có bài thi nào.</div>
        ) : (
          exams.map((exam, index) => (
            <div key={exam.examId || index} className="table-row-custom">
              <div>
                <div className="exam-title-cell">{exam.title}</div>
                <div className="exam-meta-cell">
                  Mã bài thi: {exam.code} &nbsp;•&nbsp; Người tạo: {exam.creatorName || "N/A"} &nbsp;•&nbsp; Lớp: {exam.className || "N/A"} &nbsp;•&nbsp; Ngày tạo: {exam.createDate}
                </div>
              </div>
              <div className="exam-count-cell">
                {exam.questions && exam.questions.length > 0 ? exam.questions.length : 0}
              </div>
              <div className="exam-duration-cell">{exam.duration} phút</div>
              <div className="exam-attempts-cell">0</div>
              <div className="exam-score-cell"><span className="score-badge">Chưa có</span></div>
              <div className="exam-status-cell"><span className="status-badge-active">● Hoạt động</span></div>
              <div className="exam-actions-cell">
                <button title="Xem chi tiết" onClick={() => navigate('/exams/' + exam.examId)} className="action-btn action-btn-view"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                <button title="Chỉnh sửa" onClick={() => navigate('/exams/edit/' + exam.examId)} className="action-btn action-btn-edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                <button title="Vô hiệu hóa" onClick={() => console.log('Action triggered')} className="action-btn action-btn-disable"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg></button>
              </div>
            </div>
          ))
        )}

        {/*  Pagination  */}
        <div className="pagination-bar">
          <span className="pagination-info">Hiển thị 5 / 8 bài thi</span>
          <div className="pagination-btns">
            <button onClick={() => console.log('Action triggered')} className="page-nav-btn">← Trước</button>
            <button id="page-btn-1" onClick={() => console.log('Action triggered')} className="page-num-btn-active">1</button>
            <button id="page-btn-2" onClick={() => console.log('Action triggered')} className="page-nav-btn">2</button>
            <button onClick={() => console.log('Action triggered')} className="page-nav-btn">Sau →</button>
          </div>
        </div>
      </div>

    </div>

    {/*  Mobile Bottom Nav (Instructor)  */}
    <nav className="mobile-bottom-nav">
      <a className="mbn-item" onClick={() => console.log('Action triggered')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Dashboard
      </a>
      <a className="mbn-item active" onClick={() => navigate('/exam-list')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1" ry="1"/></svg>
        Bài thi
      </a>
      <a className="mbn-item" onClick={() => navigate('/create-exam')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        Tạo mới
      </a>
      <a className="mbn-item" onClick={() => console.log('Action triggered')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Hồ sơ
      </a>
    </nav>
  </div>
  </div>
</div>
    </>
  );
}
