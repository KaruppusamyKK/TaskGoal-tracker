package com.trackIt.api.service;

import com.trackIt.api.dto.request.ProjectRequest;
import com.trackIt.api.dto.response.ProjectResponse;
import com.trackIt.api.exception.ProjectNotFoundException;
import com.trackIt.api.exception.TaskNotFoundException;
import com.trackIt.api.model.Project;
import com.trackIt.api.model.Task;
import com.trackIt.api.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.trackIt.api.mapper.EntityMapper.updateNonNullProjectFields;
import static com.trackIt.api.mapper.EntityMapper.updateNonNullTaskFields;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectResponse createProject(ProjectRequest request) {
        Project project = new Project().builder()
                .projectId(UUID.randomUUID().toString())
                .projectName(request.projectName)
                .description(request.description)
                .projectCreator(request.projectCreator)
                .startDate(request.startDate)
                .endDate(request.endDate)
                .priority(request.priority)
                .status(request.status)
                .projectCreator(request.projectCreator)
                .build();
        projectRepository.save(project);
        return ProjectResponse.from(project);
    }

    public List<ProjectResponse> listAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(ProjectResponse::from)
                .collect(Collectors.toList());
    }

    public void deleteProjectById(String projectId) {
        projectRepository.findByProjectId(projectId)
                .ifPresentOrElse(project -> projectRepository.deleteProjectByProjectId(projectId),
                        () -> new ProjectNotFoundException("Project not found with id " + projectId));
    }


    public ProjectResponse updateProjectDetails(ProjectRequest project, String projectId) {
        return projectRepository.findByProjectId(projectId)
                .map(existingProject -> {
                    updateNonNullProjectFields(existingProject, project);
                    projectRepository.save(existingProject);
                    return ProjectResponse.from(existingProject);
                })
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id " + projectId));
    }
}
