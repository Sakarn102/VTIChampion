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
      
    <div className="exam-list-container" style={{ padding: 0 }}>
      {/* Page header */}
      <div className="page-actions">
        <div>
          <h2 className="page-title-h2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
            </svg> 
            Danh sách Bài thi
          </h2>
          <p className="page-subtitle">Quản lý tất cả bài thi bạn đã tạo</p>
        </div>
        <button onClick={() => navigate('/teacher/exams/create')} className="btn-create-exam">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg> 
          Tạo bài thi mới
        </button>
      </div>

      {/* Stats row */}
      <div className="stats-grid">
        {/* ... stays the same ... */}
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

      {/* Filters and Table */}
      <div className="filter-bar">
        {/* ... content as before ... */}
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

      <div className="exam-table-wrap">
        <div className="table-container-box">
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
          ) : (
            exams.map((exam, index) => (
              <div key={exam.examId || exam.id || index} className="table-row-custom">
                <div>
                  <div className="exam-title-cell">{exam.title}</div>
                  <div className="exam-meta-cell">
                    Mã bài thi: {exam.code} &nbsp;•&nbsp; Người tạo: {exam.creatorName || "N/A"} &nbsp;•&nbsp; Lớp: {exam.className || "N/A"}
                  </div>
                </div>
                <div className="exam-count-cell">{exam.questions?.length || 0}</div>
                <div className="exam-duration-cell">{exam.duration} phút</div>
                <div className="exam-attempts-cell">0</div>
                <div className="exam-score-cell"><span className="score-badge">Chưa có</span></div>
                <div className="exam-status-cell"><span className="status-badge-active">● Hoạt động</span></div>
                <div className="exam-actions-cell">
                  <button onClick={() => navigate('/teacher/exams/' + (exam.examId || exam.id))} className="action-btn action-btn-view">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button onClick={() => navigate('/teacher/exams/' + (exam.examId || exam.id) + '/edit')} className="action-btn action-btn-edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button className="action-btn action-btn-disable">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </>
  );
}
