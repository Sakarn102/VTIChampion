// React imports
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createExam } from '../../api/examService';
import classApi from '../../api/classApi';
import userApi from '../../api/userApi';
import questionApi from '../../api/questionApi';
import { message, Modal, Checkbox, Space, Tag } from 'antd';
import * as XLSX from 'xlsx';

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
  const [type, setType] = useState('Test');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [maxAttempts, setMaxAttempts] = useState(1);
  
  // Excel import states
  const [importedQuestions, setImportedQuestions] = useState([]);
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [originalFileName, setOriginalFileName] = useState('');
  const [originalFileObj, setOriginalFileObj] = useState(null);
  const [originalQuestionsCount, setOriginalQuestionsCount] = useState(0);
  
  const fileInputRef = useRef(null);

  // Data states
  const [classes, setClasses] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // States for search and filter in Question Bank Modal
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoading(true);
        const currentUserId = user?.id || user?.userId;
        
        // Gọi song song cả Profile, Lớp học và Ngân hàng đề để tăng tốc độ
        const [userRes, classesRes, questionsRes] = await Promise.all([
          userApi.getProfile(),
          classApi.getAll({ teacher_id: currentUserId }),
          questionApi.getMyQuestions({ size: 1000 })
        ]);

        const profile = userRes.data || userRes;
        const classesData = classesRes.data || classesRes;
        const questionsData = questionsRes.data || questionsRes;

        let filteredClasses = Array.isArray(classesData) ? classesData : (classesData?.content || []);
        
        // Lọc theo tên giáo viên để đảm bảo tính chính xác nhất
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
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleCreate = async () => {
    if (!title || !code || !classId || (selectedQuestionIds.length === 0 && importedQuestions.length === 0)) {
      message.warning("Vui lòng điền đầy đủ thông tin và chọn ít nhất 1 câu hỏi (từ ngân hàng hoặc file Excel)!");
      return;
    }

    const payload = {
      title,
      code,
      duration: parseInt(duration),
      classId: parseInt(classId),
      creatorId: user?.id || user?.userId,
      type: type,
      maxAttempts: parseInt(maxAttempts) || 1,
      questionIds: selectedQuestionIds
    };

    try {
      setIsLoading(true);
      const res = await createExam(payload);
      const newExamId = res.data?.examId || res.examId;

      // Nếu có câu hỏi từ Excel
      let fileToUpload = null;
      if (importedQuestions.length > 0) {
          // Bắt nguyên bản nếu chưa xóa câu nào, để an toàn với POI Java
          if (originalFileObj && importedQuestions.length === originalQuestionsCount) {
               fileToUpload = originalFileObj;
          } else {
               const aoa = [excelHeaders];
               importedQuestions.forEach(q => {
                   aoa.push(q.rawData);
               });
               
               const ws = XLSX.utils.aoa_to_sheet(aoa);
               const wb = XLSX.utils.book_new();
               XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
               
               const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
               const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
               fileToUpload = new File([blob], originalFileName || 'imported_questions.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          }
      }

      if (fileToUpload && newExamId) {
        try {
            message.loading({ content: 'Đang import câu hỏi từ Excel...', key: 'importing' });
            const importRes = await questionApi.importQuestions(fileToUpload, newExamId);
            const importData = importRes.data || importRes;
            if (importData.success === 0) {
                 message.error({ content: `Tuy bài thi được tạo nhưng việc Import thất bại toàn bộ ${importData.total} câu! Lỗi: ${importData.errors?.[0] || ''}`, key: 'importing' });
            } else if (importData.failed > 0) {
                 message.warning({ content: `Đã nhập ${importData.success} câu. Thất bại ${importData.failed} câu từ file.`, key: 'importing' });
            } else {
                 message.success({ content: `Đã import thành công thêm ${importData.success} câu hỏi từ file Excel!`, key: 'importing' });
            }
        } catch (importErr) {
            console.error("Lỗi khi import excel trong create:", importErr);
            message.error({ content: 'Không thể xử lý file Excel đã chọn!', key: 'importing' });
        }
      } else {
        message.success("Tạo đề thi mới thành công!");
      }

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

  const removeImportedQuestion = (id) => {
    setImportedQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFileName(file.name);
      setOriginalFileObj(file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
            const arrayBuffer = evt.target.result;
            const wb = XLSX.read(arrayBuffer, { type: 'array' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
            
            if (data.length > 0) {
                setExcelHeaders(data[0]); 
                
                const parsedQs = [];
                for (let i = 1; i < data.length; i++) {
                    const row = data[i];
                    if (row.length === 0 || row.every(cell => !cell || String(cell).trim() === '')) {
                       continue;
                    }
                    
                    let contentPreview = row.find(cell => typeof cell === 'string' && cell.trim().length > 5);
                    contentPreview = contentPreview ? contentPreview.substring(0, 40) : `Câu hỏi từ file (dòng ${i+1})`;

                    parsedQs.push({
                       id: `excel_${i}_${Date.now()}`,
                       content: contentPreview,
                       rawData: row
                    });
                }
                
                // Mặc định cho phép thêm tiếp câu hỏi, không đè lên câu hỏi cũ nếu import nhiều lần
                // hoặc reset nếu muốn. Ở đây ta nối thêm (hoặc ghi đè). Đặt ghi đè cho giống hành vi ban đầu
                setImportedQuestions(parsedQs);
                setOriginalQuestionsCount(parsedQs.length);
                message.success(`Đã đọc ${parsedQs.length} câu hỏi từ file Excel.`);
            } else {
                message.error("File Excel trống hoặc không có dữ liệu hợp lệ!");
            }
        } catch(err) {
            console.error(err);
            message.error("Đã xảy ra lỗi khi đọc file Excel!");
        }
      };
      reader.readAsArrayBuffer(file);
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Logic to filter questionBank on frontend
  const filteredQuestions = questionBank.filter(q => {
      const matchSearch = q.content?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDifficulty = difficultyFilter === 'ALL' || q.difficultyLevel === difficultyFilter;
      return matchSearch && matchDifficulty;
  });

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
              <div style={{ position: 'relative' }}>
                <select 
                  className="create-form-select"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  disabled={isDataLoading}
                >
                  <option value="">{isDataLoading ? '-- Đang tải danh sách... --' : '-- Chọn lớp học --'}</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {isDataLoading && (
                  <div style={{ position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg className="spin-slow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                    </svg>
                  </div>
                )}
              </div>
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
            <div>
              <label className="form-label">Loại bài thi <span className="required-star">*</span></label>
              <select 
                className="create-form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Test">Đề thi (Test)</option>
                <option value="Practice">Luyện tập (Practice)</option>
              </select>
            </div>
            <div>
              <label className="form-label">Số lượt làm bài <span className="required-star">*</span></label>
              <input 
                type="number" 
                min="1"
                max="100"
                placeholder="1" 
                className="form-input" 
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(e.target.value)}
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
                <p style={{ fontSize: '11px', color: 'var(--gray-400)', fontWeight: '600' }}>Chọn câu hỏi từ ngân hàng hoặc tải lên từ Excel</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-excel-template" onClick={async () => {
                    const blob = await questionApi.downloadTemplate();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'Template_Question.xlsx');
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Tải Template
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept=".xlsx,.xls" 
                    onChange={handleFileUpload}
                />
                 <button className="btn-excel-upload" onClick={() => fileInputRef.current?.click()} style={importedQuestions.length > 0 ? { background: '#047857', boxShadow: '0 4px 12px rgba(4, 120, 87, 0.3)' } : {}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> 
                    {importedQuestions.length > 0 ? `Đã nhập: ${importedQuestions.length} câu` : 'Upload Excel'}
                 </button>
                <button className="btn-primary-mini" onClick={() => setIsQuestionBankModalOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Từ ngân hàng
                </button>
            </div>
          </div>

          <div id="question-list" style={{ minHeight: '50px' }}>
            {isDataLoading ? (
               <div style={{ textAlign: 'center', padding: '30px', border: '1px dashed #ddd', borderRadius: '8px', color: '#6366f1' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <svg className="spin-slow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
                    <span>Đang tải dữ liệu ngân hàng đề...</span>
                  </div>
               </div>
            ) : selectedQuestionIds.length === 0 && importedQuestions.length === 0 ? (
              <div className="no-questions-placeholder" style={{ textAlign: 'center', padding: '30px', border: '1px dashed #ddd', borderRadius: '8px', color: '#999' }}>
                Chưa có câu hỏi nào được chọn. Nhấn nút "Từ ngân hàng" hoặc "Upload Excel" để lấy câu hỏi.
              </div>
            ) : (
              <div className="selected-questions-summary">
                 <p style={{ fontWeight: '600', marginBottom: '15px', color: '#111827' }}>
                   Danh tổng cộng: {selectedQuestionIds.length + importedQuestions.length} câu hỏi
                 </p>
                 
                 {selectedQuestionIds.length > 0 && (
                   <div style={{ marginBottom: '15px' }}>
                     <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Từ ngân hàng đề ({selectedQuestionIds.length} câu):</div>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedQuestionIds.map(id => {
                          const q = questionBank.find(item => (item.id === id || item.questionId === id));
                          return <Tag color="blue" key={id} closable onClose={() => toggleQuestion(id)}>{q?.content?.substring(0, 50)}...</Tag>
                        })}
                     </div>
                   </div>
                 )}
                 
                 {importedQuestions.length > 0 && (
                   <div>
                     <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Từ {originalFileName} ({importedQuestions.length} câu):</div>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {importedQuestions.map(q => (
                          <Tag color="green" key={q.id} closable onClose={() => removeImportedQuestion(q.id)}>
                             [Excel] {q.content}...
                          </Tag>
                        ))}
                     </div>
                   </div>
                 )}
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
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: '30px' }}>
             <span>Chọn câu hỏi từ ngân hàng đề</span>
             <div style={{ display: 'flex', gap: '10px' }}>
                 <input 
                    type="text" 
                    placeholder="Tìm kiếm nội dung..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                        fontSize: '13px', 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid #d1d5db',
                        outline: 'none',
                        width: '200px'
                    }}
                 />
                 <select 
                    value={difficultyFilter} 
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    style={{ 
                        fontSize: '13px', 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid #d1d5db',
                        outline: 'none'
                    }}
                 >
                     <option value="ALL">Mọi mức độ</option>
                     <option value="EASY">Dễ</option>
                     <option value="MEDIUM">Trung bình</option>
                     <option value="HARD">Khó</option>
                 </select>
             </div>
          </div>
        }
        open={isQuestionBankModalOpen}
        onOk={() => setIsQuestionBankModalOpen(false)}
        onCancel={() => setIsQuestionBankModalOpen(false)}
        width={850}
        bodyStyle={{ maxHeight: '500px', overflowY: 'auto', padding: '10px 0' }}
      >
        <div className="question-selection-list">
          {isDataLoading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#6366f1' }}>
                <svg className="spin-slow" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginBottom: '12px' }}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
                <div style={{ fontWeight: 600 }}>Đang đồng bộ dữ liệu ngân hàng đề...</div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
               Không tìm thấy câu hỏi nào phù hợp với bộ lọc.
            </div>
          ) : (
            filteredQuestions.map(q => (
              <div key={q.id || q.questionId} style={{ 
                  padding: '16px 24px', 
                  borderBottom: '1px solid #f3f4f6', 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '16px',
                  transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ paddingTop: '4px' }}>
                    <Checkbox 
                    checked={selectedQuestionIds.includes(q.id || q.questionId)} 
                    onChange={() => toggleQuestion(q.id || q.questionId)}
                    />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', color: '#111827', fontSize: '14px', lineHeight: '1.5', marginBottom: '6px' }}>{q.content}</div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Tag color={q.difficultyLevel === 'EASY' ? 'green' : q.difficultyLevel === 'MEDIUM' ? 'orange' : 'red'}>
                        {q.difficultyLevel}
                    </Tag>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{q.answers?.length || 0} đáp án</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </>
  );
}
