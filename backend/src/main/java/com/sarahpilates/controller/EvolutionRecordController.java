package com.sarahpilates.controller;

import com.sarahpilates.entity.EvolutionRecord;
import com.sarahpilates.service.EvolutionRecordService;
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
@RequestMapping("/evolution-records")
@RequiredArgsConstructor
@Tag(name = "Evolution Records", description = "Gestão de Fichas de Evolução")
@CrossOrigin(origins = "*")
public class EvolutionRecordController {
    
    private final EvolutionRecordService evolutionRecordService;
    
    @GetMapping
    @Operation(summary = "Listar todas as fichas de evolução")
    public ResponseEntity<Page<EvolutionRecord>> getAllRecords(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        
        Page<EvolutionRecord> records;
        
        if (search != null && !search.trim().isEmpty()) {
            records = evolutionRecordService.search(search, pageable);
        } else {
            records = evolutionRecordService.findAll(pageable);
        }
        
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Buscar ficha de evolução por ID")
    public ResponseEntity<EvolutionRecord> getRecordById(@PathVariable Long id) {
        return evolutionRecordService.findById(id)
                .map(record -> ResponseEntity.ok(record))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/student/{studentId}")
    @Operation(summary = "Buscar fichas por aluno")
    public ResponseEntity<List<EvolutionRecord>> getRecordsByStudent(@PathVariable Long studentId) {
        List<EvolutionRecord> records = evolutionRecordService.findByStudentId(studentId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/student/{studentId}/history")
    @Operation(summary = "Histórico de evolução do aluno")
    public ResponseEntity<List<EvolutionRecord>> getStudentEvolutionHistory(@PathVariable Long studentId) {
        List<EvolutionRecord> records = evolutionRecordService.getStudentEvolutionHistory(studentId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/instructor/{instructorId}")
    @Operation(summary = "Buscar fichas por instrutor")
    public ResponseEntity<List<EvolutionRecord>> getRecordsByInstructor(@PathVariable Long instructorId) {
        List<EvolutionRecord> records = evolutionRecordService.findByInstructorId(instructorId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/date-range")
    @Operation(summary = "Buscar fichas por período")
    public ResponseEntity<List<EvolutionRecord>> getRecordsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<EvolutionRecord> records = evolutionRecordService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(records);
    }
    
    @PostMapping
    @Operation(summary = "Criar nova ficha de evolução")
    public ResponseEntity<EvolutionRecord> createRecord(@Valid @RequestBody EvolutionRecord record) {
        EvolutionRecord savedRecord = evolutionRecordService.save(record);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRecord);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar ficha de evolução")
    public ResponseEntity<EvolutionRecord> updateRecord(@PathVariable Long id, @Valid @RequestBody EvolutionRecord record) {
        EvolutionRecord updatedRecord = evolutionRecordService.update(id, record);
        return ResponseEntity.ok(updatedRecord);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir ficha de evolução")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        evolutionRecordService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/student/{studentId}/next-session")
    @Operation(summary = "Próximo número de sessão para o aluno")
    public ResponseEntity<Integer> getNextSessionNumber(@PathVariable Long studentId) {
        Integer nextSession = evolutionRecordService.getNextSessionNumber(studentId);
        return ResponseEntity.ok(nextSession);
    }
    
    @GetMapping("/stats/count-by-date/{date}")
    @Operation(summary = "Contar fichas por data")
    public ResponseEntity<Long> getCountByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Long count = evolutionRecordService.countByDate(date);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/student/{studentId}/average-rating")
    @Operation(summary = "Avaliação média do aluno")
    public ResponseEntity<Double> getAverageRatingByStudent(@PathVariable Long studentId) {
        Double average = evolutionRecordService.getAverageRatingByStudent(studentId);
        return ResponseEntity.ok(average != null ? average : 0.0);
    }
}