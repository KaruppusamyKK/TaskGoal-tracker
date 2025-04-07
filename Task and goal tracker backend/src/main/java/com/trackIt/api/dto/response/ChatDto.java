package com.trackIt.api.dto.response;

import java.time.LocalDateTime;

public record ChatDto(String sender,
                      String taskId,
                      String content,
                      LocalDateTime timestamp) {
}
