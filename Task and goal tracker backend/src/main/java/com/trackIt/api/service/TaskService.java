package com.trackIt.api.service;
import com.trackIt.api.dto.UserTaskDto;
import com.trackIt.api.dto.request.TaskUpdateRequest;
import com.trackIt.api.exception.TaskNameAlreadyFoundException;
import com.trackIt.api.exception.TaskNotFoundException;
import com.trackIt.api.exception.UserNotFoundException;
import com.trackIt.api.mapper.EntityMapper;
import com.trackIt.api.model.Task;
import com.trackIt.api.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.trackIt.api.mapper.EntityMapper.*;
@Service
@Slf4j
@RequiredArgsConstructor
public class TaskService {


    private final TaskRepository taskRepository;

    public Task createTask(Task task) {
        taskRepository.findByTaskName(task.getTaskName()).ifPresent(existing -> {
            throw new TaskNameAlreadyFoundException(String.format("Task name already exists '%s'", task.getTaskName()));
        });
        Task currentTask = EntityMapper.mapToTaskBuilder(task);
        taskRepository.save(currentTask);
        return currentTask;
    }


    public List<Task> listTasks() {
        return taskRepository.findAll();
    }

    public Task listTaskById(String taskId) {

        return taskRepository.findByTaskId(taskId)
                .map(task -> {
                    logger.info("Task found with ID: {}", taskId);
                    return task;
                })
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id " + taskId));
    }

    public List<UserTaskDto> listTasksByUser(String user) {
        return taskRepository.findByAssignee(user)
                .filter(currentTasks -> !currentTasks.isEmpty())
                .orElseThrow(() -> new TaskNotFoundException("Task not found for user: " + user));
    }



    public Task updateTaskDetails(Task task, String taskId) {
        return taskRepository.findByTaskId(taskId)
                .map(existingTask -> {
                    updateNonNullFields(existingTask, task);
                    taskRepository.save(existingTask);
                    return existingTask;
                })
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id " + taskId));
    }


    public String deleteTaskById(String taskId) {
        logger.info("Service");
        return taskRepository.findByTaskId(taskId)
                .map(existingTask -> {
                    taskRepository.deleteByTaskId(taskId);
                    return "Task deleted successfully";
                })
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id " + taskId));
    }


}


