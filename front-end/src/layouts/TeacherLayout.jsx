import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  FileTextOutlined, 
  PlusCircleOutlined, 
  QuestionCircleOutlined,
  BellOutlined, 
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  AppstoreOutlined,
  TeamOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from '../components/ProfileDropdown';
import '../styles/Admin.css'; // SỬ DỤNG LẠI STYLE ADMIN CHO NHANH

const TeacherLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Close when navigating
  React.useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);
  
  const menuItems = [
    { path: '/teacher/dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
    { path: '/teacher/exams', icon: <FileTextOutlined />, label: 'Quản lý Đề thi' },
    { path: '/teacher/students', icon: <TeamOutlined />, label: 'Học viên' },
    { path: '/teacher/reports', icon: <BarChartOutlined />, label: 'Báo cáo' },
    { path: '/teacher/questions', icon: <QuestionCircleOutlined />, label: 'Ngân hàng Câu hỏi' },
  ];

  return (
    <div className="admin-layout">
      {/* Overlay for mobile sidebar */}
      <div 
        className={`admin-sidebar-overlay ${mobileOpen ? 'active' : ''}`} 
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`} style={{borderColor: '#fbbf24'}}>
        <div className="admin-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="logo-icon" style={{background: '#ca8a04'}}>T</div>
              <span className="logo-text">Teacher Workspace</span>
            </div>
            <CloseOutlined 
              className="mobile-header-toggle" 
              style={{ fontSize: '20px', margin: 0 }} 
              onClick={() => setMobileOpen(false)} 
            />
          </div>
        </div>
        
        <nav className="admin-menu">
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({isActive}) => `admin-menu-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MenuOutlined 
               className="mobile-header-toggle" 
               onClick={() => setMobileOpen(true)} 
            />
            <div className="admin-header-search">
               <SearchOutlined />
               <input type="text" placeholder="Tìm đề thi, câu hỏi..." />
            </div>
          </div>
          
          <div className="admin-header-right">
            <div className="admin-notification" onClick={() => navigate('/teacher/notifications')}>
              <BellOutlined style={{ fontSize: '20px' }} />
              <span className="badge">5</span>
            </div>
            
            <ProfileDropdown>
               <div className="user-avatar" style={{ border: '2px solid #fde68a' }}>
                 {user?.fullname?.charAt(0) || 'T'}
               </div>
            </ProfileDropdown>
          </div>
        </header>
        
        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;
