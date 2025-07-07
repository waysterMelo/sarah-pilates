package com.sarahpilates.controller;

import com.sarahpilates.dto.ReportDTO;
import com.sarahpilates.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Relatórios e Analytics")
@CrossOrigin(origins = "*")
public class ReportController {
    
    private final ReportService reportService;
    
    @GetMapping("/monthly")
    @Operation(summary = "Relatório mensal")
    public ResponseEntity<ReportDTO.MonthlyReport> getMonthlyReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate month) {
        ReportDTO.MonthlyReport report = reportService.generateMonthlyReport(month);
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/financial")
    @Operation(summary = "Relatório financeiro")
    public ResponseEntity<ReportDTO.FinancialReport> getFinancialReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        ReportDTO.FinancialReport report = reportService.generateFinancialReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/attendance")
    @Operation(summary = "Relatório de frequência")
    public ResponseEntity<ReportDTO.AttendanceReport> getAttendanceReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        ReportDTO.AttendanceReport report = reportService.generateAttendanceReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/student-progress/{studentId}")
    @Operation(summary = "Relatório de progresso do aluno")
    public ResponseEntity<ReportDTO.StudentProgress> getStudentProgressReport(@PathVariable Long studentId) {
        ReportDTO.StudentProgress report = reportService.generateStudentProgressReport(studentId);
        return ResponseEntity.ok(report);
    }
}