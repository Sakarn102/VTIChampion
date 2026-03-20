import React from 'react';
import { 
  TeamOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  LineChartOutlined 
} from '@ant-design/icons';
import '../../styles/Admin.css';

const AdminDashboard = () => {
  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Tổng quan hệ thống</h1>
        <button className="admin-btn-primary">
          <LineChartOutlined /> Xuất báo cáo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="icon-wrapper icon-blue">
            <TeamOutlined />
          </div>
          <div className="label">Tổng số User</div>
          <div className="value">1,248</div>
          <div style={{ marginTop: '12px' }}>
            <span className="trend up">↑ +12%</span> <span style={{fontSize: '13px', color: '#94a3b8'}}>tháng này</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="icon-wrapper icon-yellow">
            <FileTextOutlined />
          </div>
          <div className="label">Tổng số đề thi</div>
          <div className="value">342</div>
          <div style={{ marginTop: '12px' }}>
            <span className="trend up">↑ +5%</span> <span style={{fontSize: '13px', color: '#94a3b8'}}>tháng này</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="icon-wrapper icon-purple">
            <CheckCircleOutlined />
          </div>
          <div className="label">Lượt làm bài</div>
          <div className="value">8,932</div>
          <div style={{ marginTop: '12px' }}>
            <span className="trend up">↑ +24%</span> <span style={{fontSize: '13px', color: '#94a3b8'}}>tháng này</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="icon-wrapper icon-green">
            <LineChartOutlined />
          </div>
          <div className="label">Điểm trung bình</div>
          <div className="value">7.8</div>
          <div style={{ marginTop: '12px' }}>
            <span className="trend down">↓ -0.2</span> <span style={{fontSize: '13px', color: '#94a3b8'}}>tháng này</span>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-row">
        {/* Placeholder for Line Chart & Pie Chart */}
        <div className="admin-card">
          <h3 className="admin-card-title">
            Thống kê lượt thi (Tuần qua)
          </h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
            <p style={{ color: '#64748b', fontWeight: 600 }}>[Khu vực biểu đồ Line Chart - Cần cài recharts/chart.js]</p>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-card-title">
            Phân bố Vai trò
          </h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
            <p style={{ color: '#64748b', fontWeight: 600 }}>[Khu vực biểu đồ Pie Chart]</p>
          </div>
        </div>
      </div>
      
      <div className="admin-card" style={{ marginTop: '20px' }}>
          <h3 className="admin-card-title">Hoạt động gần đây</h3>
          <div className="recent-list">
             {[1,2,3,4].map(i => (
               <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid #eff6ff', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    A
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>Nguyễn Văn A vừa nộp bài thi TOEIC 01</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Cách đây 15 phút</p>
                  </div>
                  <div style={{ fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>
                    9.0 điểm
                  </div>
               </div>
             ))}
          </div>
      </div>
    </>
  );
};

export default AdminDashboard;
