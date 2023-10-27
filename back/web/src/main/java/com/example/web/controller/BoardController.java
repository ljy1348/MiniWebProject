package com.example.web.controller;

import com.example.web.model.dto.board.BoardListDto;
import com.example.web.model.entity.Board;
import com.example.web.repository.BoardRepository;
import com.example.web.service.BoardService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * packageName : com.example.web.controller
 * fileName : BoardController
 * author : GGG
 * date : 2023-10-27
 * description :
 * 요약 :
 * <p>
 * ===========================================================
 * DATE            AUTHOR             NOTE
 * —————————————————————————————
 * 2023-10-27         GGG          최초 생성
 */
@Slf4j
@RestController
@RequestMapping("/api/board")
public class BoardController {
    @Autowired
    BoardService boardService;

    @GetMapping("")
    public ResponseEntity<?> findAll(Pageable pageable) {
        try {
            Page<BoardListDto> page = boardService.findAllBy(pageable);
            Map<String, Object> map = new HashMap<>();

            map.put("boardList", page.getContent());
            map.put("totalPages", page.getTotalPages());
            log.info(map.get("boardList").toString());
            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/user")
    public ResponseEntity<Object> save(@RequestParam(name = "file", required = false) MultipartFile file, @RequestParam("board") String board) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Board board1 = objectMapper.readValue(board, Board.class);
            boardService.save(board1);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/user")
    public ResponseEntity<Object> edit(@RequestBody Board board) {
        try {
            Board board1 = boardService.save(board);
            return new ResponseEntity<>(board1, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/user/{bid}")
    public ResponseEntity<Object> delete(@PathVariable long bid) {
        try {
            boolean isCheck = boardService.delete(bid);
            if (isCheck) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
