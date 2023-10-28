package com.example.web.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
@RequestMapping("/api")
public class NotificationController {

    private final Map<String, SseEmitter> sseEmitterMap = new ConcurrentHashMap<>();

//    sse 연결용
    @GetMapping(value="/notification", produces = "text/event-stream;charset=UTF-8")
    public SseEmitter connect(@RequestParam String username) {
        log.info("sse 연결 요청 들어옴");
        SseEmitter sseEmitter = new SseEmitter();
        if (sseEmitterMap.containsKey(username)) {
            log.info("sse 연결이 이미 존재함");
            return sseEmitterMap.get(username);
        }
        sseEmitterMap.put(username,sseEmitter);

        sseEmitter.onTimeout(() -> sseEmitterMap.remove(username));
        sseEmitter.onCompletion(() -> sseEmitterMap.remove(username));
        log.info("sse 연결 요청 처리됨");
        return sseEmitter;
    }

//    @GetMapping("/test")
//    public ResponseEntity<?> test() {
//        sendNotification("a","aaaaa");
//        return new ResponseEntity<>(HttpStatus.OK);
//    }

    public void sendNotification(String username, String message) {
        SseEmitter sseEmitter = sseEmitterMap.get(username);
        log.info("sse 메세지 함수 실행");
        if (sseEmitter != null) {
            try {
        log.info("sse 메세지 보내기 성공");
                sseEmitter.send(message);
            } catch (IOException e) {
        log.info("sse 만료됨");
                sseEmitterMap.remove(username);
            }
        }
    }
}
