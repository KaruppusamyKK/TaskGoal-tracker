package com.trackIt.api.controller;
import com.trackIt.api.dto.Message;
import com.trackIt.api.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
public class WebSocketController {

    private final ChatService chatService;


    @MessageMapping("/message")
    @SendTo("/messageTo/send")
    public ResponseEntity<Message> sendPayLoad(Message request){
        logger.info("Received req in webSocket are {} ",request);
        chatService.saveChatMessages(request);
        return ResponseEntity.ok(request);
    }
}
