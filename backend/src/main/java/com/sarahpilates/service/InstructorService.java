package com.sarahpilates.service;

import com.sarahpilates.entity.Instructor;
import com.sarahpilates.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class InstructorService {
    
    private final InstructorRepository instructorRepository;
    
    public List<Instructor> findAll() {
        return instructorRepository.findAll();
    }
    
    public Page<Instructor> findAll(Pageable pageable) {
        return instructorRepository.findAll(pageable);
    }
    
    public Optional<Instructor> findById(Long id) {
        return instructorRepository.findById(id);
    }
    
    public Optional<Instructor> findByEmail(String email) {
        return instructorRepository.findByEmail(email);
    }
    
    public Optional<Instructor> findByCpf(String cpf) {
        return instructorRepository.findByCpf(cpf);
    }
    
    public List<Instructor> findByStatus(Instructor.InstructorStatus status) {
        return instructorRepository.findByStatus(status);
    }
    
    public Page<Instructor> search(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return instructorRepository.findAll(pageable);
        }
        return instructorRepository.findBySearchTerm(searchTerm.trim(), pageable);
    }
    
    public Page<Instructor> searchByStatus(Instructor.InstructorStatus status, String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return instructorRepository.findAll(pageable);
        }
        return instructorRepository.findByStatusAndSearchTerm(status, searchTerm.trim(), pageable);
    }
    
    public Instructor save(Instructor instructor) {
        // Verificar se email já existe
        if (instructor.getId() == null && instructorRepository.findByEmail(instructor.getEmail()).isPresent()) {
            throw new RuntimeException("Email já está em uso");
        }
        
        // Verificar se CPF já existe
        if (instructor.getId() == null && instructorRepository.findByCpf(instructor.getCpf()).isPresent()) {
            throw new RuntimeException("CPF já está em uso");
        }
        
        // Verificar se email já existe para outro instrutor (na edição)
        if (instructor.getId() != null) {
            Optional<Instructor> existingInstructor = instructorRepository.findByEmail(instructor.getEmail());
            if (existingInstructor.isPresent() && !existingInstructor.get().getId().equals(instructor.getId())) {
                throw new RuntimeException("Email já está em uso");
            }
            
            Optional<Instructor> existingCpf = instructorRepository.findByCpf(instructor.getCpf());
            if (existingCpf.isPresent() && !existingCpf.get().getId().equals(instructor.getId())) {
                throw new RuntimeException("CPF já está em uso");
            }
        }
        
        return instructorRepository.save(instructor);
    }
    
    public Instructor update(Long id, Instructor instructorDetails) {
        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        
        // Verificar se email já existe para outro instrutor
        Optional<Instructor> existingInstructor = instructorRepository.findByEmail(instructorDetails.getEmail());
        if (existingInstructor.isPresent() && !existingInstructor.get().getId().equals(id)) {
            throw new RuntimeException("Email já está em uso");
        }
        
        // Verificar se CPF já existe para outro instrutor
        Optional<Instructor> existingCpf = instructorRepository.findByCpf(instructorDetails.getCpf());
        if (existingCpf.isPresent() && !existingCpf.get().getId().equals(id)) {
            throw new RuntimeException("CPF já está em uso");
        }
        
        instructor.setName(instructorDetails.getName());
        instructor.setEmail(instructorDetails.getEmail());
        instructor.setPhone(instructorDetails.getPhone());
        instructor.setBirthDate(instructorDetails.getBirthDate());
        instructor.setAddress(instructorDetails.getAddress());
        instructor.setCpf(instructorDetails.getCpf());
        instructor.setRg(instructorDetails.getRg());
        instructor.setCrefNumber(instructorDetails.getCrefNumber());
        instructor.setSpecializations(instructorDetails.getSpecializations());
        instructor.setSalary(instructorDetails.getSalary());
        instructor.setHourlyRate(instructorDetails.getHourlyRate());
        instructor.setStatus(instructorDetails.getStatus());
        instructor.setNotes(instructorDetails.getNotes());
        
        return instructorRepository.save(instructor);
    }
    
    public void deleteById(Long id) {
        if (!instructorRepository.existsById(id)) {
            throw new RuntimeException("Instrutor não encontrado");
        }
        instructorRepository.deleteById(id);
    }
    
    public Long countActiveInstructors() {
        return instructorRepository.countActiveInstructors();
    }
    
    public void incrementTotalClasses(Long instructorId) {
        Instructor instructor = instructorRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        instructor.setTotalClasses(instructor.getTotalClasses() + 1);
        instructorRepository.save(instructor);
    }
    
    public void incrementTotalStudents(Long instructorId) {
        Instructor instructor = instructorRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        instructor.setTotalStudents(instructor.getTotalStudents() + 1);
        instructorRepository.save(instructor);
    }
}