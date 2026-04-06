import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getExamById } from '../../api/examService';
import questionApi from '../../api/questionApi';
import { message, Modal, Tag, Checkbox } from 'antd';
import * as XLSX from 'xlsx';
import '../../styles/ExamDetail.css';
import '../../styles/EditExam.css';
import '../../styles/Home.css';
import '../../styles/CreateExam.css';

export default function ExamQuestions() {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalType, setModalType] = useState(null); // 'add' | 'edit'
    const [currentQ, setCurrentQ] = useState(null);
    const [saving, setSaving] = useState(false);
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState('');

    // Excel import states (Review)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importedQuestions, setImportedQuestions] = useState([]);
    const [excelHeaders, setExcelHeaders] = useState([]);
    const [originalFileName, setOriginalFileName] = useState('');
    const [originalFileObj, setOriginalFileObj] = useState(null);
    const [originalCount, setOriginalCount] = useState(0);

    const [form, setForm] = useState({
        content: '',
        difficultyLevel: 'EASY',
        explanation: 'N/A',
        answers: [
            { content: '', isCorrect: true },
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
        ]
    });

    // ── Fetch exam data ──────────────────────────────────
    useEffect(() => {
        const fetchExamData = async () => {
            try {
                setLoading(true);
                const data = await getExamById(examId);
                const found = data?.data || data;
                if (found) {
                    setExam(found);
                    setQuestions(found.questions || []);
                } else {
                    setExam(null);
                }
            } catch (err) {
                console.error('Lỗi tải dữ liệu bài thi:', err);
            } finally {
                setLoading(false);
            }
        };
        if (examId) fetchExamData();
    }, [examId]);

    // ── Helpers ──────────────────────────────────────────
    const getQId = (q) => q?.questionId || q?.id;

    const openAdd = () => {
        setCurrentQ(null);
        setErrorMsg('');
        setForm({
            content: '',
            difficultyLevel: 'EASY',
            explanation: 'N/A',
            answers: [
                { content: '', isCorrect: true },
                { content: '', isCorrect: false },
                { content: '', isCorrect: false },
                { content: '', isCorrect: false },
            ]
        });
        setModalType('add');
    };

    const openEdit = (q) => {
        setCurrentQ(q);
        setErrorMsg('');
        setForm({
            content: q.content || '',
            difficultyLevel: q.difficultyLevel || 'EASY',
            explanation: q.explanation || 'N/A',
            answers: (q.answers && q.answers.length > 0)
                ? q.answers.map(a => ({ content: a.content || '', isCorrect: !!a.isCorrect }))
                : [
                    { content: '', isCorrect: true },
                    { content: '', isCorrect: false },
                    { content: '', isCorrect: false },
                    { content: '', isCorrect: false },
                ]
        });
        setModalType('edit');
    };

    const closeModal = () => {
        setModalType(null);
        setCurrentQ(null);
        setErrorMsg('');
    };

    const setCorrect = (idx) => {
        setForm(prev => ({
            ...prev,
            answers: prev.answers.map((a, i) => ({ ...a, isCorrect: i === idx }))
        }));
    };

    const setAnswerContent = (idx, val) => {
        setForm(prev => {
            const updated = [...prev.answers];
            updated[idx] = { ...updated[idx], content: val };
            return { ...prev, answers: updated };
        });
    };

    const validate = () => {
        if (!form.content.trim()) return 'Vui lòng nhập nội dung câu hỏi.';
        if (!form.explanation.trim()) return 'Vui lòng nhập giải thích.';
        if (form.answers.some(a => !a.content.trim())) return 'Vui lòng nhập đầy đủ tất cả các đáp án.';
        if (!form.answers.some(a => a.isCorrect)) return 'Vui lòng chọn 1 đáp án đúng.';
        return null;
    };

    // ── Save Edit ────────────────────────────────────────
    const handleSaveEdit = async () => {
        const err = validate();
        if (err) { setErrorMsg(err); return; }
        setSaving(true);
        setErrorMsg('');
        try {
            const qId = getQId(currentQ);
            const payload = {
                content: form.content.trim(),
                difficultyLevel: form.difficultyLevel,
                explanation: form.explanation.trim() || 'N/A',
                answers: form.answers.map(a => ({ content: a.content.trim(), isCorrect: a.isCorrect }))
            };
            console.log('PUT question id=', qId, payload);
            const updated = await questionApi.updateQuestion(qId, payload);
            // Merge update vào danh sách local
            setQuestions(prev =>
                prev.map(q => (getQId(q) === qId
                    ? { ...q, content: payload.content, difficultyLevel: payload.difficultyLevel, explanation: payload.explanation, answers: updated?.answers || payload.answers }
                    : q))
            );
            message.success('Cập nhật câu hỏi thành công!');
            closeModal();
        } catch (e) {
            console.error('Update error:', e);
            setErrorMsg(typeof e === 'string' ? e : (e?.message || 'Lỗi cập nhật câu hỏi. Hãy kiểm tra quyền hạn giảng viên.'));
        } finally {
            setSaving(false);
        }
    };

    // ── Save Add ─────────────────────────────────────────
    const handleSaveAdd = async () => {
        const err = validate();
        if (err) {
            setErrorMsg(err);
            return;
        }
        setSaving(true);
        setErrorMsg('');
        try {
            const payload = {
                content: form.content.trim(),
                difficultyLevel: form.difficultyLevel,
                explanation: form.explanation.trim() || 'N/A',
                examId: Number(examId),
                answers: form.answers.map(a => ({
                    content: a.content.trim(),
                    isCorrect: a.isCorrect
                }))
            };
            const created = await questionApi.createQuestion(payload);
            if (created) {
                setQuestions(prev => [...prev, created]);
                message.success('Thêm câu hỏi mới thành công!');
            }
            closeModal();
        } catch (e) {
            console.error('Create error:', e);
            setErrorMsg(typeof e === 'string' ? e : (e?.message || 'Lỗi thêm câu hỏi mới.'));
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ───────────────────────────────────────────
    const handleDelete = async (q) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
        const qId = getQId(q);
        try {
            await questionApi.deleteQuestion(qId);
            setQuestions(prev => prev.filter(x => getQId(x) !== qId));
            message.success('Xóa câu hỏi thành công!');
        } catch (e) {
            alert('Xóa thất bại: ' + (typeof e === 'string' ? e : 'Kiểm tra quyền hạn giảng viên.'));
        }
    };

    // ── Import Excel ─────────────────────────────────────
    const handleDownloadTemplate = async () => {
        try {
            const response = await questionApi.downloadTemplate();
            const blob = new Blob([response.data || response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'question_template.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (e) {
            console.error('Lỗi tải template:', e);
            message.error('Không thể tải file template!');
        }
    };

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = null; 
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

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

                if (data.length > 1) {
                    setExcelHeaders(data[0]);
                    const parsedQs = [];
                    for (let i = 1; i < data.length; i++) {
                        const row = data[i];
                        if (row.length === 0 || row.every(cell => !cell || String(cell).trim() === '')) {
                            continue;
                        }

                        let contentPreview = row.find(cell => typeof cell === 'string' && cell.trim().length > 5);
                        contentPreview = contentPreview ? contentPreview.substring(0, 50) : `Câu hỏi dòng ${i + 1}`;

                        parsedQs.push({
                            tempId: `import_${i}_${Date.now()}`,
                            content: contentPreview,
                            rawData: row
                        });
                    }
                    setImportedQuestions(parsedQs);
                    setOriginalCount(parsedQs.length);
                    setIsImportModalOpen(true);
                } else {
                    message.error("File Excel trống hoặc không có dữ liệu!");
                }
            } catch (err) {
                console.error(err);
                message.error("Lỗi khi đọc file Excel!");
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const removeImportedQuestion = (tempId) => {
        setImportedQuestions(prev => prev.filter(q => q.tempId !== tempId));
    };

    const confirmImport = async () => {
        if (importedQuestions.length === 0) {
            message.warning("Không có câu hỏi nào để import!");
            return;
        }

        setImporting(true);
        const hideLoading = message.loading('Đang xử lý import tới hệ thống...', 0);
        
        try {
            let fileToUpload = null;
            if (originalFileObj && importedQuestions.length === originalCount) {
                fileToUpload = originalFileObj;
            } else {
                const aoa = [excelHeaders, ...importedQuestions.map(q => q.rawData)];
                const ws = XLSX.utils.aoa_to_sheet(aoa);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                fileToUpload = new File([blob], originalFileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            }

            const res = await questionApi.importQuestions(fileToUpload, examId);
            const data = res.data || res;
            
            hideLoading();
            if (data.success > 0) {
                message.success(`Thành công! Đã thêm ${data.success} câu hỏi vào bài thi.`);
                setIsImportModalOpen(false);
                
                // Refresh data faster by just fetching this exam
                const fetchExamData = async () => {
                    try {
                        const data = await getExamById(examId);
                        const found = data?.data || data;
                        if (found) {
                            setExam(found);
                            setQuestions(found.questions || []);
                        }
                    } catch (err) {
                        console.error("Lỗi refresh dữ liệu:", err);
                    }
                };
                fetchExamData();
            } else {
                message.error(`Import thất bại! ${data.errors?.[0] || ''}`);
            }
        } catch (error) {
            hideLoading();
            console.error('Import error:', error);
            message.error('Lỗi khi gửi dữ liệu lên server!');
        } finally {
            setImporting(false);
        }
    };

    // ── Render ────────────────────────────────────────────
    return (
        <div className="exam-detail-container" style={{ padding: 0 }}>
            <div className="home-content" style={{ maxWidth: '1000px', padding: '20px' }}>
                {loading ? (
                    <div className="table-loading">Đang tải dữ liệu...</div>
                ) : !exam ? (
                    <div className="table-loading" style={{ color: 'red' }}>
                        Không tìm thấy bài thi.
                        <button onClick={() => navigate('/teacher/exams')} className="btn-primary-mini"
                            style={{ display: 'block', margin: '16px auto' }}>Quay lại</button>
                    </div>
                ) : (
                    <>
                        {/* Breadcrumb */}
                        <div className="breadcrumb" style={{ marginTop: 0 }}>
                            <span onClick={() => navigate('/teacher/exams')} style={{ cursor: 'pointer', color: 'var(--blue-500)', fontWeight: 700 }}>Danh sách bài thi</span>
                            <span>›</span>
                            <span onClick={() => navigate('/teacher/exams/' + exam.examId)} style={{ cursor: 'pointer', color: 'var(--blue-500)', fontWeight: 700 }}>Chi tiết bài thi</span>
                            <span>›</span>
                            <span className="active">Quản lý câu hỏi</span>
                        </div>

                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                                    Câu hỏi: <span style={{ color: '#2563eb' }}>{exam.title}</span>
                                </h2>
                                <p style={{ color: '#64748b', fontSize: '13px' }}>Tổng số: <strong>{questions.length}</strong> câu hỏi</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    className="btn-secondary"
                                    onClick={handleDownloadTemplate}
                                    style={{ padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: '#f8fafc', color: '#475569', border: '1.5px solid #e2e8f0', cursor: 'pointer', fontWeight: '700' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                    Tải Template
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={handleImportClick}
                                    disabled={importing}
                                    style={{ padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: '#f0f9ff', color: '#0369a1', border: '1.5px solid #bae6fd', cursor: 'pointer', fontWeight: '700' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                    {importing ? 'Đang Import...' : 'Import Excel'}
                                </button>
                                <input 
                                    type="file" 
                                    accept=".xlsx, .xls" 
                                    ref={fileInputRef} 
                                    style={{ display: 'none' }} 
                                    onChange={handleFileChange} 
                                />
                                <button
                                    className="btn-primary-mini"
                                    onClick={openAdd}
                                    style={{ padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                    Thêm câu mới
                                </button>
                            </div>
                        </div>

                        {/* Question list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {questions.length === 0 ? (
                                <div className="table-loading">Chưa có câu hỏi nào. Hãy thêm câu hỏi mới!</div>
                            ) : questions.map((q, idx) => (
                                <div className="question-card-full" key={getQId(q) || idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <div className="q-badge-blue">Câu {idx + 1}</div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => openEdit(q)}
                                                style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
                                                Sửa
                                            </button>
                                            <button onClick={() => handleDelete(q)}
                                                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                    <div className="q-full-content" dangerouslySetInnerHTML={{ __html: q.content }} />
                                    <div className="q-options-grid">
                                        {q.answers?.map((ans, aIdx) => (
                                            <div className={`q-option-item ${ans.isCorrect ? 'correct' : ''}`} key={ans.answerId || aIdx}>
                                                <div className="q-radio-icon">
                                                    {ans.isCorrect && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>}
                                                </div>
                                                <div className="q-option-text">{ans.content}</div>
                                                {ans.isCorrect && <span className="badge-correct">Đúng</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ── Modal Add / Edit ─────────────────────────── */}
            {modalType && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {modalType === 'add' ? '➕ Thêm câu hỏi mới' : '✏️ Chỉnh sửa câu hỏi'}
                            </h3>
                            <button className="btn-close-modal" onClick={closeModal}>✕</button>
                        </div>

                        <div className="modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            {/* Error */}
                            {errorMsg && (
                                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
                                    ⚠️ {errorMsg}
                                </div>
                            )}

                            {/* Độ khó */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                                <div>
                                    <label className="form-label">Độ khó</label>
                                    <select
                                        className="form-input"
                                        value={form.difficultyLevel}
                                        onChange={e => setForm(prev => ({ ...prev, difficultyLevel: e.target.value }))}>
                                        <option value="EASY">Dễ (Easy)</option>
                                        <option value="MEDIUM">Trung bình (Medium)</option>
                                        <option value="HARD">Khó (Hard)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Nội dung */}
                            <div>
                                <label className="form-label">Nội dung câu hỏi *</label>
                                <textarea
                                    className="form-textarea"
                                    style={{ minHeight: '90px' }}
                                    placeholder="Nhập nội dung câu hỏi..."
                                    value={form.content}
                                    onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                                />
                            </div>

                            {/* Đáp án */}
                            <div>
                                <label className="form-label">Đáp án (chọn 1 đáp án đúng) *</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {form.answers.map((ans, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '10px 14px', borderRadius: '10px',
                                            border: ans.isCorrect ? '2px solid #86efac' : '1.5px solid #e2e8f0',
                                            background: ans.isCorrect ? '#f0fdf4' : '#f8fafc'
                                        }}>
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                checked={ans.isCorrect}
                                                onChange={() => setCorrect(idx)}
                                                style={{ width: '18px', height: '18px', accentColor: '#16a34a', cursor: 'pointer', flexShrink: 0 }}
                                            />
                                            <input
                                                type="text"
                                                className="form-input"
                                                style={{ flex: 1, border: 'none', background: 'transparent', padding: '0', fontWeight: 600 }}
                                                placeholder={`Đáp án ${idx + 1}...`}
                                                value={ans.content}
                                                onChange={e => setAnswerContent(idx, e.target.value)}
                                            />
                                            {ans.isCorrect && (
                                                <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '12px', whiteSpace: 'nowrap' }}>✓ Đúng</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Giải thích */}
                            <div>
                                <label className="form-label">Giải thích *</label>
                                <textarea
                                    className="form-textarea"
                                    style={{ minHeight: '60px' }}
                                    placeholder="Giải thích tại sao đáp án trên là đúng..."
                                    value={form.explanation}
                                    onChange={e => setForm(prev => ({ ...prev, explanation: e.target.value }))}
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '4px' }}>
                                <button className="btn-cancel" onClick={closeModal} style={{ padding: '10px 24px' }} disabled={saving}>
                                    Hủy
                                </button>
                                <button
                                    className="btn-save"
                                    onClick={modalType === 'add' ? handleSaveAdd : handleSaveEdit}
                                    style={{ padding: '10px 32px', opacity: saving ? 0.7 : 1 }}
                                    disabled={saving}>
                                    {saving ? 'Đang lưu...' : (modalType === 'add' ? 'Thêm mới' : 'Lưu thay đổi')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* ── Modal Review Import ─────────────────────────── */}
            <Modal
                title={<span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '8px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Xem trước câu hỏi từ Excel</span>}
                open={isImportModalOpen}
                onOk={confirmImport}
                onCancel={() => setIsImportModalOpen(false)}
                okText={importing ? "Đang xử lý..." : "Xác nhận thêm"}
                cancelText="Hủy bỏ"
                confirmLoading={importing}
                width={700}
                bodyStyle={{ maxHeight: '450px', overflowY: 'auto' }}
            >
                <div style={{ marginBottom: '16px' }}>
                    <p style={{ color: '#64748b' }}>Hệ thống tìm thấy <strong>{importedQuestions.length}</strong> câu hỏi hợp lệ từ file <strong>{originalFileName}</strong>. Bạn có thể xóa bớt các câu không mong muốn trước khi nhấn "Xác nhận thêm".</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {importedQuestions.map((q) => (
                        <div key={q.tempId} style={{ 
                            padding: '10px 15px', 
                            background: '#f8fafc', 
                            border: '1.1px solid #e2e8f0', 
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>{q.content}...</span>
                            <button 
                                onClick={() => removeImportedQuestion(q.tempId)}
                                style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </div>
                    ))}
                    {importedQuestions.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8' }}>Chưa có câu hỏi nào được chọn.</p>}
                </div>
            </Modal>
        </div>
    );
}
