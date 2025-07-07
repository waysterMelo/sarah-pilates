package com.sarahpilates.service;

import com.sarahpilates.entity.EvolutionRecord;
import com.sarahpilates.entity.Student;
import com.sarahpilates.entity.Instructor;
import com.sarahpilates.repository.EvolutionRecordRepository;
import com.sarahpilates.repository.StudentRepository;
import com.sarahpilates.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class EvolutionRecordService {
    
    private final EvolutionRecordRepository evolutionRecordRepository;
    private final StudentRepository studentRepository;
    private final InstructorRepository instructorRepository;
    
    public List<EvolutionRecord> findAll() {
        return evolutionRecordRepository.findAll();
    }
    
    public Page<EvolutionRecord> findAll(Pageable pageable) {
        return evolutionRecordRepository.findAll(pageable);
    }
    
    public Optional<EvolutionRecord> findById(Long id) {
        return evolutionRecordRepository.findById(id);
    }
    
    public List<EvolutionRecord> findByStudentId(Long studentId) {
        return evolutionRecordRepository.findByStudentId(studentId);
    }
    
    public List<EvolutionRecord> findByInstructorId(Long instructorId) {
        return evolutionRecordRepository.findByInstructorId(instructorId);
    }
    
    public List<EvolutionRecord> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return evolutionRecordRepository.findByDateBetween(startDate, endDate);
    }
    
    public Page<EvolutionRecord> search(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return evolutionRecordRepository.findAll(pageable);
        }
        return evolutionRecordRepository.findBySearchTerm(searchTerm.trim(), pageable);
    }
    
    public EvolutionRecord save(EvolutionRecord record) {
        // Validar se o aluno existe
        Student student = studentRepository.findById(record.getStudent().getId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        
        // Validar se o instrutor existe
        Instructor instructor = instructorRepository.findById(record.getInstructor().getId())
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        
        record.setStudent(student);
        record.setInstructor(instructor);
        
        // Se não foi especificado o número da sessão, calcular automaticamente
        if (record.getSession() == null) {
            Integer maxSession = evolutionRecordRepository.findMaxSessionByStudentId(student.getId());
            record.setSession(maxSession != null ? maxSession + 1 : 1);
        }
        
        return evolutionRecordRepository.save(record);
    }
    
    public EvolutionRecord update(Long id, EvolutionRecord recordDetails) {
        EvolutionRecord record = evolutionRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ficha de evolução não encontrada"));
        
        // Validar se o aluno existe
        Student student = studentRepository.findById(recordDetails.getStudent().getId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        
        // Validar se o instrutor existe
        Instructor instructor = instructorRepository.findById(recordDetails.getInstructor().getId())
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        
        // Atualizar campos
        record.setStudent(student);
        record.setInstructor(instructor);
        record.setDate(recordDetails.getDate());
        record.setSession(recordDetails.getSession());
        record.setFocus(recordDetails.getFocus());
        record.setExercisesPerformed(recordDetails.getExercisesPerformed());
        record.setProgressNotes(recordDetails.getProgressNotes());
        record.setDifficultiesObserved(recordDetails.getDifficultiesObserved());
        record.setImprovements(recordDetails.getImprovements());
        record.setNextSessionGoals(recordDetails.getNextSessionGoals());
        record.setOverallRating(recordDetails.getOverallRating());
        record.setPainLevel(recordDetails.getPainLevel());
        record.setMobilityLevel(recordDetails.getMobilityLevel());
        record.setStrengthLevel(recordDetails.getStrengthLevel());
        record.setBalanceLevel(recordDetails.getBalanceLevel());
        record.setEnduranceLevel(recordDetails.getEnduranceLevel());
        record.setObservations(recordDetails.getObservations());
        record.setEquipment(recordDetails.getEquipment());
        record.setDuration(recordDetails.getDuration());
        
        return evolutionRecordRepository.save(record);
    }
    
    public void deleteById(Long id) {
        if (!evolutionRecordRepository.existsById(id)) {
            throw new RuntimeException("Ficha de evolução não encontrada");
        }
        evolutionRecordRepository.deleteById(id);
    }
    
    public List<EvolutionRecord> getStudentEvolutionHistory(Long studentId) {
        return evolutionRecordRepository.findByStudentIdOrderByDateDesc(studentId);
    }
    
    public Integer getNextSessionNumber(Long studentId) {
        Integer maxSession = evolutionRecordRepository.findMaxSessionByStudentId(studentId);
        return maxSession != null ? maxSession + 1 : 1;
    }
    
    public Long countByDate(LocalDate date) {
        return evolutionRecordRepository.countByDate(date);
    }
    
    public Double getAverageRatingByStudent(Long studentId) {
        return evolutionRecordRepository.getAverageRatingByStudentId(studentId);
    }
}