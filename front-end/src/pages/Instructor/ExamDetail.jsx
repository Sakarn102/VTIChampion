import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllExams } from '../../api/examService';

import '../../styles/ExamDetail.css';
import '../../styles/EditExam.css';
import '../../styles/Home.css';

export default function ExamDetail() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await getAllExams();
        const foundExam = data.content?.find(e => (e.examId == examId || e.id == examId));
        setExam(foundExam || null);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId]);

  return (
    <>
      
    <div className="exam-detail-container" style={{ padding: 0 }}>
      {/* Page content */}
      <div className="home-content" style={{ maxWidth: '960px', padding: 0 }}>
        {loading ? (
          <div className="table-loading">Đang tải dữ liệu...</div>
        ) : !exam ? (
          <div className="table-loading" style={{ color: 'red' }}>
            Không tìm thấy bài thi.
            <button onClick={() => navigate('/teacher/exams')} className="btn-primary-mini" style={{ display: 'block', margin: '20px auto', padding: '10px 20px' }}>Quay lại danh sách</button>
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            <div className="breadcrumb" style={{ marginTop: 0 }}>
              <a onClick={() => navigate('/teacher/exams')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
                </svg> 
                Danh sách bài thi
              </a>
              <span>›</span>
              <span className="active">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg> 
                Chi tiết bài thi
              </span>
            </div>

      {/*  Header card  */}
      <div className="exam-detail-header">
        <div className="header-blur-cir-1"></div>
        <div className="header-blur-cir-2"></div>
        <div className="header-content-rel">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span className="code-badge-rel">{exam.code}</span>
              <span className="active-badge-rel">● Đang hoạt động</span>
            </div>
            <h2 className="header-title-white">{exam.title}</h2>
            <p className="header-desc-white">Mã bài thi: {exam.code} | Lớp: {exam.className || "N/A"} | Người tạo: {exam.creatorName || "N/A"}</p>
            <div className="quick-stats-row">
              <div className="quick-stat-item"><span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>{exam.duration} phút</div>
              <div className="quick-stat-item"><span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>{exam.questions?.length || 0} câu hỏi</div>
              <div className="quick-stat-item"><span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span>Đạt: 60%</div>
              <div className="quick-stat-item"><span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>Tạo: {exam.createDate || "N/A"}</div>
            </div>
          </div>
          <div className="header-action-group">
            <button onClick={() => navigate('/teacher/exams/' + exam.examId + '/edit')} className="btn-glass"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Chỉnh sửa</button>
            <button onClick={() => console.log('Action triggered')} className="btn-danger-glass"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> Vô hiệu</button>
          </div>
        </div>
      </div>

      {/*  Stats row  */}
      <div className="stats-grid-4">
        <div className="stat-box-flat">
          <div className="stat-val-blue">128</div>
          <div className="stat-lbl-mini">Tổng lượt làm</div>
        </div>
        <div className="stat-box-flat">
          <div className="stat-val-green">8.4</div>
          <div className="stat-lbl-mini">Điểm trung bình</div>
        </div>
        <div className="stat-box-flat">
          <div className="stat-val-yellow">73%</div>
          <div className="stat-lbl-mini">Tỷ lệ đạt</div>
        </div>
        <div className="stat-box-flat">
          <div className="stat-val-purple">{exam.questions?.length || 0}</div>
          <div className="stat-lbl-mini">Số câu hỏi</div>
        </div>
      </div>

      {/*  Two columns  */}
      <div className="detail-layout">

        {/*  Question list preview  */}
        <div className="detail-card">
          <div className="detail-card-header">
            <h3 className="card-title" style={{ margin: 0 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Danh sách câu hỏi ({exam.questions?.length || 0})</h3>
            <span style={{ fontSize: '12px', color: 'var(--blue-500)', fontWeight: '700', cursor: 'pointer' }}>Xem tất cả →</span>
          </div>
          <div style={{ padding: '4px 0' }}>
            {/*  Q rows  */}
            <div className="question-preview-row">
              <span className="q-number-box">1</span>
              <div className="q-text-preview">The manager asked employees to _____ the report by Friday.</div>
              <span className="q-ans-badge">A</span>
            </div>
            <div className="question-preview-row">
              <span className="q-number-box">2</span>
              <div className="q-text-preview">What does the word "revenue" most closely mean?</div>
              <span className="q-ans-badge">C</span>
            </div>
            <div className="question-preview-row">
              <span className="q-number-box">3</span>
              <div className="q-text-preview">According to the passage, when did the company expand?</div>
              <span className="q-ans-badge">B</span>
            </div>
            <div className="question-preview-row">
              <span className="q-number-box">4</span>
              <div className="q-text-preview">Which department is responsible for the announcement?</div>
              <span className="q-ans-badge">D</span>
            </div>
            <div style={{ padding: '12px 20px', textAlign: 'center', color: 'var(--blue-400)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>+ 196 câu hỏi nữa...</div>
          </div>
        </div>

        {/*  Right column: settings + recent attempts  */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/*  Settings  */}
          <div className="form-card" style={{ padding: '18px 20px' }}>
            <h3 className="card-title" style={{ marginBottom: '14px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Cài đặt</h3>
            <div className="settings-list">
              <div className="setting-item-row">
                <span className="setting-lbl"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg> Xáo trộn câu hỏi</span>
                <span className="status-capsule">Bật</span>
              </div>
              <div className="setting-item-row">
                <span className="setting-lbl"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Xem điểm ngay</span>
                <span className="status-capsule">Bật</span>
              </div>
              <div className="setting-item-row">
                <span className="setting-lbl"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Làm nhiều lần</span>
                <span className="status-capsule" style={{ background: '#fee2e2', color: '#dc2626' }}>Tắt</span>
              </div>
              <div className="setting-item-row">
                <span className="setting-lbl"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polyline points="20 6 9 17 4 12"/></svg> Xem đáp án</span>
                <span className="status-capsule">Bật</span>
              </div>
            </div>
          </div>

          {/*  Recent attempts  */}
          <div className="form-card" style={{ padding: '18px 20px', flex: '1' }}>
            <h3 className="card-title" style={{ marginBottom: '14px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Kết quả gần đây</h3>
            <div className="settings-list">
              <div className="attempt-row">
                <div className="attempt-avatar" style={{ background: 'linear-gradient(135deg,#3b82f6,#60a5fa)' }}>N</div>
                <div style={{ flex: '1' }}><div className="attempt-name">Nguyễn Văn A</div><div className="attempt-meta">10/03/2026 • 118 phút</div></div>
                <span className="score-badge" style={{ background: '#dcfce7', color: '#16a34a' }}>9.5</span>
              </div>
              <div className="attempt-row">
                <div className="attempt-avatar" style={{ background: 'linear-gradient(135deg,#0284c7,#38bdf8)' }}>T</div>
                <div style={{ flex: '1' }}><div className="attempt-name">Trần Thị B</div><div className="attempt-meta">09/03/2026 • 120 phút</div></div>
                <span className="score-badge" style={{ background: '#fef9c3', color: '#ca8a04' }}>7.0</span>
              </div>
              <div className="attempt-row">
                <div className="attempt-avatar" style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)' }}>L</div>
                <div style={{ flex: '1' }}><div className="attempt-name">Lê Minh C</div><div className="attempt-meta">08/03/2026 • 115 phút</div></div>
                <span className="score-badge" style={{ background: '#dcfce7', color: '#16a34a' }}>8.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      </>
      )}
      </div>
    </div>
    </>
  );
}
