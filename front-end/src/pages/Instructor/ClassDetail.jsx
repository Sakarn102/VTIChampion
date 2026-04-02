import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserOutlined, ArrowLeftOutlined, CheckCircleOutlined, StopOutlined, DeleteOutlined, ExclamationCircleOutlined, TeamOutlined, ProfileOutlined, LineChartOutlined, CalendarOutlined, HistoryOutlined } from '@ant-design/icons';
import { Avatar, Table, Tag, Button, Modal, message, Tabs, Card, Row, Col, Statistic, Space } from 'antd';
import dayjs from 'dayjs';

import userApi from '../../api/userApi';
import resultApi from '../../api/resultApi';
import classApi from '../../api/classApi';
import examApi from '../../api/examApi';
import '../../styles/ClassDetail.css';

export default function ClassDetail() {
  const { classId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Nhận dữ liệu lớp học được truyền (lúc nhấn xem từ ClassList)
  const classData = location.state?.classData;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [classScores, setClassScores] = useState([]);
  const [loadingScores, setLoadingScores] = useState(false);

  const [classExams, setClassExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(false);

  // States cho Modal Lịch sử bài thi của học viên
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await classApi.getStudentsByClass(classId || classData?.id);
        
        // Map data để khớp với các cột trong Table (API trả về fullname, createDate)
        const mappedData = Array.isArray(res) ? res.map(student => ({
          ...student,
          name: student.fullname,
          joinDate: student.createDate
        })) : [];

        setStudents(mappedData);
      } catch (err) {
        console.error("Lỗi lấy danh sách học viên:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchScores = async () => {
      try {
        setLoadingScores(true);
        const res = await resultApi.getResultsByClass(classId || classData?.id);
        setClassScores(Array.isArray(res) ? res : (res?.data || []));
      } catch (error) {
        console.error("Lỗi lấy điểm:", error);
        setClassScores([]);
      } finally {
        setLoadingScores(false);
      }
    };

    const fetchExams = async () => {
      try {
        setLoadingExams(true);
        const res = await examApi.getAll({ classId: classId || classData?.id, size: 100 });
        setClassExams(res.content || res.data?.content || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách bài thi:", error);
      } finally {
        setLoadingExams(false);
      }
    };

    fetchStudents();
    fetchScores();
    fetchExams();
  }, [classId, classData]);

  const handleShowHistory = async (student) => {
    setSelectedStudent(student);
    setIsHistoryModalOpen(true);
    setLoadingHistory(true);
    try {
      const res = await resultApi.getResultsByStudent(student.id);
      setStudentHistory(Array.isArray(res) ? res : (res?.data || []));
    } catch (error) {
      console.error("Lỗi lấy lịch sử bài thi:", error);
      message.error("Không thể tải lịch sử bài thi.");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleRemoveStudent = (studentId) => {
    Modal.confirm({
      title: <span className="modal-title-confirm">Xác nhận xóa học viên</span>,
      icon: <ExclamationCircleOutlined className="modal-icon-confirm" />,
      content: <span className="modal-content-confirm">Bạn có chắc chắn muốn gỡ học viên này khỏi danh sách lớp? Tài khoản của họ sẽ tự động ngắt kết nối với lớp nhưng <b>không bị xóa</b> khỏi hệ thống.</span>,
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      okButtonProps: { className: 'modal-btn-ok' },
      cancelButtonProps: { className: 'modal-btn-cancel' },
      async onOk() {
        try {
          // Xóa trên Backend
          await classApi.removeStudentFromClass(classId || classData?.id, studentId);
          // Xóa trong danh sách state
          setStudents(prev => prev.filter(s => s.id !== studentId));
          message.success('Đã xóa học viên khỏi lớp.');
        } catch (error) {
           console.error("Xóa học viên thất bại", error);
           message.error("Xóa lỗi, vui lòng thử lại!");
        }
      }
    });
  };

  const columns = [
    { title: 'Họ và tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Ngày tham gia', dataIndex: 'joinDate', key: 'joinDate', render: (val) => dayjs(val).format('DD/MM/YYYY') },
    { 
      title: 'Thao tác', 
      key: 'actions', 
      width: '300px',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            ghost 
            icon={<LineChartOutlined />} 
            onClick={() => handleShowHistory(record)}
            className="btn-view-history"
          >
            Lịch sử thi
          </Button>
          <Button 
            danger 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleRemoveStudent(record.id)}
          >
            Xóa khỏi lớp
          </Button>
        </Space>
      )
    }
  ];

  const scoreColumns = [
    { title: 'Học viên', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Bài thi', dataIndex: 'examTitle', key: 'examTitle' },
    { title: 'Điểm', dataIndex: 'score', key: 'score', render: (val) => <span className="score-highlight">{val}</span> },
    { title: 'Ngày thi', dataIndex: 'startTime', key: 'startTime', render: (val) => val ? dayjs(val).format('DD/MM/YYYY HH:mm') : '' },
  ];

  const examColumns = [
    { title: 'Mã bài thi', dataIndex: 'code', key: 'code', width: '120px', render: (val) => <Tag color="geekblue">{val}</Tag> },
    { title: 'Tiêu đề đề thi', dataIndex: 'title', key: 'title', render: (val) => <span className="score-highlight">{val}</span> },
    { title: 'Thời gian thi', dataIndex: 'duration', key: 'duration', width: '120px', render: (val) => <span>{val ? `${val} phút` : 'N/A'}</span> },
    { title: 'Người tạo', dataIndex: 'creatorName', key: 'creatorName', width: '180px' },
  ];

  if (!classData) {
    return (
      <div className="class-detail-not-found">
        <p>Không tìm thấy thông tin lớp học. Dữ liệu có thể đã hết hạn.</p>
        <Button onClick={() => navigate('/teacher/students')}>Quay lại danh sách</Button>
      </div>
    );
  }

  return (
    <div className="class-detail-container">
      <div className="class-detail-header-wrap">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/teacher/students')} className="class-detail-back-btn" />
        <h2 className="class-detail-title">
          Chi tiết Lớp học: <span className="class-detail-title-highlight">{classData.name}</span>
        </h2>
      </div>

      <Card bordered={false} className="class-detail-summary-card">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={8}>
            <div className="class-detail-info-main">
              <span className="class-department-tag">{classData.departmentName || 'Chung'}</span>
              <div style={{ marginTop: 12 }}>
                 {classData.isActive !== false ? <Tag color="success" icon={<CheckCircleOutlined />}>Đang hoạt động</Tag> : <Tag color="error" icon={<StopOutlined />}>Đã vô hiệu</Tag>}
              </div>
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }} />
                <div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>Giảng viên phụ trách</div>
                  <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 15 }}>{classData.teacherName || 'Chưa phân công'}</div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={16}>
             <Row gutter={[24, 24]}>
                <Col span={8}>
                   <Statistic title="Học viên" value={students.length} prefix={<TeamOutlined style={{color: '#3b82f6'}} />} valueStyle={{ fontWeight: 700 }} />
                </Col>
                <Col span={8}>
                   <Statistic title="Bài thi" value={classExams.length} prefix={<ProfileOutlined style={{color: '#f59e0b'}} />} valueStyle={{ fontWeight: 700 }} />
                </Col>
                <Col span={8}>
                   <Statistic title="Ngày tạo" value={classData.createDate ? dayjs(classData.createDate).format('DD/MM/YYYY') : 'N/A'} prefix={<CalendarOutlined style={{color: '#10b981'}} />} valueStyle={{ fontSize: 20, fontWeight: 700 }} />
                </Col>
             </Row>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} className="class-detail-tabs-card">
        <Tabs 
          defaultActiveKey="1" 
          items={[
            {
              key: '1',
              label: <span><TeamOutlined />Danh sách học viên</span>,
              children: (
                  <Table 
                    dataSource={students} 
                    columns={columns} 
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 6, showSizeChanger: false, showTotal: (total) => `Tổng số ${total} học viên` }}
                  />
              )
            },
            {
              key: '2',
              label: <span><ProfileOutlined />Danh sách bài thi</span>,
              children: (
                <Table 
                  dataSource={classExams} 
                  columns={examColumns} 
                  loading={loadingExams}
                  pagination={{ pageSize: 6 }}
                  rowKey={(record, idx) => record.id || idx}
                  locale={{ emptyText: 'Chưa có bài thi nào được phân công' }}
                />
              )
            },
            {
              key: '3',
              label: <span><LineChartOutlined />Lịch sử điểm</span>,
              children: (
                <Table 
                  dataSource={classScores} 
                  columns={scoreColumns} 
                  loading={loadingScores}
                  pagination={{ pageSize: 6 }}
                  rowKey={(record, idx) => record.examResultId || idx}
                  locale={{ emptyText: 'Chưa có bài thi nào được thực hiện' }}
                />
              )
            }
          ]}
        />
      </Card>

      {/* Modal Lịch sử bài thi học viên */}
      <Modal
        title={
          <div className="history-modal-header">
            <HistoryOutlined className="history-modal-icon" />
            <span>Lịch sử bài thi: <span className="student-name-highlight">{selectedStudent?.name}</span></span>
          </div>
        }
        open={isHistoryModalOpen}
        onCancel={() => setIsHistoryModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsHistoryModalOpen(false)} className="btn-modal-close">
            Đóng
          </Button>
        ]}
        width={900}
        className="student-history-modal"
      >
        <div className="history-modal-content">
          <Table 
            dataSource={studentHistory} 
            columns={[
              { title: 'Bài kiểm tra', dataIndex: 'examTitle', key: 'examTitle', render: (val) => <strong>{val}</strong> },
              { 
                title: 'Điểm số', 
                dataIndex: 'score', 
                key: 'score', 
                render: (val) => <Tag color={val >= 5 ? "success" : "error"} className="history-score-tag">{val}</Tag> 
              },
              { 
                title: 'Thời gian nộp', 
                dataIndex: 'startTime', 
                key: 'startTime', 
                render: (val) => val ? dayjs(val).format('DD/MM/YYYY HH:mm') : 'N/A' 
              },
              { 
                title: 'Trạng thái', 
                key: 'status', 
                render: (_, rec) => <Tag color="blue">Đã hoàn thành</Tag> 
              }
            ]} 
            loading={loadingHistory}
            pagination={{ pageSize: 6 }}
            rowKey={(record, idx) => record.examResultId || idx}
            locale={{ emptyText: 'Học viên này chưa có kết quả thi nào' }}
          />
        </div>
      </Modal>
    </div>
  );
}
