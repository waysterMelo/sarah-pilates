package com.sarahpilates.controller;

import com.sarahpilates.entity.PhysicalEvaluation;
import com.sarahpilates.service.PhysicalEvaluationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/physical-evaluations")
@RequiredArgsConstructor
@Tag(name = "Physical Evaluations", description = "Gestão de Avaliações Físicas")
@CrossOrigin(origins = "*")
public class PhysicalEvaluationController {
    
    private final PhysicalEvaluationService physicalEvaluationService;
    
    @GetMapping
    @Operation(summary = "Listar todas as avaliações físicas")
    public ResponseEntity<Page<PhysicalEvaluation>> getAllEvaluations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) PhysicalEvaluation.EvaluationType type,
            Pageable pageable) {
        
        Page<PhysicalEvaluation> evaluations;
        
        if (type != null && search != null && !search.trim().isEmpty()) {
            evaluations = physicalEvaluationService.searchByType(type, search, pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            evaluations = physicalEvaluationService.search(search, pageable);
        } else {
            evaluations = physicalEvaluationService.findAll(pageable);
        }
        
        return ResponseEntity.ok(evaluations);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Buscar avaliação física por ID")
    public ResponseEntity<PhysicalEvaluation> getEvaluationById(@PathVariable Long id) {
        return physicalEvaluationService.findById(id)
                .map(evaluation -> ResponseEntity.ok(evaluation))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/student/{studentId}")
    @Operation(summary = "Buscar avaliações por aluno")
    public ResponseEntity<List<PhysicalEvaluation>> getEvaluationsByStudent(@PathVariable Long studentId) {
        List<PhysicalEvaluation> evaluations = physicalEvaluationService.findByStudentId(studentId);
        return ResponseEntity.ok(evaluations);
    }
    
    @GetMapping("/student/{studentId}/history")
    @Operation(summary = "Histórico de avaliações do aluno")
    public ResponseEntity<List<PhysicalEvaluation>> getStudentEvaluationHistory(@PathVariable Long studentId) {
        List<PhysicalEvaluation> evaluations = physicalEvaluationService.getStudentEvaluationHistory(studentId);
        return ResponseEntity.ok(evaluations);
    }
    
    @GetMapping("/instructor/{instructorId}")
    @Operation(summary = "Buscar avaliações por instrutor")
    public ResponseEntity<List<PhysicalEvaluation>> getEvaluationsByInstructor(@PathVariable Long instructorId) {
        List<PhysicalEvaluation> evaluations = physicalEvaluationService.findByInstructorId(instructorId);
        return ResponseEntity.ok(evaluations);
    }
    
    @GetMapping("/type/{type}")
    @Operation(summary = "Buscar avaliações por tipo")
    public ResponseEntity<List<PhysicalEvaluation>> getEvaluationsByType(@PathVariable PhysicalEvaluation.EvaluationType type) {
        List<PhysicalEvaluation> evaluations = physicalEvaluationService.findByType(type);
        return ResponseEntity.ok(evaluations);
    }
    
    @GetMapping("/date-range")
    @Operation(summary = "Buscar avaliações por período")
    public ResponseEntity<List<PhysicalEvaluation>> getEvaluationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<PhysicalEvaluation> evaluations = physicalEvaluationService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(evaluations);
    }
    
    @PostMapping
    @Operation(summary = "Criar nova avaliação física")
    public ResponseEntity<PhysicalEvaluation> createEvaluation(@Valid @RequestBody PhysicalEvaluation evaluation) {
        PhysicalEvaluation savedEvaluation = physicalEvaluationService.save(evaluation);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEvaluation);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar avaliação física")
    public ResponseEntity<PhysicalEvaluation> updateEvaluation(@PathVariable Long id, @Valid @RequestBody PhysicalEvaluation evaluation) {
        PhysicalEvaluation updatedEvaluation = physicalEvaluationService.update(id, evaluation);
        return ResponseEntity.ok(updatedEvaluation);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir avaliação física")
    public ResponseEntity<Void> deleteEvaluation(@PathVariable Long id) {
        physicalEvaluationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats/count-by-type/{type}")
    @Operation(summary = "Contar avaliações por tipo")
    public ResponseEntity<Long> getCountByType(@PathVariable PhysicalEvaluation.EvaluationType type) {
        Long count = physicalEvaluationService.countByType(type);
        return ResponseEntity.ok(count);
    }
}