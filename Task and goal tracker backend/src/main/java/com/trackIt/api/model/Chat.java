package com.trackIt.api.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String chatId;

    private String sender;

    @Lob
    @Column(columnDefinition = "TEXT")

    private String content;


    private LocalDateTime timestamp;

    private String taskId;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "task_ref")
    private Task task;

    @PrePersist
    private void setDefault() {
        this.timestamp = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }

}
