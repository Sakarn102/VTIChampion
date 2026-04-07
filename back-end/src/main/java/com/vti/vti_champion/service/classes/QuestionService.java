package com.vti.vti_champion.service.classes;

import com.vti.vti_champion.constant.DifficultyLevel;
import com.vti.vti_champion.dto.request.CreateQuestionRequest;
import com.vti.vti_champion.dto.request.FilterQuestionRequest;
import com.vti.vti_champion.dto.request.UpdateQuestionRequest;
import com.vti.vti_champion.dto.response.AnswerResponse;
import com.vti.vti_champion.dto.response.ImportResponse;
import com.vti.vti_champion.dto.response.PracticeQuestionResponse;
import com.vti.vti_champion.dto.response.QuestionResponse;
import com.vti.vti_champion.entity.Answer;
import com.vti.vti_champion.entity.Exam;
import com.vti.vti_champion.entity.Question;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.repository.AnswerRepository;
import com.vti.vti_champion.repository.ExamRepository;
import com.vti.vti_champion.repository.QuestionRepository;
import com.vti.vti_champion.repository.UserRepository;
import com.vti.vti_champion.service.interfaces.IQuestionService;
import com.vti.vti_champion.specification.QuestionSpecification;
import com.vti.vti_champion.utils.XLSXUtil;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService implements IQuestionService {
    private final QuestionRepository questionRepository;
    private final ModelMapper modelMapper;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;

    @Override
    public Page<QuestionResponse> getQuestionsByTeacher(Integer teacherId, Pageable pageable) {
        Page<Question> questionPage = questionRepository.findByTeacherId(teacherId, pageable);

        return questionPage.map(question -> {
            QuestionResponse response = modelMapper.map(question, QuestionResponse.class);
            response.setQuestionId(question.getId());

            if (question.getAnswers() != null) {
                List<AnswerResponse> answerResponses = question.getAnswers().stream()
                        .map(answer -> modelMapper.map(answer, AnswerResponse.class)).toList();
                response.setAnswers(answerResponses);
            }

            return response;
        });
    }

    @Override
    public Page<QuestionResponse> getAllQuestions(Pageable pageable) {
        Page<Question> questionPage = questionRepository.findAll(pageable);

        return questionPage.map(question -> {
            QuestionResponse response = modelMapper.map(question, QuestionResponse.class);
            response.setQuestionId(question.getId());

            if (question.getAnswers() != null) {
                List<AnswerResponse> answerResponses = question.getAnswers().stream()
                        .map(answer -> modelMapper.map(answer, AnswerResponse.class)).toList();
                response.setAnswers(answerResponses);
            }

            return response;
        });
    }

    @Override
    public QuestionResponse createQuestionByTeacher(Integer teacherId, CreateQuestionRequest request) {
        // 1. Tìm thông tin giáo viên tạo
        User creator = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("creator not found"));

        // 2. Map từ Request sang Entity Question
        Question question = new Question();
        question.setContent(request.getContent());
        question.setTeacher(creator);
        question.setDifficultyLevel(request.getDifficultyLevel());
        question.setExplanation(request.getExplanation());

        // Gắn vào Exam nếu có examId
        if (request.getExamId() != null) {
            Exam exam = examRepository.findById(request.getExamId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy bài thi ID: " + request.getExamId()));
            question.setExam(exam);
        }

        // Lưu Question để lấy ID trước khi lưu Answer
        Question savedQuestion = questionRepository.save(question);

        // 3. Xử lý lưu danh sách Câu trả lời (Answers)
        List<Answer> answers = request.getAnswers().stream().map(answerRequest -> {
            Answer answer = new Answer();
            answer.setContent(answerRequest.getContent());
            answer.setIsCorrect(answerRequest.isCorrect());
            answer.setQuestion(savedQuestion); // Thiết lập khóa ngoại FK
            return answer;
        }).toList();

        List<Answer> savedAnswers = answerRepository.saveAll(answers);

        // Gán ngược lại list answers đã lưu vào object question để map ra DTO cho đầy
        // đủ
        savedQuestion.setAnswers(savedAnswers);

        // 4. Map kết quả cuối cùng sang QuestionResponse
        QuestionResponse response = modelMapper.map(savedQuestion, QuestionResponse.class);
        response.setQuestionId(savedQuestion.getId());

        return response;

    }

    @Override
    @Transactional
    public Question updateQuestionByTeacher(Integer questionId, Integer currentTeacherId,
            UpdateQuestionRequest request) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (question.getTeacher() == null || !question.getTeacher().getId().equals(currentTeacherId)) {
            throw new RuntimeException("Current teacher id not match");
        }

        question.setContent(request.getContent());
        question.setDifficultyLevel(request.getDifficultyLevel());
        question.setExplanation(request.getExplanation());

        List<Answer> currentAnswers = question.getAnswers();
        List<com.vti.vti_champion.dto.request.AnswerRequest> newAnswersReq = request.getAnswers();

        // Cập nhật in-place từng đáp án theo index để tránh lỗi FK Constraint
        for (int i = 0; i < newAnswersReq.size(); i++) {
            var req = newAnswersReq.get(i);
            if (i < currentAnswers.size()) {
                // ĐÃ CÓ: Cập nhật nội dung (Không đổi ID nên không lỗi FK)
                Answer existing = currentAnswers.get(i);
                existing.setContent(req.getContent());
                existing.setIsCorrect(req.isCorrect());
            } else {
                // CHƯA CÓ: Thêm mới
                Answer newAns = new Answer();
                newAns.setContent(req.getContent());
                newAns.setIsCorrect(req.isCorrect());
                newAns.setQuestion(question);
                currentAnswers.add(newAns);
            }
        }

        // Nếu lượng đáp án mới ít hơn cũ, xóa bớt những cái thừa ở cuối
        while (currentAnswers.size() > newAnswersReq.size()) {
            currentAnswers.remove(currentAnswers.size() - 1);
        }

        return questionRepository.save(question);
    }

    @Override
    @Transactional
    public void deleteQuestionByTeacher(Integer questionId, Integer currentTeacherId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (question.getTeacher() == null || !question.getTeacher().getId().equals(currentTeacherId)) {
            throw new RuntimeException("Current teacher id not match");
        }

        questionRepository.delete(question);
    }

    @Override
    public List<PracticeQuestionResponse> getPracticeExam(Integer examId) {
        List<Question> questions = questionRepository.findByExamId(examId);
        return questions.stream().map(q -> {
            PracticeQuestionResponse response = modelMapper.map(q, PracticeQuestionResponse.class);
            return response;
        }).collect(Collectors.toList());
    }

    private void importSingleQuestion(Row row, Integer examId, Integer teacherId) {
        // 1. Lấy dữ liệu từ các cột (0-6)
        String content = XLSXUtil.getCell(row, 0);
        String optionA = XLSXUtil.getCell(row, 1);
        String optionB = XLSXUtil.getCell(row, 2);
        String optionC = XLSXUtil.getCell(row, 3);
        String optionD = XLSXUtil.getCell(row, 4);
        
        String correctCell = XLSXUtil.getCell(row, 5);
        String correctLetter = (correctCell != null && !correctCell.trim().isEmpty()) ? correctCell.trim().toUpperCase() : "A";
        
        String levelCell = XLSXUtil.getCell(row, 6);
        String levelStr = (levelCell != null && !levelCell.trim().isEmpty()) ? levelCell.toUpperCase().trim() : "EASY";
        
        String explanation = XLSXUtil.getCell(row, 7);

        // 2. Khởi tạo Question Entity
        Question question = new Question();
        question.setContent(content);
        question.setExplanation(explanation);
        try {
            question.setDifficultyLevel(DifficultyLevel.valueOf(levelStr.toUpperCase()));
        } catch (Exception e) {
            question.setDifficultyLevel(DifficultyLevel.EASY);
        }

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        question.setTeacher(teacher);
        question.setExam(exam);

        // 3. Xử lý tạo 4 đối tượng Answer từ các cột Option
        String[] options = { optionA, optionB, optionC, optionD };
        String[] letters = { "A", "B", "C", "D" };
        
        List<Answer> pendingAnswers = new ArrayList<>();

        for (int i = 0; i < options.length; i++) {
            if (options[i] == null || options[i].isBlank())
                continue;

            Answer answer = new Answer();
            answer.setContent(options[i]);

            // Kiểm tra xem Option này có phải là đáp án đúng không
            if (letters[i].equals(correctLetter)) {
                answer.setIsCorrect(true);
            } else {
                answer.setIsCorrect(false);
            }
            pendingAnswers.add(answer);
        }

        // 4. Lưu Question trước để lấy ID (không có answers đi kèm để tránh lỗi Cascade kép)
        Question savedQuestion = questionRepository.save(question);

        // 5. Gắn ID câu hỏi vào từng Answer và lưu
        for (Answer ans : pendingAnswers) {
            ans.setQuestion(savedQuestion);
        }
        List<Answer> savedAnswers = answerRepository.saveAll(pendingAnswers);
        savedQuestion.setAnswers(savedAnswers);
        
        // Cập nhật lên session (optional nhưng an toàn)
        questionRepository.save(savedQuestion);
    }

    @Override
    @Transactional
    public ImportResponse importQuestions(MultipartFile file, Integer examId, Integer teacherId) {
        int total = 0;
        int success = 0;
        List<String> errors = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null)
                    continue;
                    
                String content = XLSXUtil.getCell(row, 0);
                if (content == null || content.trim().isEmpty()) {
                    continue; // Bỏ qua nếu dòng không có nội dung câu hỏi
                }
                
                total++;

                try {
                    importSingleQuestion(row, examId, teacherId);
                    success++;
                } catch (Exception e) {
                    errors.add("Dòng " + (i + 1) + ": " + e.getMessage());
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return new ImportResponse(total, success, total - success, errors);
    }

    @Override
    public byte[] downloadTemplate() {
        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Template_Question");

            // 1. Tạo Header (Tên các cột phải khớp 100% với hàm ImportSingleQuestion)
            String[] headers = { "Content", "Option A", "Option B", "Option C", "Option D", "Correct Answer",
                    "Level (EASY/MEDIUM/HARD)", "Explanation" };
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            // 2. (Optional) Thêm 1 dòng ví dụ để người dùng đỡ bỡ ngỡ
            Row exampleRow = sheet.createRow(1);
            exampleRow.createCell(0).setCellValue("Ví dụ: Java là ngôn ngữ gì?");
            exampleRow.createCell(1).setCellValue("A. Lập trình web");
            exampleRow.createCell(2).setCellValue("B. Lập trình hướng đối tượng");
            exampleRow.createCell(3).setCellValue("C. Database");
            exampleRow.createCell(4).setCellValue("D. Không là gì");
            exampleRow.createCell(5).setCellValue("A");
            exampleRow.createCell(6).setCellValue("EASY");
            exampleRow.createCell(7).setCellValue("Java là ngôn ngữ lập trình hướng đối tượng");

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Loi tao file mau ", e);
        }
    }

    @Override
    public Page<QuestionResponse> getAllQuestions(FilterQuestionRequest request, Pageable pageable) {
        Specification<Question> spec = QuestionSpecification.filter(request);

        return questionRepository.findAll(spec, pageable).map(question -> {
            QuestionResponse response = modelMapper.map(question, QuestionResponse.class);

            return response;
        });
    }
}
