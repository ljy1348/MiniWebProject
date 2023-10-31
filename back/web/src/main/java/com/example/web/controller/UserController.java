package com.example.web.controller;

import com.example.web.model.entity.User;
import com.example.web.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;

@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody User user) {
        System.out.println("레지스터 시작");
        try {
            userService.registry(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody User user, HttpServletResponse response) {
        log.info("로그인 요청");
        try {
            String st = userService.login(user);
            response.addHeader("Authorization", "Bearer " + st);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch(Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/test")
    public ResponseEntity<?> test() {
        try {
            return new ResponseEntity<>("로그인 성공!",HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
