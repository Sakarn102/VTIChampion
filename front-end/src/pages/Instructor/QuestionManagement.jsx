
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Card,
  Tooltip,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  BookOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import questionApi from "../../api/questionApi";
import "../../styles/Admin.css";

const { Option } = Select;
const { TextArea } = Input;

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Pagination & Filtering
  const [keyword, setKeyword] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [pagination, setPagination] = useState({
    pageSize: 6,
    showSizeChanger: false,
  });

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await questionApi.getAll({ // GIANG VIEN XEM FULL NGAN HANG
        page: 0,
        size: 1000,
      });

      const data = res.data || res;
      setQuestions(data.content || []);
    } catch (error) {
      message.error("Lỗi khi tải danh sách câu hỏi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleCreateOrUpdate = async (values) => {
    try {
      setSubmitting(true);
      
      // Chuyển đổi định dạng answers cho đúng API
      const payload = {
        content: values.content,
        difficultyLevel: values.difficultyLevel,
        explanation: values.explanation,
        answers: values.answers.map((ans, index) => ({
          content: ans.content,
          isCorrect: values.correctAnswer === index,
        })),
      };

      if (editingQuestion) {
        await questionApi.updateQuestion(editingQuestion.questionId, payload);
        message.success("Cập nhật câu hỏi thành công!");
      } else {
        await questionApi.createQuestion(payload);
        message.success("Thêm mới câu hỏi thành công!");
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingQuestion(null);
      fetchQuestions();
    } catch (error) {
       // Hiển thị lỗi chi tiết từ Backend
       const errorMsg = error.response?.data?.message || error.response?.data || "Có lỗi xảy ra khi lưu câu hỏi!";
       message.error(typeof errorMsg === 'string' ? errorMsg : "Lỗi lưu dữ liệu!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await questionApi.deleteQuestion(id);
      message.success("Xóa câu hỏi thành công!");
      fetchQuestions();
    } catch (error) {
      message.error("Không thể xóa câu hỏi này (có thể đã được dùng trong đề thi)!");
    }
  };

  const openEditModal = (record) => {
    setEditingQuestion(record);
    
    // Tìm index của câu trả lời đúng
    const correctIndex = record.answers?.findIndex(a => a.isCorrect);
    
    form.setFieldsValue({
      content: record.content,
      difficultyLevel: record.difficultyLevel,
      explanation: record.explanation,
      correctAnswer: correctIndex !== -1 ? correctIndex : 0,
      answers: record.answers?.map(a => ({ content: a.content })) || [
        { content: "" }, { content: "" }, { content: "" }, { content: "" }
      ]
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Nội dung câu hỏi",
      dataIndex: "content",
      key: "content",
      width: "40%",
      render: (text) => (
        <div style={{ fontWeight: 600, color: "#1e293b", maxWidth: "450px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Độ khó",
      dataIndex: "difficultyLevel",
      key: "difficultyLevel",
      render: (level) => {
        let color = "green";
        if (level === "MEDIUM") color = "orange";
        if (level === "HARD") color = "red";
        return <Tag color={color} style={{ borderRadius: "6px", fontWeight: 700 }}>{level}</Tag>;
      },
    },
    {
      title: "Số đáp án",
      key: "answersCount",
      render: (_, record) => <span>{record.answers?.length || 0}</span>,
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<SearchOutlined style={{ color: "#2563eb", fontSize: "18px" }} />}
            onClick={() => {
              setSelectedDetail(record);
              setIsDetailModalOpen(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const filteredQuestions = questions.filter(q => {
    const matchKeyword = q.content?.toLowerCase().includes(keyword.toLowerCase());
    const matchDiff = difficulty === "ALL" || q.difficultyLevel === difficulty;
    return matchKeyword && matchDiff;
  });

  return (
    <div className="admin-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Kho câu hỏi hệ thống</h1>
          <p style={{ color: "#64748b" }}>Khám phá ngân hàng đề thi chung - Giảng viên chỉ được phép xem và tham khảo</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
         <Card className="stats-card">
            <div className="stats-info">
               <span className="stats-label">Tổng câu hỏi</span>
               <span className="stats-value">{pagination.total}</span>
            </div>
            <div className="stats-icon" style={{ background: "#eff6ff", color: "#3b82f6" }}><BookOutlined /></div>
         </Card>
      </div>

      <div className="filter-bar">
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", flex: 1 }}>
          <Input
            placeholder="Tìm kiếm nội dung câu hỏi..."
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            className="admin-search-input"
            style={{ width: "350px" }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Select 
            defaultValue="ALL" 
            style={{ width: 160 }} 
            className="admin-select"
            onChange={setDifficulty}
          >
            <Option value="ALL">Tất cả độ khó</Option>
            <Option value="EASY">Dễ</Option>
            <Option value="MEDIUM">Trung bình</Option>
            <Option value="HARD">Khó</Option>
          </Select>
        </div>
        <Button icon={<SearchOutlined />} onClick={fetchQuestions}>Làm mới</Button>
      </div>

      <div className="premium-table">
        <Table
          dataSource={filteredQuestions}
          columns={columns}
          rowKey="questionId"
          loading={loading}
          pagination={pagination}
        />
      </div>

      <Modal
        title={editingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        centered
        className="premium-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate} initialValues={{ difficultyLevel: "EASY" }}>
          <Form.Item label="Nội dung câu hỏi" name="content" rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi!" }]}>
            <TextArea rows={3} placeholder="VD: Java là ngôn ngữ gì?" style={{ borderRadius: "8px" }} />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item label="Mức độ" name="difficultyLevel" rules={[{ required: true }]}>
              <Select size="large">
                <Option value="EASY">Dễ (Easy)</Option>
                <Option value="MEDIUM">Trung bình (Medium)</Option>
                <Option value="HARD">Khó (Hard)</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Giải thích (Bắt buộc)" name="explanation" rules={[{ required: true, message: "Nhập giải thích cho đáp án!" }]}>
              <TextArea rows={1} placeholder="Lý do chọn câu trả lời này..." />
            </Form.Item>
          </div>

          <Divider orientation="left">Danh sách đáp án (Tick chọn đáp án đúng)</Divider>
          
          <Form.Item name="correctAnswer" noStyle>
            <Select style={{ display: 'none' }} />
          </Form.Item>

          <Form.List name="answers">
            {(fields) => (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {fields.map((field, index) => (
                  <div key={field.key} style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <Form.Item 
                      name="correctAnswer" 
                      valuePropName="checked" 
                      noStyle
                      getValueProps={(val) => ({ checked: val === index })}
                      trigger="onChange"
                    >
                      <div 
                        onClick={() => form.setFieldsValue({ correctAnswer: index })}
                        style={{ cursor: "pointer", marginTop: "8px" }}
                      >
                         {form.getFieldValue("correctAnswer") === index ? 
                            <CheckCircleFilled style={{ color: "#22c55e", fontSize: "20px" }} /> : 
                            <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #cbd5e1" }} />
                         }
                      </div>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "content"]}
                      rules={[{ required: true, message: "Nhập đáp án!" }]}
                      style={{ flex: 1, marginBottom: 0 }}
                    >
                      <Input placeholder={`Đáp án ${String.fromCharCode(65 + index)}...`} variant="borderless" />
                    </Form.Item>
                  </div>
                ))}
              </div>
            )}
          </Form.List>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "32px" }}>
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={submitting} className="admin-btn-primary">
              {editingQuestion ? "Cập nhật đồng bộ" : "Thêm vào ngân hàng"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL XEM CHI TIẾT */}
      <Modal
        title={<div style={{ display: "flex", alignItems: "center", gap: "10px" }}><BookOutlined style={{ color: "#2563eb" }} /> <span>Chi tiết câu hỏi</span></div>}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
        ]}
        width={650}
        centered
        className="premium-modal"
      >
        {selectedDetail && (
          <div style={{ padding: "10px 0" }}>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "8px", fontWeight: 600, textTransform: "uppercase" }}>Nội dung câu hỏi:</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", lineHeight: 1.5, background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                {selectedDetail.content}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px", fontWeight: 600, textTransform: "uppercase" }}>Danh sách các đáp án:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {selectedDetail.answers?.map((ans, idx) => (
                  <div key={idx} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px", 
                    padding: "14px 16px", 
                    borderRadius: "10px", 
                    border: "1px solid",
                    borderColor: ans.isCorrect ? "#bbf7d0" : "#e2e8f0",
                    background: ans.isCorrect ? "#f0fdf4" : "white",
                  }}>
                    {ans.isCorrect ? 
                       <CheckCircleFilled style={{ color: "#22c55e", fontSize: "20px" }} /> : 
                       <CloseCircleFilled style={{ color: "#94a3b8", fontSize: "20px" }} />
                    }
                    <span style={{ fontSize: "15px", color: ans.isCorrect ? "#166534" : "#475569", fontWeight: ans.isCorrect ? 700 : 500 }}>
                      {ans.content}
                    </span>
                    {ans.isCorrect && <Tag color="success" style={{ marginLeft: "auto", borderRadius: "4px" }}>Đúng</Tag>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuestionManagement;
