package com.sarahpilates.controller;

import com.sarahpilates.entity.Student;
import com.sarahpilates.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Gestão de Alunos")
@CrossOrigin(origins = "*")
public class StudentController {
    
    private final StudentService studentService;
    
    @GetMapping
    @Operation(summary = "Listar todos os alunos")
    public ResponseEntity<Page<Student>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Student.StudentStatus status,
            Pageable pageable) {
        
        Page<Student> students;
        
        if (status != null && search != null && !search.trim().isEmpty()) {
            students = studentService.searchByStatus(status, search, pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            students = studentService.search(search, pageable);
        } else {
            students = studentService.findAll(pageable);
        }
        
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Buscar aluno por ID")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentService.findById(id)
                .map(student -> ResponseEntity.ok(student))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/email/{email}")
    @Operation(summary = "Buscar aluno por email")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        return studentService.findByEmail(email)
                .map(student -> ResponseEntity.ok(student))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Listar alunos por status")
    public ResponseEntity<List<Student>> getStudentsByStatus(@PathVariable Student.StudentStatus status) {
        List<Student> students = studentService.findByStatus(status);
        return ResponseEntity.ok(students);
    }
    
    @PostMapping
    @Operation(summary = "Criar novo aluno")
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        Student savedStudent = studentService.save(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar aluno")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @Valid @RequestBody Student student) {
        Student updatedStudent = studentService.update(id, student);
        return ResponseEntity.ok(updatedStudent);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir aluno")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats/active-count")
    @Operation(summary = "Contar alunos ativos")
    public ResponseEntity<Long> getActiveStudentsCount() {
        Long count = studentService.countActiveStudents();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/by-plan")
    @Operation(summary = "Estatísticas por plano")
    public ResponseEntity<List<Object[]>> getStudentsByPlan() {
        List<Object[]> stats = studentService.getStudentsByPlan();
        return ResponseEntity.ok(stats);
    }
}