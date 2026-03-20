import { useNavigate, Link } from 'react-router-dom';

import '../../styles/CreateExam.css';
import '../../styles/EditExam.css';
import '../../styles/Home.css';

export default function CreateExam() {
  const navigate = useNavigate();

  return (
    <>
    <div className="create-exam-container" style={{ padding: 0 }}>
      <div className="home-content" style={{ maxWidth: '860px', padding: 0 }}>

        {/*  Breadcrumb  */}
        <div className="breadcrumb" style={{ marginTop: 0 }}>
          <a onClick={() => navigate('/teacher/exams')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1" ry="1"/></svg> Danh sách bài thi</a>
          <span>›</span>
          <span className="active"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Tạo bài thi mới</span>
        </div>

        {/*  Page title  */}
        <div className="create-exam-header-meta">
          <h2 className="create-exam-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Tạo bài thi mới</h2>
          <p className="create-exam-subtitle">Điền đầy đủ thông tin bên dưới để tạo bài thi cho học viên</p>
        </div>

      {/*  FORM CARD: Basic Info  */}
      <div className="form-card">
        <div className="card-header">
          <div className="card-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <div>
            <h3 className="card-title">Thông tin cơ bản</h3>
            <p style={{ fontSize: '11px', color: 'var(--gray-400)', fontWeight: '600' }}>Tiêu đề, mô tả và cài đặt chung</p>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tiêu đề bài thi <span className="required-star">*</span></label>
          <input type="text" placeholder="VD: TOEIC Full Test - Đề 01" className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea placeholder="Mô tả nội dung, mục tiêu và đối tượng phù hợp của bài thi..." className="form-textarea" style={{ minHeight: '90px' }}></textarea>
        </div>

        <div className="form-grid">
          <div>
            <label className="form-label">Danh mục <span className="required-star">*</span></label>
            <select className="create-form-select">
              <option value="">-- Chọn danh mục --</option>
              <option>TOEIC</option>
              <option>JavaScript</option>
              <option>Python</option>
              <option>SQL</option>
              <option>React</option>
              <option>Java</option>
              <option>Khác</option>
            </select>
          </div>
          <div>
            <label className="form-label">Thời gian làm bài <span className="required-star">*</span></label>
            <div className="input-with-label-pos">
              <input type="number" placeholder="60" min="1" className="form-input" style={{ paddingRight: '50px' }} />
              <span className="input-unit-right">phút</span>
            </div>
          </div>
          <div>
            <label className="form-label">Điểm đạt (%)</label>
            <div className="input-with-label-pos">
              <input type="number" placeholder="60" min="1" max="100" className="form-input" style={{ paddingRight: '30px' }} />
              <span className="input-percent-right">%</span>
            </div>
          </div>
        </div>
      </div>

      {/*  FORM CARD: Questions  */}
      <div className="form-card">
        <div className="card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="card-icon" style={{ background: '#dcfce7' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
            <div>
              <h3 className="card-title">Danh sách câu hỏi</h3>
              <p style={{ fontSize: '11px', color: 'var(--gray-400)', fontWeight: '600' }}>Thêm và quản lý các câu hỏi trắc nghiệm</p>
            </div>
          </div>
          <div className="section-actions">
            <button className="btn-secondary" onClick={() => console.log('Action triggered')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Import câu hỏi</button>
            <button className="btn-primary-mini" onClick={() => console.log('Action triggered')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Thêm câu hỏi</button>
          </div>
        </div>

        {/*  Question list  */}
        <div id="question-list">

          {/*  Q1  */}
          <div className="question-box">
            <div className="question-top">
              <span className="question-number">Câu 1</span>
              <button className="btn-delete-mini" style={{ width: '28px', height: '28px', padding: '0' }} onClick={() => console.log('Action triggered')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <input type="text" placeholder="Nhập nội dung câu hỏi..." defaultValue="Which of the following is NOT a JavaScript data type?" className="form-input" style={{ marginBottom: '10px', fontSize: '13px', padding: '10px 12px' }} />
            <div className="question-options-grid">
              <div className="option-item correct">
                <input type="radio" checked readOnly style={{ accentColor: '#16a34a', width: '14px', height: '14px' }} />
                <input type="text" defaultValue="String" className="form-input" style={{ flex: '1', border: 'none', background: 'transparent', padding: '0', fontSize: '13px', fontWeight: '600' }} />
                <span className="correct-mark">Đúng</span>
              </div>
              <div className="option-item">
                <input type="radio" readOnly style={{ width: '14px', height: '14px' }} />
                <input type="text" defaultValue="Boolean" className="form-input" style={{ flex: '1', border: 'none', background: 'transparent', padding: '0', fontSize: '13px' }} />
              </div>
              <div className="option-item">
                <input type="radio" readOnly style={{ width: '14px', height: '14px' }} />
                <input type="text" defaultValue="Integer" className="form-input" style={{ flex: '1', border: 'none', background: 'transparent', padding: '0', fontSize: '13px' }} />
              </div>
              <div className="option-item">
                <input type="radio" readOnly style={{ width: '14px', height: '14px' }} />
                <input type="text" defaultValue="Object" className="form-input" style={{ flex: '1', border: 'none', background: 'transparent', padding: '0', fontSize: '13px' }} />
              </div>
            </div>
          </div>

          {/*  Q2  */}
          <div className="question-box">
            <div className="question-top">
              <span className="question-number">Câu 2</span>
              <button className="btn-delete-mini" style={{ width: '28px', height: '28px', padding: '0' }} onClick={() => console.log('Action triggered')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <input type="text" placeholder="Nhập nội dung câu hỏi..." defaultValue="What does SQL stand for?" className="form-input" style={{ marginBottom: '10px', fontSize: '13px', padding: '10px 12px' }} />
            <div className="question-options-grid">
              <div className="option-item">
                <input type="radio" readOnly style={{ width: '14px', height: '14px' }} />
                <input type="text" defaultValue="Structured Query Language" className="form-input" style={{ flex: '1', border: 'none', background: 'transparent', padding: '0', fontSize: '13px' }} />
              </div>
              <div className="option-item correct">
                <input type="radio" checked readOnly style={{ accentColor: '#16a34a', width: '14px', height: '14px' }} />
                <input type="text" defaultValue="Structured Query Language" className="form-input" style={{ flex: '1', border: 'none', background: 'transparent', padding: '0', fontSize: '13px' }} />
                <span className="correct-mark">Đúng</span>
              </div>
              <div className="option-item">
                <input type="radio" readOnly style={{ width: '14px', height: '14px' }} />
                <input type="text" defaultValue="Simple Question Language" className="form-input" style={{ flex: '1', border: 'none', background: 'transparent', padding: '0', fontSize: '13px' }} />
              </div>
              <div className="option-item">
                <input type="radio" readOnly style={{ width: '14px', height: '14px' }} />
                <input type="text" defaultValue="Syntax Query Language" className="form-input" style={{ flex: '1', border: 'none', background: 'transparent', padding: '0', fontSize: '13px' }} />
              </div>
            </div>
          </div>

        </div>

        {/*  Add Q placeholder  */}
        <div className="question-placeholder-dash" onClick={() => console.log('Action triggered')}>
          <div style={{ fontSize: '24px', marginBottom: '6px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
          <div style={{ fontSize: '13px', fontWeight: '700' }}>Nhấn để thêm câu hỏi mới</div>
          <div style={{ fontSize: '11px', fontWeight: '600', opacity: '0.7', marginTop: '2px' }}>Hoặc nhấn nút "Thêm câu hỏi" ở trên</div>
        </div>

        <div className="q-footer-info">
          <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></span>
          <span className="q-footer-count">Tổng: 2 câu hỏi</span>
          <span style={{ fontSize: '11px', color: 'var(--gray-400)', fontWeight: '600' }}>• Click radio để chọn đáp án đúng</span>
        </div>
      </div>

      {/*  FORM CARD: Settings  */}
      <div className="form-card">
        <div className="card-header">
          <div className="card-icon" style={{ background: '#fef9c3' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
          <div>
            <h3 className="card-title">Cài đặt bài thi</h3>
            <p style={{ fontSize: '11px', color: 'var(--gray-400)', fontWeight: '600' }}>Tùy chỉnh cách thức hiển thị và làm bài</p>
          </div>
        </div>

        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <label className="settings-toggle-card">
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--gray-800)', marginBottom: '2px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg> Xáo trộn câu hỏi</div>
              <div style={{ fontSize: '11px', color: 'var(--gray-400)', fontWeight: '600' }}>Hiển thị câu hỏi ngẫu nhiên</div>
            </div>
            <div className="toggle-switch-rel">
              <input type="checkbox" defaultChecked className="toggle-input-hidden" id="toggle1" />
              <label htmlFor="toggle1" className="toggle-label-wrap active">
                <span className="toggle-circle-span active"></span>
              </label>
            </div>
          </label>

          <label className="settings-toggle-card">
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--gray-800)', marginBottom: '2px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Xem điểm ngay</div>
              <div style={{ fontSize: '11px', color: 'var(--gray-400)', fontWeight: '600' }}>Hiển thị điểm sau khi nộp bài</div>
            </div>
            <div className="toggle-switch-rel">
              <input type="checkbox" defaultChecked className="toggle-input-hidden" id="toggle2" />
              <label htmlFor="toggle2" className="toggle-label-wrap active">
                <span className="toggle-circle-span active"></span>
              </label>
            </div>
          </label>

          <label className="settings-toggle-card">
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--gray-800)', marginBottom: '2px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Làm nhiều lần</div>
              <div style={{ fontSize: '11px', color: 'var(--gray-400)', fontWeight: '600' }}>Cho phép học viên thử lại</div>
            </div>
            <div className="toggle-switch-rel">
              <input type="checkbox" className="toggle-input-hidden" id="toggle3" />
              <label htmlFor="toggle3" className="toggle-label-wrap">
                <span className="toggle-circle-span"></span>
              </label>
            </div>
          </label>

          <label className="settings-toggle-card">
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--gray-800)', marginBottom: '2px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polyline points="20 6 9 17 4 12"/></svg> Xem đáp án</div>
              <div style={{ fontSize: '11px', color: 'var(--gray-400)', fontWeight: '600' }}>Hiển thị đáp án đúng sau nộp</div>
            </div>
            <div className="toggle-switch-rel">
              <input type="checkbox" defaultChecked className="toggle-input-hidden" id="toggle4" />
              <label htmlFor="toggle4" className="toggle-label-wrap active">
                <span className="toggle-circle-span active"></span>
              </label>
            </div>
          </label>
        </div>
      </div>

      {/*  Action buttons  */}
      <div className="action-bar">
        <button onClick={() => navigate('/exam-list')} className="btn-cancel">
          ← Hủy
        </button>
        <button onClick={() => console.log('Action triggered')} className="btn-secondary" style={{ padding: '13px 24px', borderRadius: '12px', fontSize: '14px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Lưu nháp
        </button>
        <button onClick={() => console.log('Action triggered')} className="btn-save" style={{ padding: '13px 28px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M12 2L8 8H3l3.5 3L5 17l7-4 7 4-1.5-6L21 8h-5z"/></svg> Tạo bài thi
        </button>
      </div>

      </div>
    </div>

{/*  Success Toast  */}
<div id="toast" className="success-toast-fixed">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polyline points="20 6 9 17 4 12"/></svg> Bài thi đã được tạo thành công!
</div>

    </>
  );
}
