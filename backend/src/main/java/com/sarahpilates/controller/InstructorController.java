package com.sarahpilates.controller;

import com.sarahpilates.entity.Instructor;
import com.sarahpilates.service.InstructorService;
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
@RequestMapping("/instructors")
@RequiredArgsConstructor
@Tag(name = "Instructors", description = "Gestão de Instrutores")
@CrossOrigin(origins = "*")
public class InstructorController {
    
    private final InstructorService instructorService;
    
    @GetMapping
    @Operation(summary = "Listar todos os instrutores")
    public ResponseEntity<Page<Instructor>> getAllInstructors(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Instructor.InstructorStatus status,
            Pageable pageable) {
        
        Page<Instructor> instructors;
        
        if (status != null && search != null && !search.trim().isEmpty()) {
            instructors = instructorService.searchByStatus(status, search, pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            instructors = instructorService.search(search, pageable);
        } else {
            instructors = instructorService.findAll(pageable);
        }
        
        return ResponseEntity.ok(instructors);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Buscar instrutor por ID")
    public ResponseEntity<Instructor> getInstructorById(@PathVariable Long id) {
        return instructorService.findById(id)
                .map(instructor -> ResponseEntity.ok(instructor))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/email/{email}")
    @Operation(summary = "Buscar instrutor por email")
    public ResponseEntity<Instructor> getInstructorByEmail(@PathVariable String email) {
        return instructorService.findByEmail(email)
                .map(instructor -> ResponseEntity.ok(instructor))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/cpf/{cpf}")
    @Operation(summary = "Buscar instrutor por CPF")
    public ResponseEntity<Instructor> getInstructorByCpf(@PathVariable String cpf) {
        return instructorService.findByCpf(cpf)
                .map(instructor -> ResponseEntity.ok(instructor))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Listar instrutores por status")
    public ResponseEntity<List<Instructor>> getInstructorsByStatus(@PathVariable Instructor.InstructorStatus status) {
        List<Instructor> instructors = instructorService.findByStatus(status);
        return ResponseEntity.ok(instructors);
    }
    
    @PostMapping
    @Operation(summary = "Criar novo instrutor")
    public ResponseEntity<Instructor> createInstructor(@Valid @RequestBody Instructor instructor) {
        Instructor savedInstructor = instructorService.save(instructor);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedInstructor);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar instrutor")
    public ResponseEntity<Instructor> updateInstructor(@PathVariable Long id, @Valid @RequestBody Instructor instructor) {
        Instructor updatedInstructor = instructorService.update(id, instructor);
        return ResponseEntity.ok(updatedInstructor);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir instrutor")
    public ResponseEntity<Void> deleteInstructor(@PathVariable Long id) {
        instructorService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats/active-count")
    @Operation(summary = "Contar instrutores ativos")
    public ResponseEntity<Long> getActiveInstructorsCount() {
        Long count = instructorService.countActiveInstructors();
        return ResponseEntity.ok(count);
    }
}