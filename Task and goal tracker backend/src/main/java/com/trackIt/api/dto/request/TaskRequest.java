package com.trackIt.api.dto.request;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

public record TaskRequest(String taskId,
                          String description,
                          String taskName,
                          String priority,
                          String assigner,
                          String status,
                          LocalDateTime startDate,
                          LocalDateTime dueDate,
                          BigInteger timeTracked,
                          BigInteger timeEstimate,
                          List<String> assignee,
                          String projectName) {
}
