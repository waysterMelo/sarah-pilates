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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "instructors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Instructor {
    
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
    
    @NotBlank(message = "CPF é obrigatório")
    @Column(nullable = false, unique = true)
    private String cpf;
    
    @NotBlank(message = "RG é obrigatório")
    @Column(nullable = false)
    private String rg;
    
    @Column(name = "cref_number")
    private String crefNumber;
    
    @ElementCollection
    @CollectionTable(name = "instructor_specializations", joinColumns = @JoinColumn(name = "instructor_id"))
    @Column(name = "specialization")
    private List<String> specializations;
    
    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate = LocalDate.now();
    
    @Column(precision = 10, scale = 2)
    private BigDecimal salary;
    
    @Column(name = "hourly_rate", precision = 8, scale = 2)
    private BigDecimal hourlyRate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InstructorStatus status = InstructorStatus.ATIVO;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "total_classes", nullable = false)
    private Integer totalClasses = 0;
    
    @Column(name = "total_students", nullable = false)
    private Integer totalStudents = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum InstructorStatus {
        ATIVO, INATIVO, LICENCA, DEMITIDO
    }
}