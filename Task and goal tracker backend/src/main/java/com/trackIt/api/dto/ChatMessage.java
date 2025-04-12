package com.trackIt.api.dto;
public record ChatMessage(
        String sender,
        String content,
        String taskId
) {
}
