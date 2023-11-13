package com.example.web.controller;

import com.example.web.model.entity.ChatMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.List;

@Slf4j
@RestController
@CrossOrigin(origins = "http://${ec2.host}:${front.port}")
public class WebsocketController {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    private ListOperations<String, Object> listOperations;

    @PostConstruct
    public void init() {
        listOperations = redisTemplate.opsForList();
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public String send(String message) throws Exception {

            log.info("여기 됨");
        try {
           log.info("여기 됨 2");
            listOperations.rightPush("chatList", message);
            while (listOperations.size("chatList") > 50) {
                listOperations.leftPop("chatList");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return message;
    }

    @GetMapping("/api/chat")
    public ResponseEntity<Object> chatList () {
        log.info("여기 됨 2");
        List<Object> list = listOperations.range("chatList", 0, -1);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}
