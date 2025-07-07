package com.sarahpilates.repository;

import com.sarahpilates.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByEmail(String email);
    
    List<Student> findByStatus(Student.StudentStatus status);
    
    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.phone) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Student> findBySearchTerm(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT s FROM Student s WHERE s.status = :status AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.phone) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Student> findByStatusAndSearchTerm(@Param("status") Student.StudentStatus status, 
                                           @Param("search") String search, 
                                           Pageable pageable);
    
    @Query("SELECT COUNT(s) FROM Student s WHERE s.status = 'ATIVO'")
    Long countActiveStudents();
    
    @Query("SELECT s.plan, COUNT(s) FROM Student s WHERE s.status = 'ATIVO' GROUP BY s.plan")
    List<Object[]> countStudentsByPlan();
}