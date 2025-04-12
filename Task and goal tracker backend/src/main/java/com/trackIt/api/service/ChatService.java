package com.trackIt.api.service;

import com.trackIt.api.dto.ChatMessage;
import com.trackIt.api.dto.response.ChatDto;
import com.trackIt.api.exception.TaskNotFoundException;
import com.trackIt.api.repository.ChatRepository;
import com.trackIt.api.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;
import static com.trackIt.api.mapper.EntityMapper.*;
@Service
@Slf4j
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final TaskRepository taskRepository;

    public void saveChatMessages(ChatMessage request) {
        taskRepository.findByTaskId(request.taskId())
                .map(currentTask -> {
                    return chatRepository.save(mapToChatBuilder(request, currentTask));
                }).orElseThrow(() -> new TaskNotFoundException("Task not found with ID " + request.taskId()));

    }

    public List<ChatDto> getChatsByTaskId(String taskId) {
        return taskRepository.findByTaskId(taskId)
                .map(task -> chatRepository.findByTaskId(taskId))
                .filter(chats -> !chats.isEmpty())
                .orElseGet(()->{
                    logger.warn("No chats to render..");
                    return Collections.emptyList();
                });
    }

}
