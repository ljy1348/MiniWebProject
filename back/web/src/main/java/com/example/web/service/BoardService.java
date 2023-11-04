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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collection;
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

    @Transactional
    public boolean delete(long bid) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Optional<Board> optional = boardRepository.findById(bid);
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        boolean isAdmin = authorities.stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
            if (optional.isPresent()) {
                if (optional.get().getWriter().equals(auth.getName()) || isAdmin) {

            boardRepository.deleteById(bid);
//            boardCommentRepository.deleteAllByBid(bid);
            return true;
                } else {
                    return false;
                }
        } else {
            return false;
        }
    }

    public Optional<Board> findById(long bid) {
        return boardRepository.findById(bid);
    }

    public Page<BoardListDto> findAllByDelete(Pageable pageable) {
        return boardRepository.findAllByDeleteYN(pageable);
    }

    public Page<BoardListDto> findAllByWriter(String writer, Pageable pageable) {
        return boardRepository.findAllByWriterOrderByInsertTimeDesc(writer, pageable);
    }

    public boolean restoreBoardByBid(long bid) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        boolean isAdmin = authorities.stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
        boardRepository.restoreBoardByBid(bid);
            return true;
        } else {
            return false;
        }
    }
}
