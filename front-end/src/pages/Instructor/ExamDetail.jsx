import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllExams } from '../../api/examService';
import resultApi from '../../api/resultApi';
import { Modal, Form, Input, InputNumber, Select, message, Button } from 'antd';
import axiosClient from '../../api/axiosClient';
import classApi from '../../api/classApi';

import '../../styles/ExamDetail.css';
import '../../styles/EditExam.css';
import '../../styles/Home.css';

const { Option } = Select;

export default function ExamDetail() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [results, setResults] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchExamAndResults = async () => {
      try {
        setLoading(true);
        const [examsData, resultsData, classesData] = await Promise.all([
          getAllExams({ size: 1000 }), // Workaround to find current exam
          resultApi.getResultsByExam(examId),
          classApi.getAll()
        ]);
        console.log("Dữ liệu Lớp học nhận được:", classesData);

        const allExams = examsData.content || [];
        const foundExam = allExams.find(e => (String(e.examId) === String(examId) || String(e.id) === String(examId)));
        
        // Defensive check: ensure classes is always an array
        setClasses(Array.isArray(classesData) ? classesData : (classesData?.content || []));
        setExam(foundExam || null);
        setResults(resultsData || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (examId) {
      fetchExamAndResults();
    }
  }, [examId]);

  const handleEditOpen = () => {
    if (exam) {
      form.setFieldsValue({
        title: exam.title,
        code: exam.code,
        duration: exam.duration,
        classId: exam.classId
      });
      setIsEditModalOpen(true);
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      setUpdating(true);
      // Gửi yêu cầu update - Backend yêu cầu list questionIds nên lấy từ exam hiện tại
      const questionIds = exam.questions?.map(q => q.id || q.questionId) || [];
      
      const payload = {
        ...values,
        questionIds: questionIds
      };
      console.log("Dữ liệu gửi lên Update Exam:", payload);

      await axiosClient.put(`/exams/${examId}`, payload);
      message.success("Cập nhật bài thi thành công!");
      setIsEditModalOpen(false);
      
      // Refresh dữ liệu trang
      setExam(prev => ({...prev, ...values, className: classes.find(c => c.id === values.classId)?.name || prev.className }));
    } catch (error) {
      message.error("Lỗi khi cập nhật bài thi!");
    } finally {
      setUpdating(false);
    }
  };

  // Derived stats from results
  const totalAttempts = results.length;
  const averageScore = totalAttempts > 0 
    ? (results.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0) / totalAttempts).toFixed(1)
    : "0.0";
  const passCount = results.filter(r => (Number(r.score) || 0) >= 5.0).length;
  const passRate = totalAttempts > 0 
    ? Math.round((passCount / totalAttempts) * 100) + "%"
    : "0%";

  return (
    <>
      
    <div className="exam-detail-container" style={{ padding: 0 }}>
      {/* Page content */}
      <div className="home-content" style={{ maxWidth: '960px', padding: 0 }}>
        {loading ? (
          <div className="table-loading">Đang tải dữ liệu...</div>
        ) : !exam ? (
          <div className="table-loading" style={{ color: 'red' }}>
            Không tìm thấy bài thi.
            <button onClick={() => navigate('/teacher/exams')} className="btn-primary-mini" style={{ display: 'block', margin: '20px auto', padding: '10px 20px' }}>Quay lại danh sách</button>
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            <div className="breadcrumb" style={{ marginTop: 0 }}>
              <a onClick={() => navigate('/teacher/exams')} href="javascript:void(0)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
                </svg> 
                Danh sách bài thi
              </a>
              <span>›</span>
              <span className="active">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg> 
                Chi tiết bài thi
              </span>
            </div>

      {/*  Header card  */}
      <div className="exam-detail-header">
        <div className="header-blur-cir-1"></div>
        <div className="header-blur-cir-2"></div>
        <div className="header-content-rel">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span className="code-badge-rel">{exam.code}</span>
              <span className="active-badge-rel">● Đang hoạt động</span>
            </div>
            <h2 className="header-title-white">{exam.title}</h2>
            <p className="header-desc-white">Mã bài thi: {exam.code} | Lớp: {exam.className || "N/A"} | Người tạo: {exam.creatorName || "N/A"}</p>
            <div className="quick-stats-row">
              <div className="quick-stat-item"><span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>{exam.duration} phút</div>
              <div className="quick-stat-item"><span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>{exam.questions?.length || 0} câu hỏi</div>
              <div className="quick-stat-item"><span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span>Đạt: {passRate}</div>
              <div className="quick-stat-item"><span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>Tạo: {exam.createDate ? new Date(exam.createDate).toLocaleDateString() : "N/A"}</div>
            </div>
          </div>
          <div className="header-action-group">
            <button onClick={handleEditOpen} className="btn-glass"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Chỉnh sửa</button>
            <button onClick={() => console.log('Action triggered')} className="btn-danger-glass"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> Vô hiệu</button>
          </div>
        </div>
      </div>

      {/*  Stats row  */}
      <div className="stats-grid-4">
        <div className="stat-box-flat">
          <div className="stat-val-blue">{totalAttempts}</div>
          <div className="stat-lbl-mini">Tổng lượt làm</div>
        </div>
        <div className="stat-box-flat">
          <div className="stat-val-green">{averageScore}</div>
          <div className="stat-lbl-mini">Điểm trung bình</div>
        </div>
        <div className="stat-box-flat">
          <div className="stat-val-yellow">{passRate}</div>
          <div className="stat-lbl-mini">Tỷ lệ đạt</div>
        </div>
        <div className="stat-box-flat">
          <div className="stat-val-purple">{exam.questions?.length || 0}</div>
          <div className="stat-lbl-mini">Số câu hỏi</div>
        </div>
      </div>

      {/*  Two columns  */}
      <div className="detail-layout">

        {/*  Question list preview  */}
        <div className="detail-card">
          <div className="detail-card-header">
            <h3 className="card-title" style={{ margin: 0 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Danh sách câu hỏi ({exam.questions?.length || 0})</h3>
            <span 
              onClick={() => navigate(`/teacher/exams/${examId}/questions`)}
              style={{ fontSize: '12px', color: 'var(--blue-500)', fontWeight: '700', cursor: 'pointer' }}
            >
                Xem tất cả →
            </span>
          </div>
          <div style={{ padding: '4px 0' }}>
            {/*  Q rows  */}
            {exam.questions && exam.questions.length > 0 ? (
                <>
                {exam.questions.slice(0, 5).map((q, idx) => {
                    const ansLetterIdx = q.answers?.findIndex(a => a.isCorrect);
                    const ansLetter = ansLetterIdx >= 0 ? String.fromCharCode(65 + ansLetterIdx) : "?";
                    return (
                        <div className="question-preview-row" key={q.questionId || idx}>
                           <span className="q-number-box">{idx + 1}</span>
                           <div className="q-text-preview" dangerouslySetInnerHTML={{ __html: q.content }}></div>
                           <span className="q-ans-badge">{ansLetter}</span>
                        </div>
                    );
                })}
                {exam.questions.length > 5 && (
                    <div style={{ padding: '12px 20px', textAlign: 'center', color: 'var(--blue-400)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                        + {exam.questions.length - 5} câu hỏi nữa...
                    </div>
                )}
                </>
            ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Chưa có câu hỏi cho bài thi này.</div>
            )}
          </div>
        </div>

        {/*  Right column: settings + recent attempts  */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/*  Settings  */}
          <div className="form-card" style={{ padding: '18px 20px' }}>
            <h3 className="card-title" style={{ marginBottom: '14px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Cài đặt</h3>
            <div className="settings-list">
              <div className="setting-item-row">
                <span className="setting-lbl"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg> Xáo trộn câu hỏi</span>
                <span className="status-capsule">Bật</span>
              </div>
              <div className="setting-item-row">
                <span className="setting-lbl"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Xem điểm ngay</span>
                <span className="status-capsule">Bật</span>
              </div>
              <div className="setting-item-row">
                <span className="setting-lbl"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Làm nhiều lần</span>
                <span className="status-capsule" style={{ background: '#fee2e2', color: '#dc2626' }}>Tắt</span>
              </div>
              <div className="setting-item-row">
                <span className="setting-lbl"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><polyline points="20 6 9 17 4 12"/></svg> Xem đáp án</span>
                <span className="status-capsule">Bật</span>
              </div>
            </div>
          </div>

          {/*  Recent attempts  */}
          <div className="form-card" style={{ padding: '18px 20px', flex: '1' }}>
            <h3 className="card-title" style={{ marginBottom: '14px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon" ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Kết quả gần đây</h3>
            <div className="settings-list">
              {results && results.length > 0 ? (
                  results.slice(0, 5).map((r, idx) => (
                    <div className="attempt-row" key={r.examResultId || idx}>
                        <div className="attempt-avatar" style={{ background: 'linear-gradient(135deg,#3b82f6,#60a5fa)' }}>{r.studentName?.charAt(0) || "U"}</div>
                        <div style={{ flex: '1' }}><div className="attempt-name">{r.studentName}</div><div className="attempt-meta">{r.endTime ? new Date(r.endTime).toLocaleDateString() : "N/A"} • {Math.round((new Date(r.endTime) - new Date(r.startTime)) / 60000)} phút</div></div>
                        <span className="score-badge" style={{ 
                            background: r.score >= 5 ? '#dcfce7' : '#fee2e2', 
                            color: r.score >= 5 ? '#16a34a' : '#dc2626' 
                        }}>{r.score}</span>
                    </div>
                  ))
              ) : (
                <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748b' }}>Chưa có lượt thi nào.</div>
              )}
            </div>
          </div>
        </div>
      </div>


    </>
      )}
      </div>

      {/* Edit Modal */}
      <Modal
        title={<span style={{ fontWeight: 800, fontSize: '20px' }}>Chỉnh sửa thông tin bài thi</span>}
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={600}
        className="modern-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          style={{ marginTop: '20px' }}
        >
          <Form.Item label="Tiêu đề bài thi" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
            <Input size="large" />
          </Form.Item>
          
          <Form.Item label="Mã bài thi (CODE)" name="code" rules={[{ required: true, message: 'Vui lòng nhập mã bài thi' }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item label="Thời gian (phút)" name="duration" rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}>
            <InputNumber size="large" min={1} max={500} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Lớp học" name="classId" rules={[{ required: true, message: 'Vui lòng chọn lớp học' }]}>
            <Select size="large" placeholder="Chọn lớp học">
              {classes.map(c => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <Button onClick={() => setIsEditModalOpen(false)} size="large" className="btn-cancel">Hủy</Button>
            <Button type="primary" htmlType="submit" size="large" loading={updating} className="btn-save">
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
    </>
  );
}
