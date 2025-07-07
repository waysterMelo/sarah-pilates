package com.sarahpilates.dto;

import com.sarahpilates.entity.Instructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class InstructorDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDate birthDate;
    private String address;
    private String cpf;
    private String rg;
    private String crefNumber;
    private List<String> specializations;
    private LocalDate hireDate;
    private BigDecimal salary;
    private BigDecimal hourlyRate;
    private Instructor.InstructorStatus status;
    private String notes;
    private Integer totalClasses;
    private Integer totalStudents;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Campos calculados
    private Integer age;
    private Long daysWorking;
    private String statusDescription;
    private BigDecimal averageClassesPerMonth;
    
    public static InstructorDTO fromEntity(Instructor instructor) {
        InstructorDTO dto = new InstructorDTO();
        dto.setId(instructor.getId());
        dto.setName(instructor.getName());
        dto.setEmail(instructor.getEmail());
        dto.setPhone(instructor.getPhone());
        dto.setBirthDate(instructor.getBirthDate());
        dto.setAddress(instructor.getAddress());
        dto.setCpf(instructor.getCpf());
        dto.setRg(instructor.getRg());
        dto.setCrefNumber(instructor.getCrefNumber());
        dto.setSpecializations(instructor.getSpecializations());
        dto.setHireDate(instructor.getHireDate());
        dto.setSalary(instructor.getSalary());
        dto.setHourlyRate(instructor.getHourlyRate());
        dto.setStatus(instructor.getStatus());
        dto.setNotes(instructor.getNotes());
        dto.setTotalClasses(instructor.getTotalClasses());
        dto.setTotalStudents(instructor.getTotalStudents());
        dto.setCreatedAt(instructor.getCreatedAt());
        dto.setUpdatedAt(instructor.getUpdatedAt());
        
        // Calcular idade
        if (instructor.getBirthDate() != null) {
            dto.setAge(LocalDate.now().getYear() - instructor.getBirthDate().getYear());
        }
        
        // Calcular dias trabalhando
        if (instructor.getHireDate() != null) {
            dto.setDaysWorking(
                java.time.temporal.ChronoUnit.DAYS.between(instructor.getHireDate(), LocalDate.now())
            );
        }
        
        // Descrição do status
        dto.setStatusDescription(getStatusDescription(instructor.getStatus()));
        
        // Média de aulas por mês
        if (dto.getDaysWorking() != null && dto.getDaysWorking() > 0) {
            double months = dto.getDaysWorking() / 30.0;
            if (months > 0) {
                dto.setAverageClassesPerMonth(
                    BigDecimal.valueOf(instructor.getTotalClasses() / months)
                        .setScale(1, BigDecimal.ROUND_HALF_UP)
                );
            }
        }
        
        return dto;
    }
    
    private static String getStatusDescription(Instructor.InstructorStatus status) {
        return switch (status) {
            case ATIVO -> "Instrutor ativo";
            case INATIVO -> "Instrutor inativo";
            case LICENCA -> "Instrutor em licença";
            case DEMITIDO -> "Instrutor demitido";
        };
    }
}