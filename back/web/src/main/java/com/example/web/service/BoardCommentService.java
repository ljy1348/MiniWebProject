package com.example.web.service;

import com.example.web.model.entity.Board;
import com.example.web.model.entity.BoardComment;
import com.example.web.repository.BoardCommentRepository;
import com.example.web.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BoardCommentService {
    @Autowired
    BoardCommentRepository boardCommentRepository;

    @Autowired
    BoardRepository boardRepository;

    public List<BoardComment> findAllByBid(long bid) {
        return boardCommentRepository.findAllByBidOrderByParentBcid(bid);
    }

    public BoardComment addComment(BoardComment boardComment) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boardComment.setCommentWriter(auth.getName());
        boardRepository.addCommentCount(boardComment.getBid());
        return boardCommentRepository.save(boardComment);
    }

    public boolean editComment(BoardComment boardComment) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (boardComment.getCommentWriter().equals(auth.getName())) {
            boardCommentRepository.save(boardComment);
            return true;
        } else {
            return false;
        }
    }

    public boolean removeComment(long bcid) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<BoardComment> optional = boardCommentRepository.findById(bcid);
        if (optional.isPresent()) {
            if (auth.getName().equals(optional.get().getCommentWriter())) {
                boardCommentRepository.deleteById(bcid);
                boardRepository.deleteCommentCount(optional.get().getBid());
                return true;
            } else {
                throw new UsernameNotFoundException("작성자가 아닙니다.");
            }
        } else {
            return false;
        }
    }
}
