package com.trackIt.api.mapper;
import com.trackIt.api.Utils.Utility;
import com.trackIt.api.dto.Message;
import com.trackIt.api.model.Chat;
import com.trackIt.api.model.Task;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.trackIt.api.Utils.Utility.*;

public class EntityMapper {


    public static Task mapToTaskBuilder(Task task){
        return new Task().builder()
                .taskId(generateRandomString())
                .description(task.getDescription())
                .taskName(task.getTaskName())
                .priority(task.getPriority())
                .assignee(task.getAssignee())
                .assigner(task.getAssigner())
                .status(task.getStatus())
                .startDate(task.getStartDate())
                .dueDate(task.getDueDate())
                .timeTracked(task.getTimeTracked())
                .timeEstimate(task.getTimeEstimate())
                .build();
    }

    public static void updateNonNullFields(Task existingTask, Task newTask) {
        Optional.ofNullable(newTask.getDescription()).ifPresent(existingTask::setDescription);
        Optional.ofNullable(newTask.getTaskName()).ifPresent(existingTask::setTaskName);
        Optional.ofNullable(newTask.getPriority()).ifPresent(existingTask::setPriority);
        Optional.ofNullable(newTask.getAssignee()).ifPresent(existingTask::setAssignee);
        Optional.ofNullable(newTask.getAssigner()).ifPresent(existingTask::setAssigner);
        Optional.ofNullable(newTask.getStatus()).ifPresent(existingTask::setStatus);
        Optional.ofNullable(newTask.getTimeTracked()).ifPresent(existingTask::setTimeTracked);
        Optional.ofNullable(newTask.getTimeEstimate()).ifPresent(existingTask::setTimeEstimate);
        Optional.ofNullable(newTask.getStartDate()).ifPresent(existingTask::setStartDate);
        Optional.ofNullable(newTask.getDueDate()).ifPresent(existingTask::setDueDate);
    }

    public static Chat mapToChatBuilder(Message request,Task task) {
        return Chat.builder()
                .sender(request.sender())
                .content(request.content())
                .taskId(request.taskId())
                .chatId(Utility.generateRandomString())
                .task(task)
                .build();
    }


}
