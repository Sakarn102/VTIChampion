import React, { useState, useEffect, useMemo } from "react";
import { 
  Table, 
  Button, 
  Input, 
  Select, 
  Modal, 
  Form, 
  message, 
  Tooltip, 
  Tag, 
  Space, 
  Row, 
  Col, 
  Statistic,
  InputNumber,
  Card,
  Popconfirm,
  Avatar,
  Checkbox,
  Divider,
  Spin
} from "antd";
import * as XLSX from 'xlsx';
import { useRef } from 'react';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  PieChartOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import "../../styles/Admin.css";
import examApi from "../../api/examApi";
import classApi from "../../api/classApi";
import questionApi from "../../api/questionApi";
import { useAuth } from "../../context/AuthContext";

const { Option } = Select;

const ExamManagement = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);

  // Advanced Question States
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [importedQuestions, setImportedQuestions] = useState([]);
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [originalFileName, setOriginalFileName] = useState("");
  const [originalFileObj, setOriginalFileObj] = useState(null);
  const [originalQuestionsCount, setOriginalQuestionsCount] = useState(0);
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");

  // Filters
  const [keyword, setKeyword] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [examRes, classRes] = await Promise.all([
        examApi.getAll({ page: 1, size: 1000 }),
        classApi.getAll(),
      ]);

      const examData = examRes.data || examRes;
      setExams(examData.content || []);
      setClasses(Array.isArray(classRes) ? classRes : (classRes.data || []));
    } catch (error) {
      console.error("Lỗi đồng bộ:", error);
      message.error("Lỗi đồng bộ dữ liệu hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionBank = async () => {
      // Chi fetch neu danh sach hien tai dang rong (de tranh call lap lai)
      if (allQuestions.length > 0) return;
      
      try {
          setLoadingQuestions(true);
          const questRes = await questionApi.getAll({ size: 1000 });
          const qData = questRes.data || questRes;
          setAllQuestions(qData.content || []);
      } catch (err) {
          message.error("Không thể tải ngân hàng câu hỏi!");
      } finally {
          setLoadingQuestions(false);
      }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredExams = useMemo(() => {
    let result = [...exams];
    if (keyword) {
      const lowKey = keyword.toLowerCase();
      result = result.filter(e => 
        (e.title && e.title.toLowerCase().includes(lowKey)) || 
        (e.code && e.code.toLowerCase().includes(lowKey))
      );
    }
    if (classFilter !== "ALL") {
      result = result.filter(e => (e.classId === classFilter || e.class_id === classFilter));
    }
    if (typeFilter !== "ALL") {
      result = result.filter(e => e.type === typeFilter);
    }
    return result;
  }, [exams, keyword, classFilter, typeFilter]);

  const stats = useMemo(() => {
    const total = exams.length;
    const assignedCount = exams.filter(e => (e.classId || e.class_id || e.className)).length;
    const testCount = exams.filter(e => e.type === "Test").length;
    const practiceCount = exams.filter(e => e.type === "Practice").length;

    return { total, assignedCount, testCount, practiceCount };
  }, [exams]);

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      
      const payload = {
        ...values,
        creatorId: user?.id || 1, 
        questionIds: selectedQuestionIds
      };

      let examRes;
      if (editingExam) {
        examRes = await examApi.update(editingExam.examId, payload);
        message.success("Cập nhật thành công!");
      } else {
        examRes = await examApi.create(payload);
        message.success("Tạo mới thành công!");
      }

      // HANDLE EXCEL IMPORT IF EXISTS
      const newExamId = editingExam ? editingExam.examId : (examRes.data?.examId || examRes.examId);
      if (importedQuestions.length > 0 && newExamId) {
        try {
          message.loading({ content: 'Đang xử lý câu hỏi từ Excel...', key: 'importing' });
          let fileToUpload = originalFileObj;
          
          // Rebuild file if some questions were removed
          if (importedQuestions.length !== originalQuestionsCount) {
             const aoa = [excelHeaders];
             importedQuestions.forEach(q => aoa.push(q.rawData));
             const ws = XLSX.utils.aoa_to_sheet(aoa);
             const wb = XLSX.utils.book_new();
             XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
             const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
             const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             fileToUpload = new File([blob], originalFileName || 'imported.xlsx');
          }

          const importRes = await questionApi.importQuestions(fileToUpload, newExamId);
          message.success({ content: `Đã nhập thành công ${importRes.data?.success || importRes.success} câu hỏi từ Excel!`, key: 'importing' });
        } catch (err) {
          message.error({ content: 'Lỗi khi import file Excel!', key: 'importing' });
        }
      }

      setIsModalOpen(false);
      resetQuestionStates();
      fetchInitialData();
    } catch (error) {
      message.error(typeof error === 'string' ? error : "Lỗi lưu dữ liệu!");
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuestionStates = () => {
    setSelectedQuestionIds([]);
    setImportedQuestions([]);
    setOriginalFileName("");
    setOriginalFileObj(null);
  };

  const toggleQuestion = (id) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFileName(file.name);
      setOriginalFileObj(file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = XLSX.read(evt.target.result, { type: 'array' });
          const rows = XLSX.utils.sheet_to_json(data.Sheets[data.SheetNames[0]], { header: 1, defval: '' });
          if (rows.length > 0) {
            setExcelHeaders(rows[0]);
            const parsed = rows.slice(1).filter(r => r.some(c => c)).map((r, i) => ({
              id: `excel_${i}_${Date.now()}`,
              content: r.find(c => typeof c === 'string' && c.length > 5)?.substring(0, 50) || `Câu hỏi từ file dòng ${i+2}`,
              rawData: r
            }));
            setImportedQuestions(parsed);
            setOriginalQuestionsCount(parsed.length);
            message.success(`Đã đọc ${parsed.length} câu hỏi.`);
          }
        } catch(err) { message.error("Lỗi đọc file!"); }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const filteredQuestionBank = allQuestions.filter(q => {
    const matchSearch = q.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDiff = difficultyFilter === 'ALL' || q.difficultyLevel === difficultyFilter;
    return matchSearch && matchDiff;
  });

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await examApi.delete(id);
      message.success("Xoá thành công!");
      fetchInitialData();
    } catch (error) {
      message.error("Lỗi khi xoá!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "MÃ ĐỀ THI",
      dataIndex: "code",
      key: "code",
      render: (code) => <Tag color="#2563eb" style={{ borderRadius: "6px", fontWeight: 700 }}>{code}</Tag>,
    },
    {
      title: "TÊN ĐỀ THI",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
            <FileTextOutlined style={{ fontSize: "18px" }} />
          </div>
          <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "14px" }}>{text}</div>
        </div>
      ),
    },
    {
      title: "PHÂN LOẠI",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "Test" ? "volcano" : "green"} style={{ borderRadius: "20px", padding: "2px 12px" }}>
          {type === "Test" ? "Bài thi" : "Luyện tập"}
        </Tag>
      ),
    },
    {
      title: "LỚP HỌC",
      key: "className",
      dataIndex: "className",
      render: (className, record) => {
        const hasClass = record.classId || record.class_id || className;
        return (
          <Space>
            <TeamOutlined style={{ color: hasClass ? "#10b981" : "#94a3b8" }} />
            <span style={{ fontWeight: 600, color: hasClass ? "#475569" : "#94a3b8" }}>
              {className || (hasClass ? `Lớp #${record.classId || record.class_id}` : "N/A")}
            </span>
          </Space>
        );
      },
    },
    {
      title: "THỜI GIAN",
      dataIndex: "duration",
      key: "duration",
      render: (min) => <span style={{ color: "#64748b" }}><ClockCircleOutlined /> {min} phút</span>,
    },
    {
      title: "HÀNH ĐỘNG",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa"><Button type="text" icon={<EditOutlined style={{ color: "#2563eb" }} />} onClick={() => {
            setEditingExam(record);
            const qIds = record.questions?.map(q => q.id || q.questionId) || [];
            setSelectedQuestionIds(qIds);
            setImportedQuestions([]);
            fetchQuestionBank(); // Chi tai khi can sua
            form.setFieldsValue({
              code: record.code,
              title: record.title,
              duration: record.duration,
              classId: record.classId || record.class_id || record.id_class,
              type: record.type,
            });
            setIsModalOpen(true);
          }} /></Tooltip>
          <Popconfirm title="Xoá đề thi?" onConfirm={() => handleDelete(record.examId)} okText="Xoá" cancelText="Hủy"><Button type="text" danger icon={<DeleteOutlined />} /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "1600px", margin: "0 auto" }}>
      <div className="admin-page-header" style={{ marginBottom: "32px" }}>
        <div>
          <h1 className="admin-page-title">Quản lý Đề thi</h1>
          <p style={{ color: "#64748b" }}>Phân loại dữ liệu thật: Bài thi & Luyện tập</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingExam(null); resetQuestionStates(); form.resetFields(); setIsModalOpen(true); fetchQuestionBank(); }} className="admin-btn-primary" style={{ height: "48px" }}>Thêm đề thi thật</Button>
      </div>

      <div className="stats-grid" style={{ marginBottom: "32px" }}>
        <Card bordered={false} className="stat-card-premium"><Statistic title="Tổng ngân hàng" value={stats.total} prefix={<BookOutlined style={{ color: "#3b82f6" }} />} /></Card>
        <Card bordered={false} className="stat-card-premium"><Statistic title="Đã có lớp" value={stats.assignedCount} prefix={<TrophyOutlined style={{ color: "#f59e0b" }} />} valueStyle={{ color: "#475569" }} /></Card>
        <Card bordered={false} className="stat-card-premium"><Statistic title="Bài thi (Test)" value={stats.testCount} prefix={<CheckCircleOutlined style={{ color: "#ef4444" }} />} valueStyle={{ fontWeight: 700 }} /></Card>
        <Card bordered={false} className="stat-card-premium"><Statistic title="Luyện tập (Practice)" value={stats.practiceCount} prefix={<PieChartOutlined style={{ color: "#10b981" }} />} valueStyle={{ fontWeight: 700 }} /></Card>
      </div>

      <div className="admin-filter-bar">
        <div style={{ flex: 1 }}><Input placeholder="Tìm nhanh..." prefix={<SearchOutlined />} size="large" value={keyword} onChange={(e) => setKeyword(e.target.value)} allowClear /></div>
        <Space>
           <Select value={typeFilter} onChange={setTypeFilter} size="large" style={{ width: "160px" }}>
              <Option value="ALL">Tất cả loại</Option>
              <Option value="Test">Bài thi</Option>
              <Option value="Practice">Luyện tập</Option>
           </Select>
           <Select value={classFilter} onChange={setClassFilter} size="large" style={{ width: "220px" }}>
              <Option value="ALL">Tất cả lớp học</Option>
              {classes.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
           </Select>
        </Space>
      </div>

      <div className="premium-table">
        <Table dataSource={filteredExams} columns={columns} rowKey="examId" loading={loading} pagination={{ pageSize: 6, showSizeChanger: false }} />
      </div>

      <Modal title={editingExam ? "Cập nhật loại bài thi" : "Thiết lập nội dung đề mới"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={700} centered className="premium-modal">
        <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ type: "Test" }}>
          <Row gutter={16}>
             <Col span={8}><Form.Item label="Mã đề" name="code" rules={[{ required: true }]}><Input size="large" /></Form.Item></Col>
             <Col span={16}><Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}><Input size="large" /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Thời gian" name="duration" rules={[{ required: true }]}><InputNumber size="large" min={1} style={{ width: "100%" }} /></Form.Item></Col>
            <Col span={12}>
              <Form.Item label="Gán lớp" name="classId" rules={[{ required: true }]}>
                <Select size="large">
                  {classes.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
           <Form.Item label="Loại bài thi" name="type" rules={[{ required: true }]}>
              <Select size="large">
                <Option value="Test">Đề thi (Test)</Option>
                <Option value="Practice">Luyện tập (Practice Exam)</Option>
             </Select>
           </Form.Item>
           <Form.Item label="Số lượt làm bài tối đa" name="maxAttempts" tooltip="Học viên chỉ được làm bài tối đa số lần này">
              <InputNumber min={1} max={100} style={{ width: '100%' }} size="large" placeholder="1 (mặc định)" />
           </Form.Item>
          <Divider orientation="left">Nội dung câu hỏi</Divider>
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ fontWeight: 700 }}>Chọn từ ngân hàng hoặc Import Excel</div>
                  <Space>
                      <Button size="small" onClick={async () => {
                          const blob = await questionApi.downloadTemplate();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url; a.download = "Template_Question.xlsx";
                          a.click();
                      }}>Mẫu Excel</Button>
                      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".xlsx,.xls" onChange={handleFileUpload} />
                      <Button type="dashed" icon={<PlusOutlined />} onClick={() => fileInputRef.current.click()}>Upload Excel</Button>
                      <Button type="primary" size="small" onClick={() => { setIsQuestionBankModalOpen(true); fetchQuestionBank(); }}>Ngân hàng đề</Button>
                  </Space>
              </div>

              <div style={{ minHeight: "60px" }}>
                  {selectedQuestionIds.length === 0 && importedQuestions.length === 0 ? (
                      <div style={{ textAlign: "center", color: "#94a3b8", padding: "12px" }}>Chưa chọn câu hỏi</div>
                  ) : (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {selectedQuestionIds.map(id => {
                              const q = allQuestions.find(it => (it.id === id || it.questionId === id));
                              return <Tag color="blue" key={id} closable onClose={() => toggleQuestion(id)}>{q?.content?.substring(0, 30)}...</Tag>
                          })}
                          {importedQuestions.map(q => (
                              <Tag color="green" key={q.id} closable onClose={() => setImportedQuestions(prev => prev.filter(it => it.id !== q.id))}>[Excel] {q.content}...</Tag>
                          ))}
                      </div>
                  )}
              </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>Lưu đồng bộ</Button>
          </div>
        </Form>
      </Modal>

      {/* Question Selection Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: '30px' }}>
             <span>Chọn câu hỏi từ ngân hàng đề</span>
             <Space>
                 <Input 
                    placeholder="Tìm kiếm..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 180 }}
                    size="small"
                 />
                 <Select 
                    value={difficultyFilter} 
                    onChange={setDifficultyFilter}
                    style={{ width: 120 }}
                    size="small"
                 >
                     <Option value="ALL">Mọi mức độ</Option>
                     <Option value="EASY">Dễ</Option>
                     <Option value="MEDIUM">Trung bình</Option>
                     <Option value="HARD">Khó</Option>
                 </Select>
             </Space>
          </div>
        }
        open={isQuestionBankModalOpen}
        onOk={() => setIsQuestionBankModalOpen(false)}
        onCancel={() => setIsQuestionBankModalOpen(false)}
        width={850}
        centered
      >
        <Spin spinning={loadingQuestions} tip="Đang tải ngân hàng câu hỏi...">
          <div style={{ maxHeight: '500px', overflowY: 'auto', minHeight: '200px' }}>
            {filteredQuestionBank.length === 0 && !loadingQuestions ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                 Không tìm thấy câu hỏi nào phù hợp.
              </div>
            ) : (
              filteredQuestionBank.map(q => (
                <div key={q.id || q.questionId} style={{ 
                    padding: '12px 16px', 
                    borderBottom: '1px solid #f3f4f6', 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '16px'
                }}>
                  <Checkbox 
                    checked={selectedQuestionIds.includes(q.id || q.questionId)} 
                    onChange={() => toggleQuestion(q.id || q.questionId)}
                    style={{ marginTop: 4 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>{q.content}</div>
                    <Tag color={q.difficultyLevel === 'EASY' ? 'green' : q.difficultyLevel === 'MEDIUM' ? 'orange' : 'red'} style={{ marginTop: 4 }}>
                        {q.difficultyLevel}
                    </Tag>
                  </div>
                </div>
              ))
            )}
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default ExamManagement;
