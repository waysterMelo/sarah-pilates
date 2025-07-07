package com.sarahpilates.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "evolution_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvolutionRecord {
    
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
    
    @Column(nullable = false)
    private Integer session;
    
    @Column(nullable = false)
    private String focus;
    
    @ElementCollection
    @CollectionTable(name = "evolution_exercises", joinColumns = @JoinColumn(name = "evolution_id"))
    @Column(name = "exercise")
    private List<String> exercisesPerformed;
    
    @Column(name = "progress_notes", columnDefinition = "TEXT")
    private String progressNotes;
    
    @Column(name = "difficulties_observed", columnDefinition = "TEXT")
    private String difficultiesObserved;
    
    @Column(columnDefinition = "TEXT")
    private String improvements;
    
    @Column(name = "next_session_goals", columnDefinition = "TEXT")
    private String nextSessionGoals;
    
    @Min(1) @Max(5)
    @Column(name = "overall_rating")
    private Integer overallRating;
    
    @Min(0) @Max(10)
    @Column(name = "pain_level")
    private Integer painLevel;
    
    @Min(1) @Max(5)
    @Column(name = "mobility_level")
    private Integer mobilityLevel;
    
    @Min(1) @Max(5)
    @Column(name = "strength_level")
    private Integer strengthLevel;
    
    @Min(1) @Max(5)
    @Column(name = "balance_level")
    private Integer balanceLevel;
    
    @Min(1) @Max(5)
    @Column(name = "endurance_level")
    private Integer enduranceLevel;
    
    @Column(columnDefinition = "TEXT")
    private String observations;
    
    @ElementCollection
    @CollectionTable(name = "evolution_equipment", joinColumns = @JoinColumn(name = "evolution_id"))
    @Column(name = "equipment")
    private List<String> equipment;
    
    @Column(nullable = false)
    private Integer duration;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}