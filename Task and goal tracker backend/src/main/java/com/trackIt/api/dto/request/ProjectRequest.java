package com.trackIt.api.dto.request;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProjectRequest {
    public String description;
    public String projectName;
    public String projectCreator;
    public LocalDateTime startDate;
    public LocalDateTime endDate;
    public String priority;
    public String status;
}
