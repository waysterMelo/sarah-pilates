package com.sarahpilates.dto;

import com.sarahpilates.entity.Student;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class StudentDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDate birthDate;
    private String address;
    private String emergencyContact;
    private String emergencyPhone;
    private String medicalHistory;
    private String objectives;
    private String plan;
    private Student.StudentStatus status;
    private LocalDate registrationDate;
    private LocalDateTime lastClass;
    private Integer totalClasses;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Campos calculados
    private Integer age;
    private Long daysSinceLastClass;
    private String statusDescription;
    
    public static StudentDTO fromEntity(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setPhone(student.getPhone());
        dto.setBirthDate(student.getBirthDate());
        dto.setAddress(student.getAddress());
        dto.setEmergencyContact(student.getEmergencyContact());
        dto.setEmergencyPhone(student.getEmergencyPhone());
        dto.setMedicalHistory(student.getMedicalHistory());
        dto.setObjectives(student.getObjectives());
        dto.setPlan(student.getPlan());
        dto.setStatus(student.getStatus());
        dto.setRegistrationDate(student.getRegistrationDate());
        dto.setLastClass(student.getLastClass());
        dto.setTotalClasses(student.getTotalClasses());
        dto.setCreatedAt(student.getCreatedAt());
        dto.setUpdatedAt(student.getUpdatedAt());
        
        // Calcular idade
        if (student.getBirthDate() != null) {
            dto.setAge(LocalDate.now().getYear() - student.getBirthDate().getYear());
        }
        
        // Calcular dias desde última aula
        if (student.getLastClass() != null) {
            dto.setDaysSinceLastClass(
                java.time.Duration.between(student.getLastClass(), LocalDateTime.now()).toDays()
            );
        }
        
        // Descrição do status
        dto.setStatusDescription(getStatusDescription(student.getStatus()));
        
        return dto;
    }
    
    private static String getStatusDescription(Student.StudentStatus status) {
        return switch (status) {
            case ATIVO -> "Aluno ativo no estúdio";
            case INATIVO -> "Aluno inativo";
            case SUSPENSO -> "Aluno com matrícula suspensa";
        };
    }
}