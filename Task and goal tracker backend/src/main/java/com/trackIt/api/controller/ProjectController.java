package com.trackIt.api.controller;
import com.trackIt.api.dto.request.ProjectRequest;
import com.trackIt.api.dto.response.ProjectResponse;
import com.trackIt.api.dto.response.ResponseHandler;
import com.trackIt.api.model.Task;
import com.trackIt.api.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
@Slf4j
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping("/createProject")
    public ResponseEntity<?> createProject(@RequestBody ProjectRequest request) {
        return ResponseHandler.handleResponse(() -> projectService.createProject(request));

    }


    @GetMapping("/listAllProjects")
    public ResponseEntity<?> listAllProjects() {
        return ResponseHandler.handleResponse(projectService::listAllProjects);

    }


    @PostMapping("/deleteProject")
    public ResponseEntity<Void> deleteProject(@RequestParam String projectId) {
        projectService.deleteProjectById(projectId);
        return ResponseEntity.noContent().build();

    }

    @PostMapping("/updateProjectDetails")
    public ResponseEntity<?> updateTaskDetails(@RequestBody ProjectRequest project, @RequestParam String projectId) {
        return ResponseHandler.handleResponse(() -> projectService.updateProjectDetails(project,projectId));

    }

}
