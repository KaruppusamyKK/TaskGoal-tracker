package com.trackIt.api.repository;

import com.trackIt.api.dto.UserTaskDto;
import com.trackIt.api.dto.response.ChatDto;
import com.trackIt.api.model.Chat;
import com.trackIt.api.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat,Long> {


    List<ChatDto> findByTaskId(String taskId);



}
