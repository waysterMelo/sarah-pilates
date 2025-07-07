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
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {
    
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
    
    @NotNull(message = "Horário de início é obrigatório")
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @NotNull(message = "Horário de fim é obrigatório")
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(nullable = false)
    private String type = "Pilates Solo";
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleStatus status = ScheduleStatus.AGENDADO;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(nullable = false)
    private String room = "Sala 1";
    
    @ElementCollection
    @CollectionTable(name = "schedule_equipment", joinColumns = @JoinColumn(name = "schedule_id"))
    @Column(name = "equipment")
    private List<String> equipment;
    
    @Positive(message = "Valor deve ser positivo")
    @Column(precision = 8, scale = 2, nullable = false)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDENTE;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum ScheduleStatus {
        AGENDADO, CONFIRMADO, CONCLUIDO, CANCELADO, FALTA
    }
    
    public enum PaymentStatus {
        PENDENTE, PAGO, ISENTO
    }
}