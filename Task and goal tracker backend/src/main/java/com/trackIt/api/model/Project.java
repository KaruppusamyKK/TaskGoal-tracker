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
@Table(name = "Project", uniqueConstraints = {
        @UniqueConstraint(columnNames = "projectId"),
        @UniqueConstraint(columnNames = "projectName")
})
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String projectId;

    private String description;

    private String projectName;

    private LocalDateTime timestamp;

    private String projectCreator;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String priority;

    private String status;



    @PrePersist
    public void setDeafault(){
        this.timestamp = LocalDateTime.now();
    }

}
