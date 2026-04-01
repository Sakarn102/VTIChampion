import { useNavigate } from 'react-router-dom';
import '../styles/GlobalModals.css';
import '../styles/Home.css';

export default function GlobalModals() {
  const navigate = useNavigate();
  return (
    <>
      
<div id="import-modal" className="modal-overlay">
  <div className="modal-container">

    {/*  Modal header  */}
    <div className="modal-header-grad">
      <div>
        <h3 className="modal-header-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Import câu hỏi</h3>
        <p className="modal-header-subtitle">Tải lên file để thêm nhiều câu hỏi cùng lúc</p>
      </div>
      <button onClick={() => console.log('Action triggered')} className="btn-close-modal"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>

    {/*  Tabs  */}
    <div className="modal-tabs">
      <button id="tab-file" onClick={() => console.log('Action triggered')} className="modal-tab-btn active"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> Upload File</button>
      <button id="tab-text" onClick={() => console.log('Action triggered')} className="modal-tab-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Nhập thủ công</button>
    </div>

    <div className="modal-body">

      {/*  TAB FILE  */}
      <div id="tab-file-content">
        {/*  Drop zone  */}
        <div id="drop-zone" className="drop-zone-rel" onClick={() => console.log('Action triggered')}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
          <p style={{ fontSize: '14px', fontWeight: '800', color: '#1d4ed8', marginBottom: '4px' }}>Kéo thả file vào đây</p>
          <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>hoặc click để chọn file</p>
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span className="file-pill">.xlsx</span>
            <span className="file-pill">.csv</span>
            <span className="file-pill">.json</span>
          </div>
          <input type="file" id="file-input" accept=".xlsx,.csv,.json" style={{ display: 'none' }} />
        </div>

        {/*  File selected state (hidden by default)  */}
        <div id="file-selected" className="file-selected-box" style={{ display: 'none' }}>
          <div className="file-icon-box"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <div style={{ flex: '1' }}>
            <div id="file-name" style={{ fontSize: '13px', fontWeight: '800', color: '#15803d' }}>questions_import.xlsx</div>
            <div id="file-size" style={{ fontSize: '11px', color: '#86efac', fontWeight: '600' }}>24 KB • Sẵn sàng import</div>
          </div>
          <button onClick={() => console.log('Action triggered')} className="btn-remove-file"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>

        {/*  Template download  */}
        <div className="template-download-box">
          <span style={{ fontSize: '22px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg></span>
          <div style={{ flex: '1' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#1d4ed8', marginBottom: '2px' }}>Chưa có file mẫu?</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Tải xuống template Excel để điền câu hỏi đúng định dạng</div>
          </div>
          <button onClick={() => console.log('Action triggered')} className="btn-download-mini">⬇ Tải mẫu</button>
        </div>
      </div>

      {/*  TAB TEXT  */}
      <div id="tab-text-content" style={{ display: 'none' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '10px' }}>Nhập theo định dạng: <code style={{ background: '#eff6ff', padding: '2px 6px', borderRadius: '6px', color: '#2563eb', fontSize: '11px' }}>Câu hỏi | Đáp án A | Đáp án B | Đáp án C | Đáp án D | Đáp án đúng (A/B/C/D)</code></p>
        <textarea id="bulk-text" className="bulk-textarea" placeholder="VD:&#10;What is 2+2? | 3 | 4 | 5 | 6 | B&#10;What color is the sky? | Red | Green | Blue | Yellow | C"></textarea>
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></span>
          <span id="text-q-preview" style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>Nhập câu hỏi để xem trước...</span>
        </div>
      </div>

      {/*  Action buttons  */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #eff6ff' }}>
        <button onClick={() => console.log('Action triggered')} style={{ flex: '1' }} className="btn-secondary">Hủy</button>
        <button onClick={() => console.log('Action triggered')} style={{ flex: '2', padding: '12px' }} className="btn-primary-mini"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Import câu hỏi</button>
      </div>
    </div>
  </div>
</div>













<div id="forgot-modal" className="modal-overlay">
  <div className="forgot-modal-box">
    <button onClick={() => console.log('Action triggered')} className="btn-close-forgot">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div className="forgot-icon-wrap">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    </div>
    <h3 style={{ fontFamily: '\'Poppins\',sans-serif', fontSize: '20px', fontWeight: '700', color: '#1e293b', textAlign: 'center', marginBottom: '8px' }}>Quên mật khẩu?</h3>
    <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', marginBottom: '24px', lineHeight: '1.7' }}>Nhập email của bạn và chúng tôi sẽ gửi<br />link đặt lại mật khẩu.</p>
    <div style={{ marginBottom: '16px' }}>
      <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.4px' }}>Email</label>
      <input id="forgot-email" type="email" placeholder="example@email.com" className="form-input" style={{ background: '#eff6ff', borderColor: '#dbeafe' }} />
    </div>
    <div id="forgot-msg" className="forgot-msg-toast" style={{ display: 'none' }}>
      ✓ Đã gửi link xác nhận vào email của bạn!
    </div>
    <button onClick={() => console.log('Action triggered')} className="btn-primary-mini" style={{ width: '100%', padding: '13px', fontSize: '15px' }}>
      Gửi link đặt lại mật khẩu
    </button>
  </div>
</div>



    </>
  );
}
