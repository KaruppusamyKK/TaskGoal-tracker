package com.trackIt.api.dto.response;

import com.trackIt.api.model.Project;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponse {
    public String projectId;
    public String projectName;
    public String description;
    public LocalDateTime startDate;
    public LocalDateTime endDate;
    public String priority;
    public String projectCreator;
    public LocalDateTime timestamp;
    private String status;


    public static ProjectResponse from(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.projectId = project.getProjectId();
        response.projectName = project.getProjectName();
        response.description = project.getDescription();
        response.startDate = project.getStartDate();
        response.endDate = project.getEndDate();
        response.priority = project.getPriority();
        response.projectCreator = project.getProjectCreator();
        response.timestamp = project.getTimestamp();
        response.status = project.getStatus();
        return response;
    }

}
