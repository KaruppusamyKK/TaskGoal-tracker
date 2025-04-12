package com.trackIt.api.service;

import com.trackIt.api.dto.UserTaskDto;
import com.trackIt.api.dto.request.AssigneeRequest;
import com.trackIt.api.dto.response.NotificationDto;
import com.trackIt.api.dto.response.NotificationResponse;
import com.trackIt.api.exception.NotificationNotFoundException;
import com.trackIt.api.exception.UserNotFoundException;
import com.trackIt.api.model.Notification;
import com.trackIt.api.model.Task;
import com.trackIt.api.model.TaskAssignee;
import com.trackIt.api.model.User;
import com.trackIt.api.repository.NotificationRepository;
import com.trackIt.api.repository.TaskAssigneeRepository;
import com.trackIt.api.repository.TaskRepository;
import com.trackIt.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.trackIt.api.mapper.EntityMapper.*;
import static com.trackIt.api.service.TaskService.mapResultsToDto;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;


    public void saveUserNotifications(AssigneeRequest notificationRequest) {
        String message = buildNotificationAction(notificationRequest);
        mapNotificationEntity(notificationRequest, message).forEach(notificationRepository::save);
        logger.info("Notification saved successfully");
    }


    private static String buildNotificationAction(AssigneeRequest request) {
        return switch (request.action().toUpperCase()) {
            case "REMOVE_ASSIGNEE" -> "You have been removed as assignee from the task " + request.taskName();
            case "ADD_ASSIGNEE" -> "You have been assigned as assignee to the task " + request.taskName();
            default -> throw new IllegalStateException("Unexpected value: " + request.action().toUpperCase());
        };
    }


    public Map<String, BigInteger> saveNotificationCount(List<String> users) {
        Map<String, BigInteger> notificationCountMap = new HashMap<>();
        users.forEach(username -> {
            userRepository.findByUsername(username)
                    .map(userData -> {
                        userData.setNotificationCount(userData.getNotificationCount().add(BigInteger.ONE));
                        userRepository.save(userData);
                        BigInteger count = getNotificationCount(userData.getUsername());
                        notificationCountMap.put(username, count);
                        return userData;
                    })
                    .orElseThrow(() -> new UserNotFoundException("User not found with name " + username));
        });
        return notificationCountMap;
    }


    public BigInteger getNotificationCount(String user) {
        return userRepository.findByUsername(user)
                .map(userData -> userData.getNotificationCount() == null ? BigInteger.ONE : userData.getNotificationCount())
                .orElseThrow(() -> new UserNotFoundException("User not found with name " + user));
    }


    public NotificationDto getUserNotifications(String user) {
        List<NotificationResponse> notificationResponses = new ArrayList<>();

        notificationRepository.findByReceiver(user).forEach(notification -> {
            NotificationResponse notificationResponse = new NotificationResponse(
                    notification.getTaskName(),
                    notification.getDescription(),
                    notification.getSender(),
                    notification.getNotificationReceiver(),
                    notification.getMessage(),
                    notification.getTimestamp(),
                    notification.getNotificationId()
            );
            notificationResponses.add(notificationResponse);
        });
        List<UserTaskDto> userTaskDtos = mapResultsToDto(taskRepository.findTasksByAssignee(user));
        return new NotificationDto(notificationResponses, userTaskDtos);
    }

    public String clearNotificationCount(String user) {
        return userRepository.findByUsername(user)
                .map(userData -> {
                    userData.setNotificationCount(BigInteger.ZERO);
                    userRepository.save(userData);
                    return "Notification count reset success";
                })
                .orElseThrow(() -> new UserNotFoundException("User not found with name " + user));
    }

    public String deleteNotification(String notificationId) {
        notificationRepository.findByNotificationId(notificationId)
                .ifPresentOrElse(notification -> notificationRepository.deleteByNotificationId(notificationId),
                        () -> new NotificationNotFoundException("Notification not found with id " + notificationId));
        return "Notification deleted successfully";
    }


}
