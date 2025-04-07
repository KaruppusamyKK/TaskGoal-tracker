package com.trackIt.api.controller;
import com.trackIt.api.dto.request.TaskUpdateRequest;
import com.trackIt.api.dto.response.ResponseHandler;
import com.trackIt.api.model.Task;
import com.trackIt.api.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/task")
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/createTask")
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        return ResponseHandler.handleResponse(() -> taskService.createTask(task));
    }

    @GetMapping("/listTasks")
    public ResponseEntity<?> listTasks() {
        return ResponseHandler.handleResponse(() -> taskService.listTasks());
    }

    @GetMapping("/listTask/Id")
    public ResponseEntity<?> listTaskById(@RequestParam String taskId) {
        return ResponseHandler.handleResponse(() -> taskService.listTaskById(taskId));
    }

    @GetMapping("/listTasksByUser")
    public ResponseEntity<?> listTasksByUser(@RequestParam String username) {
        return ResponseHandler.handleResponse(() -> taskService.listTasksByUser(username));
    }

    @PostMapping("/updateTaskDetails")
    public ResponseEntity<?> updateTaskDetails(@RequestBody Task task, @RequestParam String taskId) {
        return ResponseHandler.handleResponse(() -> taskService.updateTaskDetails(task, taskId));

    }

    @PostMapping("/deleteTaskById")
    public ResponseEntity<?> deleteTaskById(@RequestBody Map<String, String> request) {
        String taskId = request.get("taskId");
        logger.info("TaskID {} ",taskId);
        return ResponseHandler.handleResponse(() -> taskService.deleteTaskById(taskId));
    }


}
