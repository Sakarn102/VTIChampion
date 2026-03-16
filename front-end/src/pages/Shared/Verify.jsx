import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

export default function Verify() {
  const navigate = useNavigate();

  return (
    <div className="screen active no-padding" id="verify">
      <div className="verify-screen">
        <div className="verify-card">
          <div className="verify-icon-wrap">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h2>Xác thực Email</h2>
          <p>Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã vào bên dưới.</p>
          <div className="email-badge">test.student@vtiacademy.edu.vn</div>
          
          <div className="otp-row">
            <input type="text" maxLength="1" className="otp-input" defaultValue="4" />
            <input type="text" maxLength="1" className="otp-input" defaultValue="8" />
            <input type="text" maxLength="1" className="otp-input" defaultValue="2" />
            <input type="text" maxLength="1" className="otp-input" placeholder="-" />
            <input type="text" maxLength="1" className="otp-input" placeholder="-" />
            <input type="text" maxLength="1" className="otp-input" placeholder="-" />
          </div>

          <button className="btn-primary" onClick={() => navigate('/')}>Xác thực & Bắt đầu →</button>
          
          <div className="resend-text">
            Không nhận được mã? <a onClick={() => console.log('Resend OTP')}>Gửi lại mã (59s)</a>
          </div>
        </div>
      </div>
    </div>
  );
}
