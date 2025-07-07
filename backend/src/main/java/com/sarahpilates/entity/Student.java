package com.sarahpilates.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false)
    private String name;
    
    @Email(message = "Email deve ser válido")
    @NotBlank(message = "Email é obrigatório")
    @Column(nullable = false, unique = true)
    private String email;
    
    @NotBlank(message = "Telefone é obrigatório")
    @Column(nullable = false)
    private String phone;
    
    @NotNull(message = "Data de nascimento é obrigatória")
    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    @NotBlank(message = "Contato de emergência é obrigatório")
    @Column(name = "emergency_contact", nullable = false)
    private String emergencyContact;
    
    @NotBlank(message = "Telefone de emergência é obrigatório")
    @Column(name = "emergency_phone", nullable = false)
    private String emergencyPhone;
    
    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;
    
    @Column(columnDefinition = "TEXT")
    private String objectives;
    
    @Column(nullable = false)
    private String plan = "Mensal - 8 aulas";
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StudentStatus status = StudentStatus.ATIVO;
    
    @Column(name = "registration_date", nullable = false)
    private LocalDate registrationDate = LocalDate.now();
    
    @Column(name = "last_class")
    private LocalDateTime lastClass;
    
    @Column(name = "total_classes", nullable = false)
    private Integer totalClasses = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum StudentStatus {
        ATIVO, INATIVO, SUSPENSO
    }
}