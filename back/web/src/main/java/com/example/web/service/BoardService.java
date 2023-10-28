package com.example.web.service;

import com.example.web.model.dto.board.BoardListDto;
import com.example.web.model.entity.Board;
import com.example.web.model.entity.BoardComment;
import com.example.web.model.entity.User;
import com.example.web.repository.BoardCommentRepository;
import com.example.web.repository.BoardRepository;
import com.example.web.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * packageName : com.example.web.service
 * fileName : BoardService
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
@Service
public class BoardService {
    @Autowired
    BoardRepository boardRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    BoardCommentRepository boardCommentRepository;

    public Page<BoardListDto> findAllBy(Pageable pageable) {

        return boardRepository.findAllByOrderByInsertTimeDesc(pageable);
    }

    public Board save(Board board) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        board.setWriter(auth.getName());
        return boardRepository.save(board);
    }

    public boolean delete(long bid) {
        if (boardRepository.existsById(bid)) {
            boardRepository.deleteById(bid);
            boardCommentRepository.deleteAllByBid(bid);
            return true;
        } else {
            return false;
        }
    }

    public Optional<Board> findById(long bid) {
        return boardRepository.findById(bid);
    }
}
