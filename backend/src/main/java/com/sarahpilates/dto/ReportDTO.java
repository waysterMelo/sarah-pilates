package com.sarahpilates.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class ReportDTO {
    
    @Data
    public static class MonthlyReport {
        private LocalDate month;
        private Long totalStudents;
        private Long activeStudents;
        private Long newStudents;
        private Long totalClasses;
        private Long completedClasses;
        private BigDecimal totalRevenue;
        private BigDecimal averageClassPrice;
        private Double attendanceRate;
        private List<InstructorPerformance> instructorPerformances;
        private List<ClassTypeStats> classTypeStats;
    }
    
    @Data
    public static class InstructorPerformance {
        private Long instructorId;
        private String instructorName;
        private Long totalClasses;
        private BigDecimal totalRevenue;
        private Double averageRating;
        private Long totalStudents;
        private Double attendanceRate;
    }
    
    @Data
    public static class ClassTypeStats {
        private String classType;
        private Long totalClasses;
        private BigDecimal totalRevenue;
        private Double averagePrice;
        private Long uniqueStudents;
        private Double percentage;
    }
    
    @Data
    public static class StudentProgress {
        private Long studentId;
        private String studentName;
        private LocalDate startDate;
        private Integer totalSessions;
        private Double averageRating;
        private Double progressScore;
        private String lastFocus;
        private LocalDate lastSession;
        private List<ProgressMetric> metrics;
    }
    
    @Data
    public static class ProgressMetric {
        private String metricName;
        private Double initialValue;
        private Double currentValue;
        private Double improvement;
        private String unit;
    }
    
    @Data
    public static class FinancialReport {
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal totalRevenue;
        private BigDecimal totalExpenses;
        private BigDecimal netProfit;
        private Long totalClasses;
        private BigDecimal averageClassPrice;
        private Map<String, BigDecimal> revenueByClassType;
        private Map<String, BigDecimal> revenueByInstructor;
        private Map<LocalDate, BigDecimal> dailyRevenue;
        private List<PaymentStatusSummary> paymentSummary;
    }
    
    @Data
    public static class PaymentStatusSummary {
        private String status;
        private Long count;
        private BigDecimal amount;
        private Double percentage;
    }
    
    @Data
    public static class AttendanceReport {
        private LocalDate startDate;
        private LocalDate endDate;
        private Double overallAttendanceRate;
        private Long totalScheduled;
        private Long totalCompleted;
        private Long totalCanceled;
        private Long totalNoShows;
        private Map<String, Double> attendanceByDayOfWeek;
        private Map<String, Double> attendanceByClassType;
        private List<StudentAttendance> studentAttendances;
    }
    
    @Data
    public static class StudentAttendance {
        private Long studentId;
        private String studentName;
        private Long totalScheduled;
        private Long totalCompleted;
        private Long totalCanceled;
        private Long totalNoShows;
        private Double attendanceRate;
    }
}