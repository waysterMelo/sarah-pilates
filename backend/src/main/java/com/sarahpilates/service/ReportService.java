package com.sarahpilates.service;

import com.sarahpilates.dto.ReportDTO;
import com.sarahpilates.entity.Schedule;
import com.sarahpilates.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {
    
    private final StudentRepository studentRepository;
    private final InstructorRepository instructorRepository;
    private final ScheduleRepository scheduleRepository;
    private final PhysicalEvaluationRepository physicalEvaluationRepository;
    private final EvolutionRecordRepository evolutionRecordRepository;
    
    public ReportDTO.MonthlyReport generateMonthlyReport(LocalDate month) {
        YearMonth yearMonth = YearMonth.from(month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        ReportDTO.MonthlyReport report = new ReportDTO.MonthlyReport();
        report.setMonth(month);
        
        // Estatísticas básicas
        report.setTotalStudents(studentRepository.count());
        report.setActiveStudents(studentRepository.countActiveStudents());
        
        List<Schedule> monthSchedules = scheduleRepository.findByDateBetween(startDate, endDate);
        report.setTotalClasses((long) monthSchedules.size());
        report.setCompletedClasses(
            monthSchedules.stream()
                .filter(s -> s.getStatus() == Schedule.ScheduleStatus.CONCLUIDO)
                .count()
        );
        
        // Receita total
        BigDecimal totalRevenue = monthSchedules.stream()
            .filter(s -> s.getPaymentStatus() == Schedule.PaymentStatus.PAGO)
            .map(Schedule::getPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.setTotalRevenue(totalRevenue);
        
        // Preço médio por aula
        if (report.getCompletedClasses() > 0) {
            report.setAverageClassPrice(
                totalRevenue.divide(BigDecimal.valueOf(report.getCompletedClasses()), 2, RoundingMode.HALF_UP)
            );
        }
        
        // Taxa de comparecimento
        long scheduledClasses = monthSchedules.stream()
            .filter(s -> s.getStatus() != Schedule.ScheduleStatus.CANCELADO)
            .count();
        if (scheduledClasses > 0) {
            report.setAttendanceRate(
                (double) report.getCompletedClasses() / scheduledClasses * 100
            );
        }
        
        return report;
    }
    
    public ReportDTO.FinancialReport generateFinancialReport(LocalDate startDate, LocalDate endDate) {
        ReportDTO.FinancialReport report = new ReportDTO.FinancialReport();
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        
        List<Schedule> schedules = scheduleRepository.findByDateBetween(startDate, endDate);
        
        // Receita total
        BigDecimal totalRevenue = schedules.stream()
            .filter(s -> s.getPaymentStatus() == Schedule.PaymentStatus.PAGO)
            .map(Schedule::getPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.setTotalRevenue(totalRevenue);
        
        // Total de aulas
        report.setTotalClasses((long) schedules.size());
        
        // Preço médio por aula
        if (report.getTotalClasses() > 0) {
            report.setAverageClassPrice(
                totalRevenue.divide(BigDecimal.valueOf(report.getTotalClasses()), 2, RoundingMode.HALF_UP)
            );
        }
        
        // Receita por tipo de aula
        Map<String, BigDecimal> revenueByType = schedules.stream()
            .filter(s -> s.getPaymentStatus() == Schedule.PaymentStatus.PAGO)
            .collect(Collectors.groupingBy(
                Schedule::getType,
                Collectors.reducing(BigDecimal.ZERO, Schedule::getPrice, BigDecimal::add)
            ));
        report.setRevenueByClassType(revenueByType);
        
        // Receita por instrutor
        Map<String, BigDecimal> revenueByInstructor = schedules.stream()
            .filter(s -> s.getPaymentStatus() == Schedule.PaymentStatus.PAGO)
            .collect(Collectors.groupingBy(
                s -> s.getInstructor().getName(),
                Collectors.reducing(BigDecimal.ZERO, Schedule::getPrice, BigDecimal::add)
            ));
        report.setRevenueByInstructor(revenueByInstructor);
        
        // Resumo de pagamentos
        List<ReportDTO.PaymentStatusSummary> paymentSummary = Arrays.stream(Schedule.PaymentStatus.values())
            .map(status -> {
                List<Schedule> statusSchedules = schedules.stream()
                    .filter(s -> s.getPaymentStatus() == status)
                    .toList();
                
                ReportDTO.PaymentStatusSummary summary = new ReportDTO.PaymentStatusSummary();
                summary.setStatus(status.name());
                summary.setCount((long) statusSchedules.size());
                summary.setAmount(
                    statusSchedules.stream()
                        .map(Schedule::getPrice)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                );
                summary.setPercentage(
                    schedules.isEmpty() ? 0.0 : (double) statusSchedules.size() / schedules.size() * 100
                );
                
                return summary;
            })
            .toList();
        report.setPaymentSummary(paymentSummary);
        
        return report;
    }
    
    public ReportDTO.AttendanceReport generateAttendanceReport(LocalDate startDate, LocalDate endDate) {
        ReportDTO.AttendanceReport report = new ReportDTO.AttendanceReport();
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        
        List<Schedule> schedules = scheduleRepository.findByDateBetween(startDate, endDate);
        
        // Estatísticas gerais
        report.setTotalScheduled((long) schedules.size());
        report.setTotalCompleted(
            schedules.stream()
                .filter(s -> s.getStatus() == Schedule.ScheduleStatus.CONCLUIDO)
                .count()
        );
        report.setTotalCanceled(
            schedules.stream()
                .filter(s -> s.getStatus() == Schedule.ScheduleStatus.CANCELADO)
                .count()
        );
        report.setTotalNoShows(
            schedules.stream()
                .filter(s -> s.getStatus() == Schedule.ScheduleStatus.FALTA)
                .count()
        );
        
        // Taxa geral de comparecimento
        if (report.getTotalScheduled() > 0) {
            report.setOverallAttendanceRate(
                (double) report.getTotalCompleted() / report.getTotalScheduled() * 100
            );
        }
        
        return report;
    }
    
    public ReportDTO.StudentProgress generateStudentProgressReport(Long studentId) {
        ReportDTO.StudentProgress report = new ReportDTO.StudentProgress();
        
        // Buscar dados do aluno
        var student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        
        report.setStudentId(studentId);
        report.setStudentName(student.getName());
        report.setStartDate(student.getRegistrationDate());
        
        // Buscar fichas de evolução
        var evolutionRecords = evolutionRecordRepository.findByStudentIdOrderByDateDesc(studentId);
        report.setTotalSessions(evolutionRecords.size());
        
        if (!evolutionRecords.isEmpty()) {
            // Avaliação média
            Double averageRating = evolutionRecords.stream()
                .filter(r -> r.getOverallRating() != null)
                .mapToInt(r -> r.getOverallRating())
                .average()
                .orElse(0.0);
            report.setAverageRating(averageRating);
            
            // Último foco e sessão
            var lastRecord = evolutionRecords.get(0);
            report.setLastFocus(lastRecord.getFocus());
            report.setLastSession(lastRecord.getDate());
            
            // Calcular score de progresso (baseado na melhoria das avaliações)
            if (evolutionRecords.size() > 1) {
                var firstRecord = evolutionRecords.get(evolutionRecords.size() - 1);
                var lastRecordRating = lastRecord.getOverallRating() != null ? lastRecord.getOverallRating() : 0;
                var firstRecordRating = firstRecord.getOverallRating() != null ? firstRecord.getOverallRating() : 0;
                
                double progressScore = ((double) (lastRecordRating - firstRecordRating) / 5.0) * 100;
                report.setProgressScore(Math.max(0, Math.min(100, progressScore + 50))); // Normalizar entre 0-100
            }
        }
        
        return report;
    }
}