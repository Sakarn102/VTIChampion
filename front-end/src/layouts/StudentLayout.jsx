import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { BellOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from '../components/ProfileDropdown';
import GlobalModals from '../components/GlobalModals';

const StudentLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="student-layout" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div className="app-header" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="app-logo">
          <div className="logo-dot">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <span className="logo-text">MCQ Training</span>
        </div>
        
        <nav className="app-nav">
          <Link to="/home" className="cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Trang chủ
          </Link>
          <Link to="/exam-list" className="cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Bài thi
          </Link>
          <Link to="/results" className="cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Kết quả
          </Link>
          <Link to="/profile" className="cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Hồ sơ
          </Link>
        </nav>

        <div className="header-right">
          <div className="notification-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div className="notif-badge">3</div>
          </div>
          <ProfileDropdown>
            <div className="user-avatar" style={{ background: 'var(--blue-500)', color: 'white' }}>
              {user?.fullname?.charAt(0) || user?.username?.charAt(0) || 'S'}
            </div>
          </ProfileDropdown>
        </div>
      </div>

      <main style={{ padding: '20px 15px' }}>
        <Outlet />
      </main>
      
      <GlobalModals />
    </div>
  );
};

export default StudentLayout;
