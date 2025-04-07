package com.trackIt.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"task", "attachment"})
public class TaskResources {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] attachment;

    @ManyToOne
    @JoinColumn(name = "task_id")
    @JsonBackReference
    private Task task;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    private String descriptionId;

    private String imgId;

    private String taskUniqueId;

    private String timestamp;

    @Transient
    private String Base64pic;
    public void setBase64pic(String Base64pic) {
        this.Base64pic = Base64pic;
    }
}
