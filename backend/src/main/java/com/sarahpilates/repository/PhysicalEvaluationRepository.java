package com.sarahpilates.repository;

import com.sarahpilates.entity.PhysicalEvaluation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PhysicalEvaluationRepository extends JpaRepository<PhysicalEvaluation, Long> {
    
    List<PhysicalEvaluation> findByStudentId(Long studentId);
    
    List<PhysicalEvaluation> findByInstructorId(Long instructorId);
    
    List<PhysicalEvaluation> findByType(PhysicalEvaluation.EvaluationType type);
    
    List<PhysicalEvaluation> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT pe FROM PhysicalEvaluation pe WHERE " +
           "LOWER(pe.student.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(pe.instructor.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<PhysicalEvaluation> findBySearchTerm(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT pe FROM PhysicalEvaluation pe WHERE pe.type = :type AND " +
           "(LOWER(pe.student.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(pe.instructor.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<PhysicalEvaluation> findByTypeAndSearchTerm(@Param("type") PhysicalEvaluation.EvaluationType type, 
                                                     @Param("search") String search, 
                                                     Pageable pageable);
    
    @Query("SELECT pe FROM PhysicalEvaluation pe WHERE pe.student.id = :studentId " +
           "ORDER BY pe.date DESC")
    List<PhysicalEvaluation> findByStudentIdOrderByDateDesc(@Param("studentId") Long studentId);
    
    @Query("SELECT COUNT(pe) FROM PhysicalEvaluation pe WHERE pe.type = :type")
    Long countByType(@Param("type") PhysicalEvaluation.EvaluationType type);
}