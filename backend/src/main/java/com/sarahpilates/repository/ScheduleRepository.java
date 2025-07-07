package com.sarahpilates.repository;

import com.sarahpilates.entity.Schedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    List<Schedule> findByDate(LocalDate date);
    
    List<Schedule> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Schedule> findByStudentId(Long studentId);
    
    List<Schedule> findByInstructorId(Long instructorId);
    
    List<Schedule> findByStatus(Schedule.ScheduleStatus status);
    
    @Query("SELECT s FROM Schedule s WHERE s.date = :date AND s.status IN :statuses")
    List<Schedule> findByDateAndStatusIn(@Param("date") LocalDate date, 
                                        @Param("statuses") List<Schedule.ScheduleStatus> statuses);
    
    @Query("SELECT s FROM Schedule s WHERE s.instructor.id = :instructorId AND s.date = :date AND " +
           "((s.startTime <= :startTime AND s.endTime > :startTime) OR " +
           "(s.startTime < :endTime AND s.endTime >= :endTime) OR " +
           "(s.startTime >= :startTime AND s.endTime <= :endTime)) AND " +
           "s.status NOT IN ('CANCELADO')")
    List<Schedule> findConflictingSchedules(@Param("instructorId") Long instructorId,
                                           @Param("date") LocalDate date,
                                           @Param("startTime") LocalTime startTime,
                                           @Param("endTime") LocalTime endTime);
    
    @Query("SELECT s FROM Schedule s WHERE " +
           "LOWER(s.student.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.instructor.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.type) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.room) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Schedule> findBySearchTerm(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT COUNT(s) FROM Schedule s WHERE s.date = :date AND s.status = 'CONFIRMADO'")
    Long countConfirmedSchedulesForDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(s) FROM Schedule s WHERE s.status = 'CONCLUIDO' AND " +
           "s.date BETWEEN :startDate AND :endDate")
    Long countCompletedClassesBetweenDates(@Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(s.price) FROM Schedule s WHERE s.paymentStatus = 'PAGO' AND " +
           "s.date BETWEEN :startDate AND :endDate")
    Double calculateRevenueBetweenDates(@Param("startDate") LocalDate startDate, 
                                       @Param("endDate") LocalDate endDate);
}