package com.sarahpilates.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "physical_evaluations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhysicalEvaluation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @NotNull(message = "Aluno é obrigatório")
    private Student student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    @NotNull(message = "Instrutor é obrigatório")
    private Instructor instructor;
    
    @NotNull(message = "Data é obrigatória")
    @Column(nullable = false)
    private LocalDate date;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EvaluationType type = EvaluationType.INICIAL;
    
    @Positive(message = "Peso deve ser positivo")
    @Column(precision = 5, scale = 2, nullable = false)
    private BigDecimal weight;
    
    @Positive(message = "Altura deve ser positiva")
    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal height;
    
    @Column(precision = 4, scale = 1)
    private BigDecimal bmi;
    
    @Column(name = "blood_pressure")
    private String bloodPressure;
    
    @Column(name = "heart_rate")
    private Integer heartRate;
    
    @Column(name = "body_fat", precision = 4, scale = 1)
    private BigDecimal bodyFat;
    
    @Column(name = "muscle_mass", precision = 5, scale = 2)
    private BigDecimal muscleMass;
    
    // Medidas corporais
    @Column(name = "chest_measurement")
    private Integer chestMeasurement;
    
    @Column(name = "waist_measurement")
    private Integer waistMeasurement;
    
    @Column(name = "hip_measurement")
    private Integer hipMeasurement;
    
    @Column(name = "thigh_measurement")
    private Integer thighMeasurement;
    
    @Column(name = "arm_measurement")
    private Integer armMeasurement;
    
    // Flexibilidade
    @Column(name = "shoulder_flexion")
    private Integer shoulderFlexion;
    
    @Column(name = "spinal_flexion")
    private Integer spinalFlexion;
    
    @Column(name = "hip_flexion")
    private Integer hipFlexion;
    
    @Column(name = "ankle_flexion")
    private Integer ankleFlexion;
    
    // Força (escala 1-5)
    @Column(name = "core_strength")
    private Integer coreStrength;
    
    @Column(name = "upper_body_strength")
    private Integer upperBodyStrength;
    
    @Column(name = "lower_body_strength")
    private Integer lowerBodyStrength;
    
    @Column(name = "grip_strength")
    private Integer gripStrength;
    
    // Equilíbrio (escala 1-5)
    @Column(name = "static_balance")
    private Integer staticBalance;
    
    @Column(name = "dynamic_balance")
    private Integer dynamicBalance;
    
    @Column(name = "proprioception")
    private Integer proprioception;
    
    // Análise postural
    @Column(name = "head_posture", columnDefinition = "TEXT")
    private String headPosture;
    
    @Column(name = "shoulders_posture", columnDefinition = "TEXT")
    private String shouldersPosture;
    
    @Column(name = "spine_posture", columnDefinition = "TEXT")
    private String spinePosture;
    
    @Column(name = "pelvis_posture", columnDefinition = "TEXT")
    private String pelvisPosture;
    
    @Column(name = "knees_posture", columnDefinition = "TEXT")
    private String kneesPosture;
    
    @Column(name = "feet_posture", columnDefinition = "TEXT")
    private String feetPosture;
    
    @Column(name = "medical_observations", columnDefinition = "TEXT")
    private String medicalObservations;
    
    @Column(columnDefinition = "TEXT")
    private String objectives;
    
    @Column(name = "treatment_plan", columnDefinition = "TEXT")
    private String treatmentPlan;
    
    @Column(columnDefinition = "TEXT")
    private String recommendations;
    
    @Column(name = "next_evaluation_date")
    private LocalDate nextEvaluationDate;
    
    @ElementCollection
    @CollectionTable(name = "evaluation_photos", joinColumns = @JoinColumn(name = "evaluation_id"))
    @Column(name = "photo_url")
    private List<String> photos;
    
    @ElementCollection
    @CollectionTable(name = "evaluation_attachments", joinColumns = @JoinColumn(name = "evaluation_id"))
    @Column(name = "attachment_url")
    private List<String> attachments;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum EvaluationType {
        INICIAL, PROGRESSO, FINAL, MEDICA
    }
}