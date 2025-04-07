package com.trackIt.api.dto;
import java.math.BigInteger;
import java.time.LocalDateTime;

public record UserTaskDto(
        String taskId,
        String description,
        String taskName,
        String priority,
        String assignee,
        String assigner,
        String status,
        BigInteger timeEstimate,
        BigInteger timeTracked,
        LocalDateTime dueDate,
        LocalDateTime startDate) { }
