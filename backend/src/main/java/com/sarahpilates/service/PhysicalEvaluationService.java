package com.sarahpilates.service;

import com.sarahpilates.entity.PhysicalEvaluation;
import com.sarahpilates.entity.Student;
import com.sarahpilates.entity.Instructor;
import com.sarahpilates.repository.PhysicalEvaluationRepository;
import com.sarahpilates.repository.StudentRepository;
import com.sarahpilates.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PhysicalEvaluationService {
    
    private final PhysicalEvaluationRepository physicalEvaluationRepository;
    private final StudentRepository studentRepository;
    private final InstructorRepository instructorRepository;
    
    public List<PhysicalEvaluation> findAll() {
        return physicalEvaluationRepository.findAll();
    }
    
    public Page<PhysicalEvaluation> findAll(Pageable pageable) {
        return physicalEvaluationRepository.findAll(pageable);
    }
    
    public Optional<PhysicalEvaluation> findById(Long id) {
        return physicalEvaluationRepository.findById(id);
    }
    
    public List<PhysicalEvaluation> findByStudentId(Long studentId) {
        return physicalEvaluationRepository.findByStudentId(studentId);
    }
    
    public List<PhysicalEvaluation> findByInstructorId(Long instructorId) {
        return physicalEvaluationRepository.findByInstructorId(instructorId);
    }
    
    public List<PhysicalEvaluation> findByType(PhysicalEvaluation.EvaluationType type) {
        return physicalEvaluationRepository.findByType(type);
    }
    
    public List<PhysicalEvaluation> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return physicalEvaluationRepository.findByDateBetween(startDate, endDate);
    }
    
    public Page<PhysicalEvaluation> search(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return physicalEvaluationRepository.findAll(pageable);
        }
        return physicalEvaluationRepository.findBySearchTerm(searchTerm.trim(), pageable);
    }
    
    public Page<PhysicalEvaluation> searchByType(PhysicalEvaluation.EvaluationType type, String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return physicalEvaluationRepository.findAll(pageable);
        }
        return physicalEvaluationRepository.findByTypeAndSearchTerm(type, searchTerm.trim(), pageable);
    }
    
    public PhysicalEvaluation save(PhysicalEvaluation evaluation) {
        // Validar se o aluno existe
        Student student = studentRepository.findById(evaluation.getStudent().getId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        
        // Validar se o instrutor existe
        Instructor instructor = instructorRepository.findById(evaluation.getInstructor().getId())
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        
        evaluation.setStudent(student);
        evaluation.setInstructor(instructor);
        
        // Calcular IMC automaticamente
        if (evaluation.getWeight() != null && evaluation.getHeight() != null && 
            evaluation.getWeight().compareTo(BigDecimal.ZERO) > 0 && 
            evaluation.getHeight().compareTo(BigDecimal.ZERO) > 0) {
            
            BigDecimal bmi = evaluation.getWeight().divide(
                evaluation.getHeight().multiply(evaluation.getHeight()), 
                1, 
                RoundingMode.HALF_UP
            );
            evaluation.setBmi(bmi);
        }
        
        return physicalEvaluationRepository.save(evaluation);
    }
    
    public PhysicalEvaluation update(Long id, PhysicalEvaluation evaluationDetails) {
        PhysicalEvaluation evaluation = physicalEvaluationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avaliação física não encontrada"));
        
        // Validar se o aluno existe
        Student student = studentRepository.findById(evaluationDetails.getStudent().getId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        
        // Validar se o instrutor existe
        Instructor instructor = instructorRepository.findById(evaluationDetails.getInstructor().getId())
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        
        // Atualizar campos
        evaluation.setStudent(student);
        evaluation.setInstructor(instructor);
        evaluation.setDate(evaluationDetails.getDate());
        evaluation.setType(evaluationDetails.getType());
        evaluation.setWeight(evaluationDetails.getWeight());
        evaluation.setHeight(evaluationDetails.getHeight());
        evaluation.setBloodPressure(evaluationDetails.getBloodPressure());
        evaluation.setHeartRate(evaluationDetails.getHeartRate());
        evaluation.setBodyFat(evaluationDetails.getBodyFat());
        evaluation.setMuscleMass(evaluationDetails.getMuscleMass());
        
        // Medidas corporais
        evaluation.setChestMeasurement(evaluationDetails.getChestMeasurement());
        evaluation.setWaistMeasurement(evaluationDetails.getWaistMeasurement());
        evaluation.setHipMeasurement(evaluationDetails.getHipMeasurement());
        evaluation.setThighMeasurement(evaluationDetails.getThighMeasurement());
        evaluation.setArmMeasurement(evaluationDetails.getArmMeasurement());
        
        // Flexibilidade
        evaluation.setShoulderFlexion(evaluationDetails.getShoulderFlexion());
        evaluation.setSpinalFlexion(evaluationDetails.getSpinalFlexion());
        evaluation.setHipFlexion(evaluationDetails.getHipFlexion());
        evaluation.setAnkleFlexion(evaluationDetails.getAnkleFlexion());
        
        // Força
        evaluation.setCoreStrength(evaluationDetails.getCoreStrength());
        evaluation.setUpperBodyStrength(evaluationDetails.getUpperBodyStrength());
        evaluation.setLowerBodyStrength(evaluationDetails.getLowerBodyStrength());
        evaluation.setGripStrength(evaluationDetails.getGripStrength());
        
        // Equilíbrio
        evaluation.setStaticBalance(evaluationDetails.getStaticBalance());
        evaluation.setDynamicBalance(evaluationDetails.getDynamicBalance());
        evaluation.setProprioception(evaluationDetails.getProprioception());
        
        // Análise postural
        evaluation.setHeadPosture(evaluationDetails.getHeadPosture());
        evaluation.setShouldersPosture(evaluationDetails.getShouldersPosture());
        evaluation.setSpinePosture(evaluationDetails.getSpinePosture());
        evaluation.setPelvisPosture(evaluationDetails.getPelvisPosture());
        evaluation.setKneesPosture(evaluationDetails.getKneesPosture());
        evaluation.setFeetPosture(evaluationDetails.getFeetPosture());
        
        // Observações e planos
        evaluation.setMedicalObservations(evaluationDetails.getMedicalObservations());
        evaluation.setObjectives(evaluationDetails.getObjectives());
        evaluation.setTreatmentPlan(evaluationDetails.getTreatmentPlan());
        evaluation.setRecommendations(evaluationDetails.getRecommendations());
        evaluation.setNextEvaluationDate(evaluationDetails.getNextEvaluationDate());
        
        // Fotos e anexos
        evaluation.setPhotos(evaluationDetails.getPhotos());
        evaluation.setAttachments(evaluationDetails.getAttachments());
        
        // Recalcular IMC
        if (evaluation.getWeight() != null && evaluation.getHeight() != null && 
            evaluation.getWeight().compareTo(BigDecimal.ZERO) > 0 && 
            evaluation.getHeight().compareTo(BigDecimal.ZERO) > 0) {
            
            BigDecimal bmi = evaluation.getWeight().divide(
                evaluation.getHeight().multiply(evaluation.getHeight()), 
                1, 
                RoundingMode.HALF_UP
            );
            evaluation.setBmi(bmi);
        }
        
        return physicalEvaluationRepository.save(evaluation);
    }
    
    public void deleteById(Long id) {
        if (!physicalEvaluationRepository.existsById(id)) {
            throw new RuntimeException("Avaliação física não encontrada");
        }
        physicalEvaluationRepository.deleteById(id);
    }
    
    public List<PhysicalEvaluation> getStudentEvaluationHistory(Long studentId) {
        return physicalEvaluationRepository.findByStudentIdOrderByDateDesc(studentId);
    }
    
    public Long countByType(PhysicalEvaluation.EvaluationType type) {
        return physicalEvaluationRepository.countByType(type);
    }
}