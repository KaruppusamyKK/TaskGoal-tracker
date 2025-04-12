package com.trackIt.api.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class TaskAssignee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String assignee;

    private String assigner;

    private LocalDateTime timestamp;

    private String taskId;


    @ManyToOne
    @JoinColumn(name = "task_ref")
    @JsonBackReference
    private Task task;

    @PrePersist
    public void setDefaultValue(){
        this.timestamp = LocalDateTime.now();
    }




}
