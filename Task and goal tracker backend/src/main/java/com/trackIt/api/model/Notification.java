package com.trackIt.api.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender;

    private String taskName;

    private String description;

    private String Message;

    private LocalDateTime timestamp;

    private String notificationReceiver;

    private String  notificationId;

    @PrePersist
    private void setDefault() {
        this.timestamp = LocalDateTime.now();
    }
}
