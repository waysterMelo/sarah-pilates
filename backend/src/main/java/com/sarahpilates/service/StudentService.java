package com.sarahpilates.service;

import com.sarahpilates.entity.Student;
import com.sarahpilates.repository.StudentRepository;
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
public class StudentService {
    
    private final StudentRepository studentRepository;
    
    public List<Student> findAll() {
        return studentRepository.findAll();
    }
    
    public Page<Student> findAll(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }
    
    public Optional<Student> findById(Long id) {
        return studentRepository.findById(id);
    }
    
    public Optional<Student> findByEmail(String email) {
        return studentRepository.findByEmail(email);
    }
    
    public List<Student> findByStatus(Student.StudentStatus status) {
        return studentRepository.findByStatus(status);
    }
    
    public Page<Student> search(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return studentRepository.findAll(pageable);
        }
        return studentRepository.findBySearchTerm(searchTerm.trim(), pageable);
    }
    
    public Page<Student> searchByStatus(Student.StudentStatus status, String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return studentRepository.findAll(pageable);
        }
        return studentRepository.findByStatusAndSearchTerm(status, searchTerm.trim(), pageable);
    }
    
    public Student save(Student student) {
        // Verificar se email já existe
        if (student.getId() == null && studentRepository.findByEmail(student.getEmail()).isPresent()) {
            throw new RuntimeException("Email já está em uso");
        }
        
        // Verificar se email já existe para outro estudante (na edição)
        if (student.getId() != null) {
            Optional<Student> existingStudent = studentRepository.findByEmail(student.getEmail());
            if (existingStudent.isPresent() && !existingStudent.get().getId().equals(student.getId())) {
                throw new RuntimeException("Email já está em uso");
            }
        }
        
        return studentRepository.save(student);
    }
    
    public Student update(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        
        // Verificar se email já existe para outro estudante
        Optional<Student> existingStudent = studentRepository.findByEmail(studentDetails.getEmail());
        if (existingStudent.isPresent() && !existingStudent.get().getId().equals(id)) {
            throw new RuntimeException("Email já está em uso");
        }
        
        student.setName(studentDetails.getName());
        student.setEmail(studentDetails.getEmail());
        student.setPhone(studentDetails.getPhone());
        student.setBirthDate(studentDetails.getBirthDate());
        student.setAddress(studentDetails.getAddress());
        student.setEmergencyContact(studentDetails.getEmergencyContact());
        student.setEmergencyPhone(studentDetails.getEmergencyPhone());
        student.setMedicalHistory(studentDetails.getMedicalHistory());
        student.setObjectives(studentDetails.getObjectives());
        student.setPlan(studentDetails.getPlan());
        student.setStatus(studentDetails.getStatus());
        
        return studentRepository.save(student);
    }
    
    public void deleteById(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Aluno não encontrado");
        }
        studentRepository.deleteById(id);
    }
    
    public Long countActiveStudents() {
        return studentRepository.countActiveStudents();
    }
    
    public List<Object[]> getStudentsByPlan() {
        return studentRepository.countStudentsByPlan();
    }
    
    public void incrementTotalClasses(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        student.setTotalClasses(student.getTotalClasses() + 1);
        studentRepository.save(student);
    }
}