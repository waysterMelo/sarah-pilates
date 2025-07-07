package com.sarahpilates.controller;

import com.sarahpilates.dto.DashboardStats;
import com.sarahpilates.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard e Estatísticas")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    private final StudentService studentService;
    private final InstructorService instructorService;
    private final ScheduleService scheduleService;
    private final PhysicalEvaluationService physicalEvaluationService;
    private final EvolutionRecordService evolutionRecordService;
    
    @GetMapping("/stats")
    @Operation(summary = "Obter estatísticas do dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());
        
        DashboardStats stats = new DashboardStats();
        
        // Estatísticas básicas
        stats.setTotalStudents(studentService.countActiveStudents());
        stats.setTotalInstructors(instructorService.countActiveInstructors());
        stats.setTodaySchedules(scheduleService.countConfirmedSchedulesForDate(today));
        stats.setMonthlyRevenue(scheduleService.calculateRevenueBetweenDates(startOfMonth, endOfMonth));
        stats.setCompletedClasses(scheduleService.countCompletedClassesBetweenDates(startOfMonth, endOfMonth));
        
        // Agendamentos de hoje
        stats.setTodaySchedulesList(scheduleService.getTodaySchedules());
        
        // Próximos agendamentos
        stats.setUpcomingSchedules(scheduleService.getUpcomingSchedules());
        
        return ResponseEntity.ok(stats);
    }
}