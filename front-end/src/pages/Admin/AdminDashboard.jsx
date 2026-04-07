import React, { useState, useEffect } from 'react';
import { 
  TeamOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  LineChartOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { message, Spin, Skeleton, Badge } from 'antd';
import adminApi from '../../api/adminApi';
import '../../styles/Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDashboardStats();
      // axiosClient đã return response.data ở interceptor nên res chính là data
      setStats(res);
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
      message.error("Không thể tải dữ liệu thống kê hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  if (loading && !stats) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
        <Spin size="large" />
        <p style={{ color: '#64748b', fontWeight: 600 }}>Đang khởi tạo Dashboard siêu cấp...</p>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            Chào buổi tối, Quản trị viên! <Badge status="processing" text="Live" style={{ marginLeft: '12px', fontSize: '13px', fontWeight: 600, color: '#16a34a' }} />
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Dưới đây là thống kê thời gian thực từ hệ thống của bạn.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
             <button className="admin-btn-outline" onClick={fetchStats} disabled={loading} style={{ border: 'none', background: '#f1f5f9' }}>
                <ReloadOutlined spin={loading} /> Làm mới
             </button>
             <button className="admin-btn-primary" style={{ padding: '10px 24px', borderRadius: '14px' }}>
                <LineChartOutlined /> Xuất báo cáo
             </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card animate-fade-in">
          <div className="icon-wrapper icon-blue">
            <TeamOutlined />
          </div>
          <div className="label">Tổng số User</div>
          <div className="value">{stats?.totalUsers?.toLocaleString() || 0}</div>
          <div style={{ marginTop: '12px' }}>
            <span className="trend up">↑ +12.5%</span> <span style={{fontSize: '13px', color: '#94a3b8'}}>tháng này</span>
          </div>
        </div>

        <div className="admin-stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="icon-wrapper icon-yellow">
            <FileTextOutlined />
          </div>
          <div className="label">Tổng số đề thi</div>
          <div className="value">{stats?.totalExams?.toLocaleString() || 0}</div>
          <div style={{ marginTop: '12px' }}>
            <span className="trend up">↑ +5.2%</span> <span style={{fontSize: '13px', color: '#94a3b8'}}>tháng này</span>
          </div>
        </div>

        <div className="admin-stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="icon-wrapper icon-purple">
            <CheckCircleOutlined />
          </div>
          <div className="label">Lượt làm bài</div>
          <div className="value">{stats?.totalResults?.toLocaleString() || 0}</div>
          <div style={{ marginTop: '12px' }}>
            <span className="trend up">↑ +24.8%</span> <span style={{fontSize: '13px', color: '#94a3b8'}}>tháng này</span>
          </div>
        </div>

        <div className="admin-stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="icon-wrapper icon-green">
            <LineChartOutlined />
          </div>
          <div className="label">Điểm trung bình</div>
          <div className="value">{stats?.averageScore || 0}</div>
          <div style={{ marginTop: '12px' }}>
            <span className="trend up">↑ +0.3</span> <span style={{fontSize: '13px', color: '#94a3b8'}}>từ tuần trước</span>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-row">
        {/* Weekly Activities Chart */}
        <div className="admin-card animate-slide-up">
           <div className="admin-card-title">
             <span>Thống kê hoạt động tuần qua</span>
             <select style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }}>
                <option>7 ngày gần nhất</option>
                <option>30 ngày gần nhất</option>
             </select>
           </div>
           <div style={{ height: '320px', width: '100%', marginTop: '20px' }}>
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={stats?.weeklySessions || []}>
                 <defs>
                   <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                 />
                 <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                 />
                 <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                 />
                 <Area 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSessions)" 
                    name="Lượt làm bài"
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Role Distribution Chart */}
        <div className="admin-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="admin-card-title">Phân bố vai trò User</h3>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.roleDistribution || []}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.roleDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activities Section */}
      <div className="admin-card animate-slide-up" style={{ marginTop: '20px', animationDelay: '0.2s' }}>
          <div className="admin-card-title">
            <span>Hoạt động vừa diễn ra</span>
            <span style={{ fontSize: '13px', color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}>Xem tất cả</span>
          </div>
          <div className="recent-list" style={{ marginTop: '10px' }}>
             {(stats?.recentActivities || []).map((activity, index) => (
               <div key={index} className="activity-item" style={{ 
                  padding: '16px 20px', 
                  borderBottom: index === (stats?.recentActivities?.length - 1) ? 'none' : '1px solid #f1f5f9', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  transition: 'all 0.2s'
               }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '14px', 
                    background: activity.score >= 8 ? '#dcfce7' : activity.score >= 5 ? '#eff6ff' : '#fee2e2', 
                    color: activity.score >= 8 ? '#16a34a' : activity.score >= 5 ? '#2563eb' : '#ef4444', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 800,
                    fontSize: '18px'
                  }}>
                    {activity.studentName.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
                        {activity.studentName} <span style={{ fontWeight: 500, color: '#64748b' }}>vừa hoàn thành</span> {activity.examTitle}
                    </p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ReloadOutlined style={{ fontSize: '11px' }} /> {activity.timeAgo}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                        fontWeight: 800, 
                        color: activity.score >= 8 ? '#16a34a' : activity.score >= 5 ? '#2563eb' : '#ef4444', 
                        fontSize: '18px' 
                    }}>
                        {activity.score?.toFixed(1) || '0.0'}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Điểm số</div>
                  </div>
               </div>
             ))}
             {(!stats?.recentActivities || stats?.recentActivities?.length === 0) && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Chưa có hoạt động nào được ghi lại.</div>
             )}
          </div>
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease forwards;
          opacity: 0;
        }
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .activity-item:hover {
          background-color: #f8fafc;
          transform: scale(1.002);
        }
      `}</style>
    </>
  );
};

export default AdminDashboard;
