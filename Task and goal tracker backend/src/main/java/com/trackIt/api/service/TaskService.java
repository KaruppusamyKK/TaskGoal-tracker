package com.trackIt.api.service;

import com.trackIt.api.dto.UserTaskDto;
import com.trackIt.api.dto.request.AssigneeRequest;
import com.trackIt.api.dto.request.TaskRequest;
import com.trackIt.api.dto.response.TaskResponse;
import com.trackIt.api.exception.ProjectNotFoundException;
import com.trackIt.api.exception.TaskNameAlreadyFoundException;
import com.trackIt.api.exception.TaskNotFoundException;
import com.trackIt.api.mapper.EntityMapper;
import com.trackIt.api.model.Project;
import com.trackIt.api.model.Task;
import com.trackIt.api.model.TaskAssignee;
import com.trackIt.api.repository.ProjectRepository;
import com.trackIt.api.repository.TaskAssigneeRepository;
import com.trackIt.api.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.trackIt.api.Utils.Utility.generateRandomString;
import static com.trackIt.api.mapper.EntityMapper.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class TaskService {


    private final TaskRepository taskRepository;
    private final TaskAssigneeRepository taskAssigneeRepository;
    private final ProjectRepository projectRepository;

    public Task createTask(TaskRequest request) {
        taskRepository.findByTaskName(request.taskName()).ifPresent(existing -> {
            throw new TaskNameAlreadyFoundException(String.format("Task name already exists '%s'", request.taskName()));
        });
        Project project = projectRepository.findByProjectName(request.projectName())
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with name " + request.projectName()));
        String commonTaskId = generateRandomString();
        Task currentTask = EntityMapper.mapToTaskBuilder(request, commonTaskId, project);
        List<TaskAssignee> taskAssignees = EntityMapper.mapToTaskAssigneeBuilder(request, currentTask, commonTaskId);
        taskRepository.save(currentTask);
        taskAssigneeRepository.saveAll(taskAssignees);
        return currentTask;
    }



    public List<TaskResponse> listTasks() {
        List<Object[]> results = taskRepository.findTaskWithAssignees();

        return results.stream()
                .map(row -> new TaskResponse(
                        (String) row[0],
                        (String) row[1],
                        (String) row[2],
                        (String) row[3],
                        (String) row[4],
                        (String) row[5],
                        (row[6] != null) ? ((java.sql.Timestamp) row[6]).toLocalDateTime() : null,
                        (row[7] != null) ? ((java.sql.Timestamp) row[7]).toLocalDateTime() : null,
                        (row[8] != null) ? BigInteger.valueOf(((Number) row[8]).longValue()) : null,
                        (row[9] != null) ? BigInteger.valueOf(((Number) row[9]).longValue()) : null,
                        (row[10] != null) ? Arrays.asList(((String) row[10]).split(", ")) : new ArrayList<>(),
                        (String) row[11]
                        ))
                .toList();
    }


    public TaskResponse listTaskById(String taskId) {

        return taskRepository.findByTaskId(taskId)
                .map(task -> {
                    logger.info("Task found with ID: {}", taskId);
                    Optional<List<String>> taskAssigneeList = taskAssigneeRepository.findByTaskId(taskId)
                            .map(assigneeList -> {
                                return assigneeList.stream().map(TaskAssignee::getAssignee)
                                        .collect(Collectors.toList());
                            });

                    return new TaskResponse(
                            task.getTaskId(),
                            task.getDescription(),
                            task.getTaskName(),
                            task.getPriority(),
                            task.getAssigner(),
                            task.getStatus(),
                            task.getStartDate(),
                            task.getDueDate(),
                            task.getTimeTracked(),
                            task.getTimeEstimate(),
                            taskAssigneeList.get(),null
                    );
                })
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id " + taskId));
    }

    public List<UserTaskDto> listTasksByUser(String user) {
        return mapResultsToDto(taskRepository.findTasksByAssignee(user));
    }

    public static List<UserTaskDto> mapResultsToDto(List<Object[]> results) {
        List<UserTaskDto> dtos = new ArrayList<>();
        for (Object[] row : results) {
            List<String> assignees = Arrays.asList(((String) row[4]).split(","));
            dtos.add(new UserTaskDto(
                    (String) row[0],
                    (String) row[1],
                    (String) row[2],
                    (String) row[3],
                    assignees,
                    (String) row[5],
                    (String) row[6],
                    ((BigDecimal) row[7]).toBigInteger(),
                    ((BigDecimal) row[8]).toBigInteger(),
                    ((Timestamp) row[9]).toLocalDateTime(),
                    ((Timestamp) row[10]).toLocalDateTime()
            ));
        }
        return dtos;
    }



    public Task updateTaskDetails(Task task, String taskId) {
        return taskRepository.findByTaskId(taskId)
                .map(existingTask -> {
                    updateNonNullTaskFields(existingTask, task);
                    taskRepository.save(existingTask);
                    return existingTask;
                })
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id " + taskId));
    }


    public String deleteTaskById(String taskId) {
        return taskRepository.findByTaskId(taskId)
                .map(existingTask -> {
                    taskRepository.deleteByTaskId(taskId);
                    return "Task deleted successfully";
                })
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id " + taskId));
    }


    public String updateAssignee(AssigneeRequest assigneeRequest) {
        try {
            switch (assigneeRequest.action().toUpperCase()) {
                case "ADD_ASSIGNEE" -> insertNewAssignee(assigneeRequest);
                case "REMOVE_ASSIGNEE" -> removeAssignee(assigneeRequest);
            }
            return "Assignee updated..!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Assignee updation failure..!";
        }
    }

    private void removeAssignee(AssigneeRequest assigneeRequest) {
        List<TaskAssignee> taskAssignees = taskAssigneeRepository.findByTaskIdAndAssignee(assigneeRequest.taskId(), assigneeRequest.assigneeList());
        if (!taskAssignees.isEmpty()) {
            taskAssigneeRepository.removeAssignee(assigneeRequest.taskId(), assigneeRequest.assigneeList());
        }
    }

    private void insertNewAssignee(AssigneeRequest assigneeRequest) {
        List<TaskAssignee> taskList = taskAssigneeRepository.findByTaskId(assigneeRequest.taskId())
                .orElse(List.of());
        Task task;
        if (taskList.isEmpty()) {
            task = taskRepository.findByTaskId(assigneeRequest.taskId())
                    .orElseThrow(() -> new IllegalArgumentException("Task not found for ID: " + assigneeRequest.taskId()));
        } else {
            task = taskList.get(0).getTask();
        }
        for (String assignee : assigneeRequest.assigneeList()) {
            TaskAssignee taskAssignee = TaskAssignee.builder()
                    .taskId(assigneeRequest.taskId())
                    .task(task)
                    .assignee(assignee)
                    .assigner(assigneeRequest.assigner())
                    .build();
            taskAssigneeRepository.save(taskAssignee);
        }
    }


}


