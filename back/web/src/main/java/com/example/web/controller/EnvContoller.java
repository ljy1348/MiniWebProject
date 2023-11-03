package com.example.web.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EnvContoller {

    @Value("${database_url:설정 안되어 있는뎁쇼}")
//    @Value("${DATABASE_URL:설정 안되어 있는뎁쇼}")
    private String databaseUrl;

    @GetMapping("/env/database")
    public String databaseUrl () {
        return databaseUrl;
    }
}
