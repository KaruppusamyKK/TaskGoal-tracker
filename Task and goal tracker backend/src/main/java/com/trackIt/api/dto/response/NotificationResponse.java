package com.trackIt.api.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Builder
@Getter
@Setter
public class NotificationResponse {

    private String taskName;

    private String description;

    private String sender;

    private String action;

    private String message;

    private LocalDateTime timestamp;

    private String notificationId;


    public NotificationResponse(String taskName, String description, String sender, String action, String message, LocalDateTime timestamp,String notificationId) {
        this.taskName = taskName;
        this.description = description;
        this.sender = sender;
        this.action = action;
        this.message = message;
        this.timestamp = timestamp;
        this.notificationId = notificationId;
    }
}
