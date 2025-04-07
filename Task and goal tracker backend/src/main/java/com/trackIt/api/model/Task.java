package com.trackIt.api.model;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "Task", uniqueConstraints = {
        @UniqueConstraint(columnNames = "taskId"),
        @UniqueConstraint(columnNames = "taskName")
})
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;
    private String taskId;
    private String description;
    private String taskName;
    private String priority;
    private LocalDateTime timestamp;
    private String assignee;
    private String assigner;
    private String status;
    private BigInteger timeEstimate;
    private BigInteger timeTracked;
    private LocalDateTime dueDate;
    private LocalDateTime startDate;



    @PrePersist
    private void setDefault() {
        this.timestamp = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }




    //    @OneToMany(mappedBy = "task",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
//    @JsonManagedReference
//    private List<TaskResources> taskResourcesList = new ArrayList<>();
//
//    @JsonBackReference
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "iteration_id", referencedColumnName = "id")
//    private Iteration iteration;
//
//
//    @OneToMany(mappedBy = "task",cascade = CascadeType.ALL,fetch = FetchType.EAGER)
//    @JsonManagedReference
//    private List<Chat> chatList = new ArrayList<>();


}
