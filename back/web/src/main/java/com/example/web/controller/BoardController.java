package com.example.web.controller;

import com.example.web.model.dto.FileIdDto;
import com.example.web.model.dto.board.BoardListDto;
import com.example.web.model.entity.Board;
import com.example.web.model.entity.BoardComment;
import com.example.web.model.entity.File;
import com.example.web.repository.BoardRepository;
import com.example.web.service.BoardCommentService;
import com.example.web.service.BoardService;
import com.example.web.service.FileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BoardController {
    @Autowired
    BoardService boardService;
    @Autowired
    FileService fileService;
    @Autowired
    BoardCommentService boardCommentService;

//    @GetMapping("")
//    public ResponseEntity<?> findAll(Pageable pageable) {
//        try {
//            Page<BoardListDto> page = boardService.findAllBy(pageable);
//            Map<String, Object> map = new HashMap<>();
//
//            map.put("boardList", page.getContent());
//            map.put("totalPages", page.getTotalPages());
//            log.info(map.get("boardList").toString());
//            return new ResponseEntity<>(map, HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @GetMapping("")
    public ResponseEntity<?> findAll(@RequestParam String searchTitle, @RequestParam String searchContent, Pageable pageable) {
        try {
            Page<BoardListDto> page = boardService.findSearch(searchTitle, searchContent, pageable);
            Map<String, Object> map = new HashMap<>();

            map.put("boardList", page.getContent());
            map.put("totalPages", page.getTotalPages());
            log.info(map.get("boardList").toString());
            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    @PostMapping("/user")
    public ResponseEntity<Object> save(@RequestParam(name = "file", required = false) MultipartFile file, @RequestParam("board") String board) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
//            board객체 가져오기
            Board board1 = objectMapper.readValue(board, Board.class);
//            board객체 db에 저장하기
            Board boardSave = boardService.save(board1);
//            저장된 객체의 bid 가져오기
            final long BID = boardSave.getBid();
//            파일이 같이 왔다면
            if (file != null) {
            File file1 = new File();
//            파일 이름 설정
            file1.setFileName(file.getOriginalFilename());
//            파일 타입 설정
            file1.setFileType(file.getContentType());
//            파일 데이터 설정
            file1.setFileData(file.getBytes());
//            파일 bid 설정
            file1.setBid(BID);
//            file 객체 db에 저장
            fileService.addFile(file1);
            }
            Long firstImg = fileService.uploadImg(boardSave);
            boardSave.setImgFid(firstImg);
//            에러가 없다면 ok 리턴
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

    @GetMapping("/{bid}")
    public ResponseEntity<?> findById(@PathVariable long bid) {
        try {
            Optional<Board> optional = boardService.findById(bid);
            if (optional.isPresent()) {
                List<FileIdDto> list = fileService.findFidByBid(bid);
                Map<String, Object> map = new HashMap<>();
                map.put("board", optional.get());
                map.put("list", list);
                return new ResponseEntity<>(map,HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/admin/deletion_board")
    public ResponseEntity<?> findAllByDelete(Pageable pageable) {
        try {
            Page<BoardListDto> page = boardService.findAllByDelete(pageable);
            Map<String, Object> map = new HashMap<>();

            map.put("boardList", page.getContent());
            map.put("totalPages", page.getTotalPages());
            log.info(map.get("boardList").toString());
            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<Object> findAllByWriter(@RequestParam String writer, Pageable pageable) {
        try {

        Page<BoardListDto> boardListDtos = boardService.findAllByWriter(writer, pageable);
        Page<BoardComment> boardComments = boardCommentService.findByCommentWriter(writer, pageable);

        HashMap<String, Object> map = new HashMap<>();
        map.put("boardList", boardListDtos.getContent());
        map.put("comment", boardComments.getContent());
        return new ResponseEntity<>(map, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping("/admin/recent/{bid}")
    public ResponseEntity<Object> recentBoard(@PathVariable long bid) {
        try {
            boolean isResult = boardService.restoreBoardByBid(bid);
            if (isResult) return new ResponseEntity<>(HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



//    테스트 코드 나중에 삭제
    @Autowired
    NotificationController notificationController;

        @GetMapping("/test/{username}")
    public ResponseEntity<?> test(@PathVariable String username) {
        notificationController.sendNotification(username,username+" : 에게 알림이 왔습니다.");
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
