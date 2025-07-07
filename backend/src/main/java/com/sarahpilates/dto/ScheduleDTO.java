package com.sarahpilates.dto;

import com.sarahpilates.entity.Schedule;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class ScheduleDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long instructorId;
    private String instructorName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String type;
    private Schedule.ScheduleStatus status;
    private String notes;
    private String room;
    private List<String> equipment;
    private BigDecimal price;
    private Schedule.PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Campos calculados
    private Integer durationMinutes;
    private String statusDescription;
    private String paymentStatusDescription;
    private Boolean isToday;
    private Boolean isPast;
    private Boolean isFuture;
    
    public static ScheduleDTO fromEntity(Schedule schedule) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setId(schedule.getId());
        dto.setStudentId(schedule.getStudent().getId());
        dto.setStudentName(schedule.getStudent().getName());
        dto.setInstructorId(schedule.getInstructor().getId());
        dto.setInstructorName(schedule.getInstructor().getName());
        dto.setDate(schedule.getDate());
        dto.setStartTime(schedule.getStartTime());
        dto.setEndTime(schedule.getEndTime());
        dto.setType(schedule.getType());
        dto.setStatus(schedule.getStatus());
        dto.setNotes(schedule.getNotes());
        dto.setRoom(schedule.getRoom());
        dto.setEquipment(schedule.getEquipment());
        dto.setPrice(schedule.getPrice());
        dto.setPaymentStatus(schedule.getPaymentStatus());
        dto.setCreatedAt(schedule.getCreatedAt());
        dto.setUpdatedAt(schedule.getUpdatedAt());
        
        // Calcular duração em minutos
        if (schedule.getStartTime() != null && schedule.getEndTime() != null) {
            dto.setDurationMinutes(
                (int) java.time.Duration.between(schedule.getStartTime(), schedule.getEndTime()).toMinutes()
            );
        }
        
        // Descrições dos status
        dto.setStatusDescription(getStatusDescription(schedule.getStatus()));
        dto.setPaymentStatusDescription(getPaymentStatusDescription(schedule.getPaymentStatus()));
        
        // Verificações de data
        LocalDate today = LocalDate.now();
        dto.setIsToday(schedule.getDate().equals(today));
        dto.setIsPast(schedule.getDate().isBefore(today));
        dto.setIsFuture(schedule.getDate().isAfter(today));
        
        return dto;
    }
    
    private static String getStatusDescription(Schedule.ScheduleStatus status) {
        return switch (status) {
            case AGENDADO -> "Agendamento realizado";
            case CONFIRMADO -> "Agendamento confirmado";
            case CONCLUIDO -> "Aula concluída";
            case CANCELADO -> "Agendamento cancelado";
            case FALTA -> "Aluno faltou";
        };
    }
    
    private static String getPaymentStatusDescription(Schedule.PaymentStatus status) {
        return switch (status) {
            case PENDENTE -> "Pagamento pendente";
            case PAGO -> "Pagamento realizado";
            case ISENTO -> "Isento de pagamento";
        };
    }
}