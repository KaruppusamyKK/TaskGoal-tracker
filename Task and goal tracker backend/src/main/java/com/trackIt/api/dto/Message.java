package com.trackIt.api.dto;
public record Message(
        String sender,
        String content,
        String taskId
) {
}
