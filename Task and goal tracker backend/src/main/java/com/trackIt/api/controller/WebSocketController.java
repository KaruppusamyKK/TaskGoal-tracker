package com.trackIt.api.controller;
import com.trackIt.api.dto.ChatMessage;
import com.trackIt.api.dto.request.NotificationRequest;
import com.trackIt.api.service.ChatService;
import com.trackIt.api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigInteger;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
public class WebSocketController {

    private final ChatService chatService;
    private final NotificationService notificationService;


    @MessageMapping("/chatMessage")
    @SendTo("/chatMessageTo/send")
    public ResponseEntity<ChatMessage> sendPayLoad(ChatMessage request){
        chatService.saveChatMessages(request);
        return ResponseEntity.ok(request);
    }

    @MessageMapping("/message")
    @SendTo("/messageTo/send")
    public ResponseEntity<Map<String,BigInteger>> notify(NotificationRequest request){
        return ResponseEntity.ok(notificationService.saveNotificationCount(request.getUsers()));
    }


}
