package com.sarahpilates.dto;

import com.sarahpilates.entity.Schedule;
import lombok.Data;

import java.util.List;

@Data
public class DashboardStats {
    private Long totalStudents;
    private Long totalInstructors;
    private Long todaySchedules;
    private Double monthlyRevenue;
    private Long completedClasses;
    private List<Schedule> todaySchedulesList;
    private List<Schedule> upcomingSchedules;
}