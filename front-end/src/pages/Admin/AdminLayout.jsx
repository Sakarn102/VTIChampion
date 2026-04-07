import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  AppstoreOutlined, 
  UserOutlined, 
  TeamOutlined, 
  FileTextOutlined, 
  QuestionCircleOutlined,
  BarChartOutlined,
  SettingOutlined,
  SearchOutlined,
  LayoutOutlined,
  MenuOutlined,
  CloseOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from '../../components/ProfileDropdown';
import '../../styles/Admin.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Close when navigating
  React.useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);
  
  const menuItems = [
    { path: '/admin/dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
    { path: '/admin/users', icon: <UserOutlined />, label: 'Quản lý tài khoản' },
    { path: '/admin/classes', icon: <TeamOutlined />, label: 'Quản lý lớp học' },
    { path: '/admin/exams', icon: <FileTextOutlined />, label: 'Quản lý bài thi' },
    { path: '/admin/support', icon: <CustomerServiceOutlined />, label: 'Quản lý hỗ trợ' },
  ];

  return (
    <div className="admin-layout">
      {/* Overlay for mobile sidebar */}
      <div 
        className={`admin-sidebar-overlay ${mobileOpen ? 'active' : ''}`} 
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => navigate('/admin/dashboard')}>
              <div className="logo-icon">M</div>
              <span className="logo-text">MCQ Admin</span>
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

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MenuOutlined 
               className="mobile-header-toggle" 
               onClick={() => setMobileOpen(true)} 
            />
           
          </div>
          
          <div className="admin-header-right">
            {/* Notification removed */}
            
            <ProfileDropdown>
              <div className="user-avatar" style={{ border: '2px solid var(--blue-100)', borderRadius: '12px', overflow: 'hidden' }}>
                {user?.avatarUrl ? (
                  <img src={`http://localhost:8080/api/v1/files/${user.avatarUrl}`} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = user.avatarUrl; }} />
                ) : (
                  user?.fullname?.charAt(0) || user?.username?.charAt(0) || 'A'
                )}
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

export default AdminLayout;
