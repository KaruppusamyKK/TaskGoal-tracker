package com.trackIt.api.controller;
import com.trackIt.api.dto.response.ResponseHandler;
import com.trackIt.api.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/chat")
@Slf4j
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;


    @GetMapping("/getChatsByTaskId")
    public ResponseEntity<?> getChatsByTaskId(@RequestParam String taskId){
        return ResponseHandler.handleResponse(() -> chatService.getChatsByTaskId(taskId));
    }

//    @PostMapping("/saveMultimedia")
//    public ResponseEntity<?> saveMultimedia(@RequestParam String taskId){
//        return ResponseHandler.handleResponse(() -> chatService.saveMultimedia(taskId));
//    }



}
