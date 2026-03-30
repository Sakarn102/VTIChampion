import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import examApi from '../../api/examApi';
import resultApi from '../../api/resultApi';
import userApi from '../../api/userApi';
import { message, Modal, Pagination } from 'antd';

import '../../styles/ExamList.css';

export default function ExamList() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [examStats, setExamStats] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [scoreFilter, setScoreFilter] = useState('all');

  // Custom Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const res = await userApi.getProfile();
      const profile = res.data || res;
      setCurrentUser(profile);
      return profile;
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
      return null;
    }
  };

  const fetchExamsAndStats = async () => {
    try {
      setLoading(true);

      let user = currentUser;
      if (!user) {
        user = await fetchCurrentUser();
      }

      const res = await examApi.getAll({ size: 200, teacher_id: user?.id || undefined });
      const data = res.data || res;
      const examsList = data.content || (Array.isArray(data) ? data : []);
      setExams(examsList);

      const statsMap = {};
      await Promise.all(examsList.map(async (exam) => {
        const id = exam.examId || exam.id;
        try {
          const results = await resultApi.getResultsByExam(id);
          if (results && results.length > 0) {
            const totalScore = results.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
            statsMap[id] = {
              attempts: results.length,
              avgScore: (totalScore / results.length).toFixed(1)
            };
          } else {
            statsMap[id] = { attempts: 0, avgScore: "0.0" };
          }
        } catch (e) {
          statsMap[id] = { attempts: 0, avgScore: "0.0" };
        }
      }));
      setExamStats(statsMap);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bài thi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamsAndStats();
  }, []);

  const confirmDelete = async () => {
    if (!examToDelete) return;
    try {
      setIsDeleting(true);
      await examApi.delete(examToDelete.id);
      message.success("Đã xoá bài thi thành công!");
      setExams(prev => prev.filter(e => (e.examId || e.id) !== examToDelete.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi xoá bài thi:", error);
      message.error("Không thể xoá bài thi. Vui lòng thử lại sau.");
    } finally {
      setIsDeleting(false);
    }
  };

  const totalExamsCount = exams.length;
  const totalAttempts = Object.values(examStats).reduce((acc, curr) => acc + curr.attempts, 0);
  const globalAvgScore = totalExamsCount > 0 
    ? (Object.values(examStats).reduce((acc, curr) => acc + Number(curr.avgScore), 0) / totalExamsCount).toFixed(1)
    : "0.0";

  const filteredAndSortedExams = [...exams]
    .filter(exam => {
      const id = exam.examId || exam.id;
      const stats = examStats[id] || { attempts: 0, avgScore: "0.0" };
      
      const matchesSearch = 
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (exam.code && exam.code.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!matchesSearch) return false;

      if (scoreFilter === 'poor') return stats.attempts > 0 && Number(stats.avgScore) < 5;
      if (scoreFilter === 'average') return stats.attempts > 0 && Number(stats.avgScore) >= 5 && Number(stats.avgScore) < 8;
      if (scoreFilter === 'good') return stats.attempts > 0 && Number(stats.avgScore) >= 8;
      if (scoreFilter === 'nodata') return stats.attempts === 0;
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return (b.examId || b.id) - (a.examId || a.id);
      if (sortBy === 'oldest') return (a.examId || a.id) - (b.examId || b.id);
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'attempts') {
        const attemptsA = examStats[a.examId || a.id]?.attempts || 0;
        const attemptsB = examStats[b.examId || b.id]?.attempts || 0;
        return attemptsB - attemptsA;
      }
      return 0;
    });

  const totalExams = filteredAndSortedExams.length;
  const currentExams = filteredAndSortedExams.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="exam-list-container" style={{ padding: 0 }}>
      <div className="page-actions">
        <div>
          <h2 className="page-title-h2">Danh sách Bài thi</h2>
          <p className="page-subtitle">Quản lý và theo dõi các đề thi trực tuyến</p>
        </div>
        <button onClick={() => navigate('/teacher/exams/create')} className="btn-create-exam">
          Tạo bài thi mới
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-item-box">
          <div className="stat-icon-wrap icon-blue"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <div><div className="stat-val">{totalExamsCount}</div><div className="stat-label">Tổng bài thi</div></div>
        </div>
        <div className="stat-item-box">
          <div className="stat-icon-wrap" style={{ background: '#fef9c3' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
          <div><div className="stat-val">{totalAttempts}</div><div className="stat-label">Lượt làm bài</div></div>
        </div>
        <div className="stat-item-box">
          <div className="stat-icon-wrap" style={{ background: '#f3e8ff' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <div><div className="stat-val">{globalAvgScore}</div><div className="stat-label">Điểm TB</div></div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon-pos">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc mã bài thi..." 
            className="search-input-field" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
          />
        </div>
        
        <select 
          className="filter-select"
          value={scoreFilter}
          onChange={(e) => {
            setScoreFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">Tất cả điểm số</option>
          <option value="good">Điểm Giỏi (&gt;= 8.0)</option>
          <option value="average">Điểm Tr.Bình (5-8)</option>
          <option value="poor">Điểm Yếu (&lt; 5.0)</option>
          <option value="nodata">Chưa có lượt thi</option>
        </select>

        <select 
          className="filter-select"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1); 
          }}
        >
          <option value="newest">Sắp xếp: Mới nhất</option>
          <option value="oldest">Sắp xếp: Cũ nhất</option>
          <option value="name">Sắp xếp: Tên A-Z</option>
          <option value="attempts">Sắp xếp: Lượt làm</option>
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
            <div className="table-header-cell center">Hành động</div>
          </div>

          {loading ? (
            <div className="table-loading">Đang tải dữ liệu...</div>
          ) : currentExams.length === 0 ? (
            <div className="table-loading">Không tìm thấy bài thi nào.</div>
          ) : (
            currentExams.map((exam, index) => {
              const id = exam.examId || exam.id;
              const stats = examStats[id] || { attempts: 0, avgScore: "0.0" };
              
              const getScoreClass = (score, attempts) => {
                if (!attempts || attempts === 0) return 'na';
                const s = Number(score);
                if (s < 5) return 'poor';
                if (s < 8) return 'average';
                return 'good';
              };

              const scoreLevel = getScoreClass(stats.avgScore, stats.attempts);

              return (
                <div key={id || index} className="table-row-custom">
                  <div>
                    <div className="exam-title-cell">{exam.title}</div>
                    <div className="exam-meta-cell">Mã: {exam.code} &nbsp;•&nbsp; Lớp: {exam.className || "N/A"}</div>
                  </div>
                  <div className="exam-count-cell center">{exam.questions?.length || 0}</div>
                  <div className="exam-duration-cell center">{exam.duration || 0}p</div>
                  <div className="exam-attempts-cell center">{stats.attempts}</div>
                  <div className="exam-score-cell center">
                    <span className={`score-badge ${scoreLevel}`}>
                      {stats.attempts > 0 ? stats.avgScore : "0.0"}
                    </span>
                  </div>
                  <div className="exam-actions-cell">
                    <button onClick={() => navigate('/teacher/exams/' + id)} className="action-btn action-btn-view" title="Xem chi tiết">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button onClick={() => {
                      setExamToDelete({ id, title: exam.title });
                      setIsDeleteModalOpen(true);
                    }} className="action-btn action-btn-delete" title="Xoá bài thi">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', paddingBottom: '24px' }}>
        <Pagination
          current={currentPage}
          total={totalExams}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
          className="custom-pagination"
        />
      </div>

      {/* Custom Xanh - Trắng Modal */}
      <Modal
        title="⚠ XÁC NHẬN XOÁ BÀI THI"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        className="blue-white-modal"
        footer={[
          <button 
            key="cancel" 
            className="btn-cancel" 
            style={{ padding: '8px 24px', marginRight: '10px' }} 
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Hủy bỏ
          </button>,
          <button 
            key="delete" 
            className="btn-save" 
            style={{ padding: '8px 24px', background: '#dc2626', border: 'none' }} 
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Đang xoá...' : 'Đồng ý xoá'}
          </button>
        ]}
      >
        <div style={{ padding: '10px 0' }}>
          <p style={{ fontSize: '15px', fontWeight: 600 }}>
            Bạn đang yêu cầu xoá bài thi: <span style={{ color: '#2563eb', fontWeight: 800 }}>"{examToDelete?.title}"</span>
          </p>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
            Hệ thống sẽ xoá vĩnh viễn dữ liệu này bao gồm cả cấu trúc câu hỏi bên trong. Bạn có chắc chắn muốn tiếp tục?
          </p>
        </div>
      </Modal>
    </div>
  );
}
