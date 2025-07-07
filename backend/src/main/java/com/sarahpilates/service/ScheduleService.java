package com.sarahpilates.service;

import com.sarahpilates.entity.Schedule;
import com.sarahpilates.entity.Student;
import com.sarahpilates.entity.Instructor;
import com.sarahpilates.repository.ScheduleRepository;
import com.sarahpilates.repository.StudentRepository;
import com.sarahpilates.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ScheduleService {
    
    private final ScheduleRepository scheduleRepository;
    private final StudentRepository studentRepository;
    private final InstructorRepository instructorRepository;
    private final StudentService studentService;
    private final InstructorService instructorService;
    
    public List<Schedule> findAll() {
        return scheduleRepository.findAll();
    }
    
    public Page<Schedule> findAll(Pageable pageable) {
        return scheduleRepository.findAll(pageable);
    }
    
    public Optional<Schedule> findById(Long id) {
        return scheduleRepository.findById(id);
    }
    
    public List<Schedule> findByDate(LocalDate date) {
        return scheduleRepository.findByDate(date);
    }
    
    public List<Schedule> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return scheduleRepository.findByDateBetween(startDate, endDate);
    }
    
    public List<Schedule> findByStudentId(Long studentId) {
        return scheduleRepository.findByStudentId(studentId);
    }
    
    public List<Schedule> findByInstructorId(Long instructorId) {
        return scheduleRepository.findByInstructorId(instructorId);
    }
    
    public List<Schedule> findByStatus(Schedule.ScheduleStatus status) {
        return scheduleRepository.findByStatus(status);
    }
    
    public Page<Schedule> search(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return scheduleRepository.findAll(pageable);
        }
        return scheduleRepository.findBySearchTerm(searchTerm.trim(), pageable);
    }
    
    public Schedule save(Schedule schedule) {
        // Validar se o aluno existe
        Student student = studentRepository.findById(schedule.getStudent().getId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        
        // Validar se o instrutor existe
        Instructor instructor = instructorRepository.findById(schedule.getInstructor().getId())
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        
        // Verificar conflitos de horário para o instrutor
        List<Schedule> conflicts = scheduleRepository.findConflictingSchedules(
                instructor.getId(), 
                schedule.getDate(), 
                schedule.getStartTime(), 
                schedule.getEndTime()
        );
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Instrutor já possui agendamento neste horário");
        }
        
        schedule.setStudent(student);
        schedule.setInstructor(instructor);
        
        return scheduleRepository.save(schedule);
    }
    
    public Schedule update(Long id, Schedule scheduleDetails) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
        
        // Validar se o aluno existe
        Student student = studentRepository.findById(scheduleDetails.getStudent().getId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        
        // Validar se o instrutor existe
        Instructor instructor = instructorRepository.findById(scheduleDetails.getInstructor().getId())
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        
        // Verificar conflitos de horário para o instrutor (excluindo o agendamento atual)
        List<Schedule> conflicts = scheduleRepository.findConflictingSchedules(
                instructor.getId(), 
                scheduleDetails.getDate(), 
                scheduleDetails.getStartTime(), 
                scheduleDetails.getEndTime()
        );
        
        conflicts.removeIf(conflict -> conflict.getId().equals(id));
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Instrutor já possui agendamento neste horário");
        }
        
        schedule.setStudent(student);
        schedule.setInstructor(instructor);
        schedule.setDate(scheduleDetails.getDate());
        schedule.setStartTime(scheduleDetails.getStartTime());
        schedule.setEndTime(scheduleDetails.getEndTime());
        schedule.setType(scheduleDetails.getType());
        schedule.setStatus(scheduleDetails.getStatus());
        schedule.setNotes(scheduleDetails.getNotes());
        schedule.setRoom(scheduleDetails.getRoom());
        schedule.setEquipment(scheduleDetails.getEquipment());
        schedule.setPrice(scheduleDetails.getPrice());
        schedule.setPaymentStatus(scheduleDetails.getPaymentStatus());
        
        return scheduleRepository.save(schedule);
    }
    
    public Schedule updateStatus(Long id, Schedule.ScheduleStatus status) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
        
        Schedule.ScheduleStatus oldStatus = schedule.getStatus();
        schedule.setStatus(status);
        
        // Se a aula foi concluída, incrementar contadores
        if (status == Schedule.ScheduleStatus.CONCLUIDO && oldStatus != Schedule.ScheduleStatus.CONCLUIDO) {
            studentService.incrementTotalClasses(schedule.getStudent().getId());
            instructorService.incrementTotalClasses(schedule.getInstructor().getId());
        }
        
        return scheduleRepository.save(schedule);
    }
    
    public void deleteById(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new RuntimeException("Agendamento não encontrado");
        }
        scheduleRepository.deleteById(id);
    }
    
    public Long countConfirmedSchedulesForDate(LocalDate date) {
        return scheduleRepository.countConfirmedSchedulesForDate(date);
    }
    
    public Long countCompletedClassesBetweenDates(LocalDate startDate, LocalDate endDate) {
        return scheduleRepository.countCompletedClassesBetweenDates(startDate, endDate);
    }
    
    public Double calculateRevenueBetweenDates(LocalDate startDate, LocalDate endDate) {
        Double revenue = scheduleRepository.calculateRevenueBetweenDates(startDate, endDate);
        return revenue != null ? revenue : 0.0;
    }
    
    public List<Schedule> getTodaySchedules() {
        return findByDate(LocalDate.now());
    }
    
    public List<Schedule> getUpcomingSchedules() {
        return scheduleRepository.findByDateAndStatusIn(
                LocalDate.now().plusDays(1), 
                List.of(Schedule.ScheduleStatus.AGENDADO, Schedule.ScheduleStatus.CONFIRMADO)
        );
    }
}