package com.vti.vti_champion.service.classes;

import com.vti.vti_champion.dto.response.DashboardResponse;
import com.vti.vti_champion.entity.ExamResult;
import com.vti.vti_champion.repository.ExamRepository;
import com.vti.vti_champion.repository.ExamResultRepository;
import com.vti.vti_champion.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final ExamResultRepository examResultRepository;

    public DashboardResponse getAdminDashboardStats() {
        long totalUsers = userRepository.count();
        long totalExams = examRepository.count();
        long totalResults = examResultRepository.count();
        
        // Calculate average score of all COMPLETED results
        List<ExamResult> allResults = examResultRepository.findAll();
        double avgScore = allResults.stream()
                .filter(er -> er.getScore() != null && "COMPLETED".equalsIgnoreCase(er.getStatus()))
                .mapToDouble(ExamResult::getScore)
                .average()
                .orElse(0.0);
        
        // Weekly session data (simple aggregation by day for the last 7 days)
        List<Map<String, Object>> weeklySessions = getWeeklySessionStats(allResults);
        
        // Role distribution
        List<Map<String, Object>> roleDistribution = getRoleDistribution();
        
        // Recent activities
        List<DashboardResponse.RecentActivityResponse> recentActivities = allResults.stream()
                .sorted(Comparator.comparing(ExamResult::getStartTime, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(10)
                .map(er -> DashboardResponse.RecentActivityResponse.builder()
                        .studentName(er.getStudent() != null ? er.getStudent().getFullname() : "N/A")
                        .examTitle(er.getExam() != null ? er.getExam().getTitle() : "N/A")
                        .score(er.getScore())
                        .status(er.getStatus())
                        .timeAgo(formatTimeAgo(er.getStartTime()))
                        .build())
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalExams(totalExams)
                .totalResults(totalResults)
                .averageScore(Math.round(avgScore * 10.0) / 10.0)
                .weeklySessions(weeklySessions)
                .roleDistribution(roleDistribution)
                .recentActivities(recentActivities)
                .build();
    }

    private List<Map<String, Object>> getWeeklySessionStats(List<ExamResult> results) {
        LocalDateTime now = LocalDateTime.now();
        Map<String, Long> dayCounts = new LinkedHashMap<>();
        
        for (int i = 6; i >= 0; i--) {
            String dayLabel = now.minusDays(i).format(DateTimeFormatter.ofPattern("dd/MM"));
            dayCounts.put(dayLabel, 0L);
        }
        
        for (ExamResult res : results) {
            if (res.getStartTime() != null && res.getStartTime().isAfter(now.minusDays(7))) {
                String dayLabel = res.getStartTime().format(DateTimeFormatter.ofPattern("dd/MM"));
                dayCounts.put(dayLabel, dayCounts.getOrDefault(dayLabel, 0L) + 1);
            }
        }
        
        List<Map<String, Object>> stats = new ArrayList<>();
        dayCounts.forEach((day, count) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", day);
            map.put("sessions", count);
            stats.add(map);
        });
        return stats;
    }

    private List<Map<String, Object>> getRoleDistribution() {
        // Count users by role
        List<Object[]> roles = userRepository.countUsersByRole();
        List<Map<String, Object>> distribution = new ArrayList<>();
        
        for (Object[] obj : roles) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", obj[0].toString());
            map.put("value", (Long) obj[1]);
            distribution.add(map);
        }
        return distribution;
    }

    private String formatTimeAgo(LocalDateTime startTime) {
        if (startTime == null) return "N/A";
        long minutes = ChronoUnit.MINUTES.between(startTime, LocalDateTime.now());
        if (minutes < 1) return "Vừa xong";
        if (minutes < 60) return minutes + " phút trước";
        long hours = ChronoUnit.HOURS.between(startTime, LocalDateTime.now());
        if (hours < 24) return hours + " giờ trước";
        long days = ChronoUnit.DAYS.between(startTime, LocalDateTime.now());
        return days + " ngày trước";
    }
}
