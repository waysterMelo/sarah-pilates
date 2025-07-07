package com.sarahpilates.controller;

import com.sarahpilates.entity.Schedule;
import com.sarahpilates.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/schedules")
@RequiredArgsConstructor
@Tag(name = "Schedules", description = "Gestão de Agendamentos")
@CrossOrigin(origins = "*")
public class ScheduleController {
    
    private final ScheduleService scheduleService;
    
    @GetMapping
    @Operation(summary = "Listar todos os agendamentos")
    public ResponseEntity<Page<Schedule>> getAllSchedules(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        
        Page<Schedule> schedules;
        
        if (search != null && !search.trim().isEmpty()) {
            schedules = scheduleService.search(search, pageable);
        } else {
            schedules = scheduleService.findAll(pageable);
        }
        
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Buscar agendamento por ID")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long id) {
        return scheduleService.findById(id)
                .map(schedule -> ResponseEntity.ok(schedule))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/date/{date}")
    @Operation(summary = "Buscar agendamentos por data")
    public ResponseEntity<List<Schedule>> getSchedulesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Schedule> schedules = scheduleService.findByDate(date);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/date-range")
    @Operation(summary = "Buscar agendamentos por período")
    public ResponseEntity<List<Schedule>> getSchedulesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Schedule> schedules = scheduleService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/student/{studentId}")
    @Operation(summary = "Buscar agendamentos por aluno")
    public ResponseEntity<List<Schedule>> getSchedulesByStudent(@PathVariable Long studentId) {
        List<Schedule> schedules = scheduleService.findByStudentId(studentId);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/instructor/{instructorId}")
    @Operation(summary = "Buscar agendamentos por instrutor")
    public ResponseEntity<List<Schedule>> getSchedulesByInstructor(@PathVariable Long instructorId) {
        List<Schedule> schedules = scheduleService.findByInstructorId(instructorId);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Buscar agendamentos por status")
    public ResponseEntity<List<Schedule>> getSchedulesByStatus(@PathVariable Schedule.ScheduleStatus status) {
        List<Schedule> schedules = scheduleService.findByStatus(status);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/today")
    @Operation(summary = "Buscar agendamentos de hoje")
    public ResponseEntity<List<Schedule>> getTodaySchedules() {
        List<Schedule> schedules = scheduleService.getTodaySchedules();
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/upcoming")
    @Operation(summary = "Buscar próximos agendamentos")
    public ResponseEntity<List<Schedule>> getUpcomingSchedules() {
        List<Schedule> schedules = scheduleService.getUpcomingSchedules();
        return ResponseEntity.ok(schedules);
    }
    
    @PostMapping
    @Operation(summary = "Criar novo agendamento")
    public ResponseEntity<Schedule> createSchedule(@Valid @RequestBody Schedule schedule) {
        Schedule savedSchedule = scheduleService.save(schedule);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSchedule);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar agendamento")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Long id, @Valid @RequestBody Schedule schedule) {
        Schedule updatedSchedule = scheduleService.update(id, schedule);
        return ResponseEntity.ok(updatedSchedule);
    }
    
    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status do agendamento")
    public ResponseEntity<Schedule> updateScheduleStatus(@PathVariable Long id, @RequestParam Schedule.ScheduleStatus status) {
        Schedule updatedSchedule = scheduleService.updateStatus(id, status);
        return ResponseEntity.ok(updatedSchedule);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir agendamento")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats/confirmed-today")
    @Operation(summary = "Contar agendamentos confirmados hoje")
    public ResponseEntity<Long> getConfirmedSchedulesToday() {
        Long count = scheduleService.countConfirmedSchedulesForDate(LocalDate.now());
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/completed-classes")
    @Operation(summary = "Contar aulas concluídas no período")
    public ResponseEntity<Long> getCompletedClasses(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long count = scheduleService.countCompletedClassesBetweenDates(startDate, endDate);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/revenue")
    @Operation(summary = "Calcular receita no período")
    public ResponseEntity<Double> getRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Double revenue = scheduleService.calculateRevenueBetweenDates(startDate, endDate);
        return ResponseEntity.ok(revenue);
    }
}