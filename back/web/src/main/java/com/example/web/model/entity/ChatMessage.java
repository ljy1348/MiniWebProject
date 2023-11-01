package com.example.web.model.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ChatMessage {
    private String content;
    private String sender;
    private MessageType type;
    private Date timestamp;

    // getters and setters

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
}
