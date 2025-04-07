package com.trackIt.api.dto.request;

public record TaskUpdateRequest(String taskId,String actionType,String value) {
}
