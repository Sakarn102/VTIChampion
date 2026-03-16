import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllExams } from '../../api/examService';

import '../../styles/EditExam.css';
import '../../styles/Home.css';

export default function EditExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '', code: '', duration: '', createDate: '', creatorName: '', className: '', questions: []
  });

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await getAllExams();
        const foundExam = data.content?.find(e => e.examId == examId);
        if (foundExam) {
          setExam(foundExam);
          setFormData({
            title: foundExam.title || '',
            code: foundExam.code || '',
            duration: foundExam.duration || '',
            createDate: foundExam.createDate || '',
            creatorName: foundExam.creatorName || '',
            className: foundExam.className || '',
            questions: foundExam.questions || []
          });
        }
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
      
<div className="screen active" id="edit-exam">
  <div className="home-screen">
    <div className="app-header">
      <div className="app-logo"><div className="logo-dot"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>MCQ Training</div>
      <nav className="app-nav">
        <a onClick={() => console.log('Action triggered')} className="cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Dashboard</a><a className="active cursor-pointer" onClick={() => navigate('/exam-list')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1" ry="1"/></svg> Quản lý Exam</a><a onClick={() => console.log('Action triggered')} className="cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M17 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Học viên</a><a onClick={() => console.log('Action triggered')} className="cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Báo cáo</a>
      </nav>
      <div className="header-right">
        <div className="instructor-header-profile">
          <div className="instructor-avatar-mini">T</div>
          <div><div className="instructor-profile-name">Trung Hiện</div><div className="instructor-profile-role">Instructor</div></div>
        </div>
      </div>
    </div>
        <div className="home-content" style={{ maxWidth: '860px' }}>
      {loading ? (
        <div className="table-loading">
          Đang tải dữ liệu...
        </div>
      ) : !exam ? (
        <div className="table-loading" style={{ color: 'red' }}>
          Không tìm thấy bài thi.
          <button onClick={() => navigate('/exam-list')} className="btn-primary-mini" style={{ display: 'block', margin: '20px auto', padding: '10px 20px' }}>Quay lại danh sách</button>
        </div>
      ) : (
      <>
      {/*  Breadcrumb  */}
      <div className="breadcrumb">
        <a onClick={() => navigate('/exam-list')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1" ry="1"/></svg> Danh sách bài thi</a>
        <span>›</span>
        <a onClick={() => navigate('/exams/' + exam.examId)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> {exam.title}</a>
        <span>›</span>
        <span className="active"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Chỉnh sửa</span>
      </div>

      {/*  Unsaved changes banner  */}
      <div id="unsaved-banner" className="unsaved-banner">
        <span style={{ fontSize: '16px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
        <span className="unsaved-text">Bạn có thay đổi chưa được lưu</span>
        <button onClick={() => console.log('Action triggered')} className="save-now-btn">Lưu ngay</button>
      </div>

      <div className="edit-header-row">
        <div>
          <h2 className="edit-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Chỉnh sửa bài thi</h2>
          <p className="edit-subtitle">Cập nhật thông tin và câu hỏi cho bài thi</p>
        </div>
        <div className="edit-meta-info">
          <span className="meta-text">Tạo ngày: {exam.createDate || "N/A"} - Người tạo: {exam.creatorName || "N/A"}</span>
          <div style={{ width: '1px', height: '16px', background: 'var(--blue-100)' }}></div>
          <span className="status-capsule">● Hoạt động</span>
        </div>
      </div>

      {/*  Basic info  */}
      <div className="form-card">
        <div className="card-header">
          <div className="card-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <div><h3 className="card-title">Thông tin cơ bản</h3></div>
        </div>
        <div className="form-group">
          <label className="form-label">Tiêu đề bài thi</label>
          <input type="text" value={formData.title} onInput={(e) => setFormData({...formData, title: e.target.value})} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea onInput={() => console.log('Action triggered')} className="form-textarea" defaultValue="Bài thi TOEIC đầy đủ gồm 2 phần Listening và Reading, dành cho học viên luyện thi chứng chỉ quốc tế."></textarea>
        </div>
        <div className="form-grid">
          <div>
            <label className="form-label">Mã bài thi (Code)</label>
            <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="form-input" />
          </div>
          <div>
            <label className="form-label">Thời gian (phút)</label>
            <input type="number" value={formData.duration} onInput={(e) => setFormData({...formData, duration: e.target.value})} className="form-input" />
          </div>
          <div>
            <label className="form-label">Lớp học</label>
            <input type="text" value={formData.className || "N/A"} disabled className="form-input form-input-disabled" />
          </div>
        </div>
      </div>

      {/*  Questions mini-manage  */}
      <div className="form-card">
        <div className="card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="card-icon" style={{ background: '#dcfce7' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
            <div><h3 className="card-title">Câu hỏi ({exam.questions?.length || 0})</h3></div>
          </div>
          <div className="section-actions">
            <button className="btn-secondary" onClick={() => console.log('Action triggered')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Import</button>
            <button className="btn-primary-mini" onClick={() => console.log('Action triggered')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Thêm câu</button>
          </div>
        </div>
        {/*  Sample editable questions  */}
        <div className="question-box">
          <div className="question-top">
            <span className="question-number">Câu 1</span>
            <div className="section-actions">
              <button className="btn-edit-mini" onClick={() => console.log('Action triggered')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Sửa</button>
              <button className="btn-delete-mini" onClick={() => console.log('Action triggered')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> Xóa</button>
            </div>
          </div>
          <input type="text" defaultValue="The manager asked employees to _____ the report by Friday." onInput={() => console.log('Action triggered')} className="form-input" style={{ marginBottom: '8px', padding: '9px 12px', fontSize: '13px' }} />
          <div className="question-options-grid">
            <div className="option-item correct"><input type="radio" checked readOnly style={{ accentColor: '#16a34a' }} /><input type="text" defaultValue="submit" className="form-input" style={{ flex: '1', border: 'none', background: 'transparent', padding: '0', fontSize: '13px' }} /><span className="correct-mark"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polyline points="20 6 9 17 4 12"/></svg></span></div>
            <div className="option-item"><input type="radio" readOnly /><input type="text" defaultValue="submitting" className="form-input" style={{ flex: '1', border: 'none', background: 'transparent', padding: '0', fontSize: '13px' }} /></div>
            <div className="option-item"><input type="radio" readOnly /><input type="text" defaultValue="submitted" className="form-input" style={{ flex: '1', border: 'none', background: 'transparent', padding: '0', fontSize: '13px' }} /></div>
            <div className="option-item"><input type="radio" readOnly /><input type="text" defaultValue="to submit" className="form-input" style={{ flex: '1', border: 'none', background: 'transparent', padding: '0', fontSize: '13px' }} /></div>
          </div>
        </div>
        <div className="more-questions-dash">+ 199 câu hỏi nữa...</div>
      </div>

      {/*  Actions  */}
      <div className="action-bar">
        <button onClick={() => navigate('/exam-detail')} className="btn-cancel">← Hủy</button>
        <button onClick={() => console.log('Action triggered')} className="btn-save"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Lưu thay đổi</button>
      </div>

      </>
      )}
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


    </>
  );
}
