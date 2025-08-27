package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.dtos.ChatRequestDTO;
import com.Entra21.Buzix.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @PostMapping("/maintenance")
    public String maintenance(@RequestBody ChatRequestDTO req) {
        return chatService.askChat(req);
    }
}
