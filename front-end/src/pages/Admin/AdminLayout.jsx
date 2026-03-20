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
  BellOutlined,
  SearchOutlined,
  LayoutOutlined
} from '@ant-design/icons';
import ProfileDropdown from '../../components/ProfileDropdown';
import userApi from '../../api/userApi';
import '../../styles/Admin.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setUser(data.data || data);
      } catch (error) {
        console.error("Lỗi fetch profil admin");
      }
    };
    fetchProfile();
  }, []);
  
  const menuItems = [
    { path: '/admin/dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
    { path: '/admin/users', icon: <UserOutlined />, label: 'Users' },
    { path: '/admin/classes', icon: <TeamOutlined />, label: 'Classes' },
    { path: '/admin/exams', icon: <FileTextOutlined />, label: 'Exams' },
    { path: '/admin/questions', icon: <QuestionCircleOutlined />, label: 'Questions' },
    { path: '/admin/results', icon: <BarChartOutlined />, label: 'Results' },
    { path: '/admin/reports', icon: <LayoutOutlined />, label: 'Reports' },
    { path: '/admin/settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/dashboard')}>
          <div className="logo-icon">M</div>
          <span className="logo-text">MCQ Admin</span>
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
          <div className="admin-header-search">
            <SearchOutlined />
            <input type="text" placeholder="Tìm kiếm trang, người dùng, bài thi..." />
          </div>
          
          <div className="admin-header-right">
            <div className="admin-notification" onClick={() => navigate('/admin/notifications')}>
              <BellOutlined style={{ fontSize: '20px' }} />
              <span className="badge">12</span>
            </div>
            
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
