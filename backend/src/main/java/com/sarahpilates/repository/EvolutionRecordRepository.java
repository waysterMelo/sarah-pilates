package com.sarahpilates.repository;

import com.sarahpilates.entity.EvolutionRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EvolutionRecordRepository extends JpaRepository<EvolutionRecord, Long> {
    
    List<EvolutionRecord> findByStudentId(Long studentId);
    
    List<EvolutionRecord> findByInstructorId(Long instructorId);
    
    List<EvolutionRecord> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT er FROM EvolutionRecord er WHERE " +
           "LOWER(er.student.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(er.instructor.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(er.focus) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<EvolutionRecord> findBySearchTerm(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT er FROM EvolutionRecord er WHERE er.student.id = :studentId " +
           "ORDER BY er.date DESC, er.session DESC")
    List<EvolutionRecord> findByStudentIdOrderByDateDesc(@Param("studentId") Long studentId);
    
    @Query("SELECT MAX(er.session) FROM EvolutionRecord er WHERE er.student.id = :studentId")
    Integer findMaxSessionByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT COUNT(er) FROM EvolutionRecord er WHERE er.date = :date")
    Long countByDate(@Param("date") LocalDate date);
    
    @Query("SELECT AVG(er.overallRating) FROM EvolutionRecord er WHERE er.student.id = :studentId")
    Double getAverageRatingByStudentId(@Param("studentId") Long studentId);
}