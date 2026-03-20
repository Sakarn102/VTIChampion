import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileDropdown.css';
import userApi from '../api/userApi';

const ProfileDropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gọi API lấy thông tin profile từ Database khi component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // Nếu chưa đăng nhập thì không gọi lấy profile

      try {
        setLoading(true);
        const data = await userApi.getProfile();
        setUser(data.data || data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user từ DB:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const goToProfile = () => {
    setIsOpen(false);
    // Thay đổi đường dẫn này trỏ đến trang Profile thực tế của bạn
    navigate('/profile'); 
  };

  return (
    <div className="profile-dropdown-wrapper" ref={dropdownRef}>
      {/* Nút trigger (avatar) */}
      <div 
        className="profile-dropdown-trigger" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {user ? (
          <div className="user-avatar" style={{ overflow: 'hidden', padding: 0 }}>
            {user.avatarUrl ? (
              <img 
                src={`http://localhost:8080/api/v1/files/${user.avatarUrl}`} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => { e.target.onerror = null; e.target.src = user.avatarUrl; }}
              />
            ) : (
              user.fullname ? user.fullname.charAt(0).toUpperCase() : user.username ? user.username.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'
            )}
          </div>
        ) : (
          children
        )}
      </div>

      {isOpen && (
        <div className="profile-dropdown-menu">
          {loading ? (
            <div className="profile-info" style={{ justifyContent: 'center', padding: '16px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Đang tải thông tin...</span>
            </div>
          ) : user ? (
            <>
              <div className="profile-info profile-info-clickable" onClick={goToProfile}>
                <div className="profile-avatar-large" style={{ overflow: 'hidden' }}>
                  {user.avatarUrl ? (
                    <img src={`http://localhost:8080/api/v1/files/${user.avatarUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = user.avatarUrl; }} />
                  ) : (
                    user.fullname ? user.fullname.charAt(0).toUpperCase() : user.username ? user.username.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <div className="profile-details">
                  <span className="profile-name">{user.fullname || user.username || 'Người dùng'}</span>
                  <span className="profile-email">{user.email || 'Click để xem hồ sơ'}</span>
                  {user.role?.name && <span className="profile-role">{user.role.name}</span>}
                </div>
              </div>
              
              <div className="profile-divider"></div>
              
              <button className="profile-dropdown-item" onClick={goToProfile}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Hồ sơ cá nhân
              </button>
              
              <button className="profile-dropdown-item logout-btn" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Đăng xuất
              </button>
            </>
          ) : (
            <div className="profile-info">
              <button className="profile-dropdown-item login-btn" onClick={() => window.location.href = '/login'}>
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
