package com.vti.vti_champion.service.classes;

import com.vti.vti_champion.dto.request.CreateQuestionRequest;
import com.vti.vti_champion.dto.request.UpdateQuestionRequest;
import com.vti.vti_champion.dto.response.AnswerResponse;
import com.vti.vti_champion.dto.response.QuestionResponse;
import com.vti.vti_champion.entity.Answer;
import com.vti.vti_champion.entity.Question;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.repository.AnswerRepository;
import com.vti.vti_champion.repository.QuestionRepository;
import com.vti.vti_champion.repository.UserRepository;
import com.vti.vti_champion.service.interfaces.IQuestionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService implements IQuestionService {
    private final QuestionRepository questionRepository;
    private final ModelMapper modelMapper;
    private final AnswerRepository answerRepository;
    private final UserRepository  userRepository;

    @Override
    public Page<QuestionResponse> getQuestionsByTeacher(Integer teacherId, Pageable pageable) {
        Page<Question> questionPage = questionRepository.findByCreatorId(teacherId, pageable);

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
        question.setCreator(creator);
        question.setDifficultyLevel(request.getDifficultyLevel());
        question.setExplanation(request.getExplanation());

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

        // Gán ngược lại list answers đã lưu vào object question để map ra DTO cho đầy đủ
        savedQuestion.setAnswers(savedAnswers);

        // 4. Map kết quả cuối cùng sang QuestionResponse
        QuestionResponse response = modelMapper.map(savedQuestion, QuestionResponse.class);
        response.setQuestionId(savedQuestion.getId());

        return response;

    }

    @Override
    @Transactional
    public Question updateQuestionByTeacher(Integer questionId, Integer currentTeacherId, UpdateQuestionRequest request) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (question.getCreator() == null || !question.getCreator().getId().equals(currentTeacherId)) {
            throw new RuntimeException("Current teacher id not match");
        }

        question.setContent(request.getContent());
        question.setDifficultyLevel(request.getDifficultyLevel());
        question.setExplanation(request.getExplanation());

        List<Answer> currentAnswers = question.getAnswers();
        currentAnswers.clear();

        // Map dữ liệu mới từ request và add vào list cũ
        List<Answer> newAnswers = request.getAnswers().stream().map(answerRequest -> {
            Answer answer = new Answer();
            answer.setContent(answerRequest.getContent());
            answer.setIsCorrect(answerRequest.isCorrect());
            answer.setQuestion(question); // Thiết lập khóa ngoại FK
            return answer;
        }).collect(Collectors.toList());

        currentAnswers.addAll(newAnswers);

        return questionRepository.save(question);
    }

    @Override
    @Transactional
    public void deleteQuestionByTeacher(Integer questionId, Integer currentTeacherId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (question.getCreator() == null || !question.getCreator().getId().equals(currentTeacherId)) {
            throw new RuntimeException("Current teacher id not match");
        }

        questionRepository.delete(question);
    }
}
