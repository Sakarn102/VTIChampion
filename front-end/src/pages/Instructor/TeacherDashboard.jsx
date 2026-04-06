import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  TeamOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  TrophyOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BookOutlined
} from '@ant-design/icons';
import { message, Spin, Avatar, Tag } from 'antd';
import userApi from '../../api/userApi';
import classApi from '../../api/classApi';
import examApi from '../../api/examApi';
import resultApi from '../../api/resultApi';
import '../../styles/Admin.css';
import '../../styles/TeacherDashboard.css';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalExams: 0,
    totalSubmissions: 0,
    avgScore: 0
  });
  const [recentResults, setRecentResults] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [gradeData, setGradeData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const profileRes = await userApi.getProfile();
        const profileData = profileRes.data || profileRes;
        setProfile(profileData);
        const teacherId = profileData.id || profileData.userId;
        const teacherName = profileData.fullname;

        const [classesRes, countsRes] = await Promise.all([
          classApi.getAll({ teacher_id: teacherId }),
          classApi.getStudentCounts()
        ]);
        
        let myClasses = Array.isArray(classesRes) ? classesRes : (classesRes?.content || []);
        const studentCounts = countsRes.data || countsRes;
        
        if (teacherName) {
            myClasses = myClasses.filter(c => c.teacherName?.toLowerCase() === teacherName.toLowerCase());
        }

        const examsRes = await examApi.getAll({ teacher_id: teacherId, size: 1000 });
        const myExams = examsRes.data?.content || examsRes.content || [];

        let allResults = [];
        const performanceMap = [];
        
        await Promise.all(myClasses.map(async (cls) => {
           try {
              const res = await resultApi.getResultsByClass(cls.id);
              const data = Array.isArray(res) ? res : (res.data || []);
              allResults = [...allResults, ...data];
              
              if (data.length > 0) {
                  const sum = data.reduce((acc, curr) => acc + (curr.score || 0), 0);
                  performanceMap.push({
                      name: cls.name,
                      avg: Number((sum / data.length).toFixed(2)),
                      count: data.length
                  });
              }
           } catch (e) {
              console.error(`Error fetching results for class ${cls.id}`, e);
           }
        }));

        const totalStudents = myClasses.reduce((acc, curr) => acc + (studentCounts[curr.id] || 0), 0);
        const avgScoreGlobal = allResults.length > 0 
           ? (allResults.reduce((acc, curr) => acc + (curr.score || 0), 0) / allResults.length).toFixed(2)
           : 0;

        setStats({
          totalClasses: myClasses.length,
          totalStudents: totalStudents,
          totalExams: myExams.length,
          totalSubmissions: allResults.length,
          avgScore: avgScoreGlobal
        });

        const sorted = allResults
           .sort((a,b) => new Date(b.endTime || b.startTime) - new Date(a.endTime || a.startTime))
           .slice(0, 5);
        setRecentResults(sorted);

        setPerformanceData(performanceMap);

        const daysOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const today = new Date();
        const activityMap = {};

        for (let i = 0; i < 7; i++) {
          const d = new Date(); d.setDate(today.getDate() - i);
          activityMap[daysOfWeek[d.getDay()]] = 0;
        }

        allResults.forEach(res => {
          const resDate = new Date(res.endTime || res.startTime);
          const diffDays = Math.ceil(Math.abs(today - resDate) / (1000 * 60 * 60 * 24));
          if (diffDays <= 7) {
            const dayName = daysOfWeek[resDate.getDay()];
            if (activityMap[dayName] !== undefined) activityMap[dayName]++;
          }
        });

        const chronologicalActivity = [];
        for (let i = 6; i >= 0; i--) {
           const d = new Date(); d.setDate(today.getDate() - i);
           const dayName = daysOfWeek[d.getDay()];
           chronologicalActivity.push({ name: dayName, count: activityMap[dayName] || 0 });
        }
        setActivityData(chronologicalActivity);

        setPieData(performanceMap.map(cls => ({ name: cls.name, value: cls.count })).slice(0, 5));

        const grades = [
          { name: 'Kém (<4)', value: 0, color: '#ef4444' },
          { name: 'Yếu (4-5)', value: 0, color: '#f97316' },
          { name: 'Tr.Bình (5-7)', value: 0, color: '#eab308' },
          { name: 'Giỏi (7-9)', value: 0, color: '#3b82f6' },
          { name: 'X.Sắc (9-10)', value: 0, color: '#10b981' }
        ];
        allResults.forEach(res => {
          const s = res.score || 0;
          if (s < 4) grades[0].value++;
          else if (s < 5) grades[1].value++;
          else if (s < 7) grades[2].value++;
          else if (s < 9) grades[3].value++;
          else grades[4].value++;
        });
        setGradeData(grades);

      } catch (error) {
        console.error("Dashboard error:", error);
        message.error("Không thể tải thông tin Dashboard!");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="teacher-dashboard-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bảng điều khiển Giảng viên</h1>
          <p style={{ color: '#64748b' }}>Chào mừng trở lại, <span style={{ fontWeight: 700, color: '#2563eb' }}>{profile?.fullname}</span>!</p>
        </div>
        <div className="admin-btn-primary">
           <CalendarOutlined /> {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="icon-wrapper icon-blue"><BookOutlined /></div>
          <div className="label">Lớp quản lý</div>
          <div className="value">{stats.totalClasses}</div>
        </div>
        <div className="admin-stat-card">
          <div className="icon-wrapper icon-green"><TeamOutlined /></div>
          <div className="label">Học viên</div>
          <div className="value">{stats.totalStudents}</div>
        </div>
        <div className="admin-stat-card">
          <div className="icon-wrapper icon-purple"><FileTextOutlined /></div>
          <div className="label">Đề thi</div>
          <div className="value">{stats.totalExams}</div>
        </div>
        <div className="admin-stat-card">
          <div className="icon-wrapper icon-yellow"><CheckCircleOutlined /></div>
          <div className="label">Lượt làm bài</div>
          <div className="value">{stats.totalSubmissions}</div>
        </div>
      </div>

      <div className="chart-row">
        <div className="admin-card">
          <h3 className="admin-card-title">Điểm TB theo lớp</h3>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 10]} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="avg" radius={[4, 4, 0, 0]} barSize={25}>
                   {performanceData.map((e, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-card-title">Tần suất làm bài</h3>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
               </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-card-title">Tỷ lệ lượt thi</h3>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie data={pieData} innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={5}>
                     {pieData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#64748b' }} verticalAlign="bottom" />
               </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="spectrum-row">
        <div className="admin-card">
          <h3 className="admin-card-title">Phân bố phổ điểm</h3>
          <div style={{ height: '300px', marginTop: '10px' }}>
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData} layout="vertical">
                   <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                   <XAxis type="number" hide />
                   <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 13, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                   <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                   <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={35}>
                      {gradeData.map((e, i) => <Cell key={i} fill={e.color} />)}
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card quality-card">
           <TrophyOutlined className="gold-trophy" />
           <h2 className="stat-value-large">{stats.avgScore}</h2>
           <p className="stat-label-muted">Điểm trung bình các lớp quản lý</p>
           
           <div style={{ marginTop: '20px' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 800, letterSpacing: '1px' }}>CHẤT LƯỢNG ĐÀO TẠO</p>
              <div className="quality-badge" style={{
                   background: stats.avgScore >= 7 ? '#dcfce7' : (stats.avgScore >= 5 ? '#fef9c3' : '#fee2e2'),
                   color: stats.avgScore >= 7 ? '#15803d' : (stats.avgScore >= 5 ? '#a16207' : '#dc2626'),
                }}>
                 {stats.avgScore >= 7 ? 'KHÁ / GIỎI' : (stats.avgScore >= 5 ? 'TRUNG BÌNH' : 'CẦN CẢI THIỆN')}
              </div>
              <p className="quality-subtext">
                {stats.avgScore >= 7 ? "Phương pháp giảng dạy hiệu quả cao." : (stats.avgScore >= 5 ? "Duy trì phong độ ổn định." : "Cần hỗ trợ học viên sát sao hơn.")}
              </p>
           </div>
        </div>
      </div>

      <div className="admin-card">
         <h3 className="admin-card-title">Kết quả nộp bài gần đây</h3>
         <div className="recent-list">
            {recentResults.map((res, index) => (
               <div key={index} style={{ padding: '16px 0', borderBottom: '1px solid #eff6ff', display: 'flex', alignItems: 'center', gap: '16px' }}>
                 <Avatar style={{ backgroundColor: '#dbeafe', color: '#2563eb', fontWeight: 700 }}>{res.studentName?.charAt(0)}</Avatar>
                 <div style={{ flex: 1 }}>
                   <p style={{ margin: 0, fontWeight: 700 }}>{res.studentName} - {res.examTitle}</p>
                   <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{res.className} • {new Date(res.endTime).toLocaleString('vi-VN')}</p>
                 </div>
                 <Tag color={res.score >= 5 ? 'green' : 'red'}>{res.score?.toFixed(1)} điểm</Tag>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
