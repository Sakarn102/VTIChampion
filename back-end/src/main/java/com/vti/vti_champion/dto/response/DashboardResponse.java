package com.vti.vti_champion.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private long totalUsers;
    private long totalExams;
    private long totalResults;
    private double averageScore;

    // Chart data
    private List<Map<String, Object>> weeklySessions;
    private List<Map<String, Object>> roleDistribution;
    
    // Recent activity list
    private List<RecentActivityResponse> recentActivities;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivityResponse {
        private String studentName;
        private String examTitle;
        private Double score;
        private String timeAgo;
        private String status;
    }
}
