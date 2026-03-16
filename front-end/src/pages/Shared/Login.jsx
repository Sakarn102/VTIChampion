import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="screen active no-padding" id="login">
      <div className="auth-layout">
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="logo-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <h1>MCQ Training<br />Test Platform</h1>
            <p>Nền tảng luyện thi trắc nghiệm thông minh dành cho học viên VTI Academy</p>
            <div className="feature-pills">
              <div className="pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg> Hàng nghìn câu hỏi chất lượng cao
              </div>
              <div className="pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg> Xem điểm ngay sau khi làm bài
              </div>
              <div className="pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                </svg> Theo dõi tiến độ học tập
              </div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-card">
            <h2>Chào mừng trở lại <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></h2>
            <p className="subtitle">Đăng nhập để tiếp tục học tập của bạn</p>

            <div className="form-group">
              <label>Email hoặc Tên đăng nhập</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input type="text" placeholder="Nhập email hoặc username" />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ marginBottom: '0' }}>Mật khẩu</label>
                <a className="forgot-link">Quên mật khẩu?</a>
              </div>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input type="password" placeholder="Nhập mật khẩu" />
              </div>
            </div>

            <div className="remember-row">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" style={{ cursor: 'pointer' }}>Ghi nhớ đăng nhập</label>
            </div>

            <button className="btn-primary" onClick={() => navigate('/')}>Đăng nhập →</button>

            <div className="link-text">
              Chưa có tài khoản? <a onClick={() => navigate('/register')}>Đăng ký ngay</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
