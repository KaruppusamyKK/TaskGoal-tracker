package com.trackIt.api.dto.request;

import java.util.List;

public record AssigneeRequest(String taskId,
                              List<String> assigneeList,
                              String action,
                              String assigner,
                              String taskName,
                              String description) {
}
