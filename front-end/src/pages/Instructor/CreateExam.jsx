import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createExam } from '../../api/examService';
import classApi from '../../api/classApi';
import userApi from '../../api/userApi';
import questionApi from '../../api/questionApi';
import { message, Modal, Checkbox, Space, Tag } from 'antd';

import '../../styles/CreateExam.css';
import '../../styles/EditExam.css';
import '../../styles/Home.css';

export default function CreateExam() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form states
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [duration, setDuration] = useState(60);
  const [classId, setClassId] = useState('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  // Data states
  const [classes, setClasses] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy profile để xác định danh tính giáo viên
        const userRes = await userApi.getProfile();
        const profile = userRes.data || userRes;
        const teacherId = profile?.id || profile?.userId;

        const [classesData, questionsData] = await Promise.all([
          classApi.getAll({ teacher_id: teacherId }),
          questionApi.getMyQuestions({ size: 1000 })
        ]);

        let filteredClasses = Array.isArray(classesData) ? classesData : (classesData?.content || []);
        
        // Lọc theo tên giáo viên để đảm bảo tính chính xác
        if (profile?.fullname) {
          filteredClasses = filteredClasses.filter(cls => 
            cls.teacherName && cls.teacherName.toLowerCase() === profile.fullname.toLowerCase()
          );
        }

        setClasses(filteredClasses);
        setQuestionBank(questionsData?.content || (Array.isArray(questionsData) ? questionsData : []));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        message.error("Không thể tải danh sách lớp học hoặc ngân hàng đề.");
      }
    };
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!title || !code || !classId || selectedQuestionIds.length === 0) {
      message.warning("Vui lòng điền đầy đủ thông tin và chọn ít nhất 1 câu hỏi!");
      return;
    }

    const payload = {
      title,
      code,
      duration: parseInt(duration),
      classId: parseInt(classId),
      creatorId: user?.id || user?.userId,
      questionIds: selectedQuestionIds
    };

    try {
      setIsLoading(true);
      await createExam(payload);
      message.success("Tạo đề thi mới thành công!");
      navigate('/teacher/exams');
    } catch (error) {
      console.error("Lỗi tạo đề thi:", error);
      message.error(typeof error === 'string' ? error : "Có lỗi xảy ra khi tạo đề thi.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestion = (id) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  return (
    <>
    <div className="create-exam-container" style={{ padding: 0 }}>
      <div className="home-content" style={{ maxWidth: '860px', padding: 0 }}>

        {/* Breadcrumb */}
        <div className="breadcrumb" style={{ marginTop: 0 }}>
          <a onClick={() => navigate('/teacher/exams')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1" ry="1"/>
            </svg> Danh sách bài thi
          </a>
          <span>›</span>
          <span className="active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg> Tạo bài thi mới
          </span>
        </div>

        {/* Page title */}
        <div className="create-exam-header-meta">
          <h2 className="create-exam-title">Tạo bài thi mới</h2>
          <p className="create-exam-subtitle">Điền đầy đủ thông tin bên dưới để tạo bài thi cho học viên</p>
        </div>

        {/* FORM CARD: Basic Info */}
        <div className="form-card">
          <div className="card-header">
            <div className="card-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
            <div>
              <h3 className="card-title">Thông tin cơ bản</h3>
              <p style={{ fontSize: '11px', color: 'var(--gray-400)', fontWeight: '600' }}>Tiêu đề, mã đề và lớp học áp dụng</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tiêu đề bài thi <span className="required-star">*</span></label>
            <input 
              type="text" 
              placeholder="VD: Kiểm tra giữa kỳ Java" 
              className="form-input" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-grid">
            <div>
              <label className="form-label">Mã bài thi <span className="required-star">*</span></label>
              <input 
                type="text" 
                placeholder="VD: JAVA_MID_01" 
                className="form-input" 
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label className="form-label">Lớp học <span className="required-star">*</span></label>
              <select 
                className="create-form-select"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              >
                <option value="">-- Chọn lớp học --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Thời gian làm bài (phút) <span className="required-star">*</span></label>
              <input 
                type="number" 
                placeholder="60" 
                className="form-input" 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* FORM CARD: Questions */}
        <div className="form-card">
          <div className="card-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="card-icon" style={{ background: '#dcfce7' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
              <div>
                <h3 className="card-title">Danh sách câu hỏi</h3>
                <p style={{ fontSize: '11px', color: 'var(--gray-400)', fontWeight: '600' }}>Chọn câu hỏi từ ngân hàng đề của bạn</p>
              </div>
            </div>
            <button className="btn-primary-mini" onClick={() => setIsQuestionBankModalOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Chọn từ ngân hàng
            </button>
          </div>

          <div id="question-list" style={{ minHeight: '50px' }}>
            {selectedQuestionIds.length === 0 ? (
              <div className="no-questions-placeholder" style={{ textAlign: 'center', padding: '30px', border: '1px dashed #ddd', borderRadius: '8px', color: '#999' }}>
                Chưa có câu hỏi nào được chọn. Nhấn nút "Chọn từ ngân hàng" để chọn.
              </div>
            ) : (
              <div className="selected-questions-summary">
                 <p style={{ fontWeight: '600', marginBottom: '10px' }}>Đã chọn {selectedQuestionIds.length} câu hỏi:</p>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedQuestionIds.map(id => {
                      const q = questionBank.find(item => (item.id === id || item.questionId === id));
                      return <Tag color="blue" key={id} closable onClose={() => toggleQuestion(id)}>{q?.content?.substring(0, 30)}...</Tag>
                    })}
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="action-bar">
          <button onClick={() => navigate('/teacher/exams')} className="btn-cancel">
            ← Hủy
          </button>
          <button 
            onClick={handleCreate} 
            className="btn-save" 
            style={{ padding: '13px 28px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Đang tạo...' : 'Tạo bài thi ngay'}
          </button>
        </div>

      </div>
    </div>

      <div className="exam-save-actions" />
      
      {/* Question Selection Modal */}
      <Modal
        title="Chọn câu hỏi từ ngân hàng đề"
        open={isQuestionBankModalOpen}
        onOk={() => setIsQuestionBankModalOpen(false)}
        onCancel={() => setIsQuestionBankModalOpen(false)}
        width={800}
        bodyStyle={{ maxHeight: '500px', overflowY: 'auto' }}
      >
        <div className="question-selection-list">
          {questionBank.length === 0 ? (
            <p>Bạn không có câu hỏi nào trong ngân hàng đề. Hãy tạo câu hỏi trước.</p>
          ) : (
            questionBank.map(q => (
              <div key={q.id || q.questionId} style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Checkbox 
                  checked={selectedQuestionIds.includes(q.id || q.questionId)} 
                  onChange={() => toggleQuestion(q.id || q.questionId)}
                />
                <div>
                  <div style={{ fontWeight: '600' }}>{q.content}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>Mức độ: {q.difficultyLevel} | Đáp án: {q.answers?.length || 0}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </>
  );
}
