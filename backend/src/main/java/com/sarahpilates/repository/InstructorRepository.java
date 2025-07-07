package com.sarahpilates.repository;

import com.sarahpilates.entity.Instructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstructorRepository extends JpaRepository<Instructor, Long> {
    
    Optional<Instructor> findByEmail(String email);
    
    Optional<Instructor> findByCpf(String cpf);
    
    List<Instructor> findByStatus(Instructor.InstructorStatus status);
    
    @Query("SELECT i FROM Instructor i WHERE " +
           "LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.phone) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Instructor> findBySearchTerm(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT i FROM Instructor i WHERE i.status = :status AND " +
           "(LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.phone) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Instructor> findByStatusAndSearchTerm(@Param("status") Instructor.InstructorStatus status, 
                                              @Param("search") String search, 
                                              Pageable pageable);
    
    @Query("SELECT COUNT(i) FROM Instructor i WHERE i.status = 'ATIVO'")
    Long countActiveInstructors();
}