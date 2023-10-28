package com.example.web.controller;

import com.example.web.model.entity.BoardComment;
import com.example.web.service.BoardCommentService;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/board")
public class BoardCommentController {
    @Autowired
    BoardCommentService boardCommentService;

    @GetMapping("/comment/{bid}")
    public ResponseEntity<Object> findAllByBid(@PathVariable long bid) {
        try {
            List<BoardComment> boardCommentList = boardCommentService.findAllByBid(bid);
            return new ResponseEntity<>(boardCommentList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/user/comment")
    public ResponseEntity<Object> addComment(@RequestBody BoardComment boardComment) {
            try {
        BoardComment boardComment1 = boardCommentService.addComment(boardComment);
        return new ResponseEntity<>(boardComment1, HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    @PutMapping("/user/comment/edit")
    public ResponseEntity<Object> editComment(@RequestBody BoardComment boardComment) {
        try {
            boolean check = boardCommentService.editComment(boardComment);
            if (check) {
            return new ResponseEntity<>(HttpStatus.OK);

            }else {
                return new ResponseEntity<>("아이디가 일치하지 않습니다.",HttpStatus.NOT_MODIFIED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/user/comment/delete/{bcid}")
    public ResponseEntity<Object> deleteComment(@PathVariable long bcid) {
        try {
            boolean check = boardCommentService.removeComment(bcid);
            if (check) {
                return new ResponseEntity<>(HttpStatus.OK);
            }else {
                return new ResponseEntity<>("아이디가 일치하지 않습니다.",HttpStatus.FORBIDDEN);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
