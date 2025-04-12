package com.trackIt.api.dto;
import com.trackIt.api.model.TaskAssignee;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

public record UserTaskDto(
        String taskId,
        String description,
        String taskName,
        String priority,
        List<String> assignee,
        String assigner,
        String status,
        BigInteger timeEstimate,
        BigInteger timeTracked,
        LocalDateTime dueDate,
        LocalDateTime startDate) { }
