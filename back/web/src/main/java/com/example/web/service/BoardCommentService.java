package com.example.web.service;

import com.example.web.model.entity.Board;
import com.example.web.model.entity.BoardComment;
import com.example.web.model.entity.User;
import com.example.web.repository.BoardCommentRepository;
import com.example.web.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
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

//    댓글 삭제
    public boolean removeComment(long bcid) {
//        인증 정보 받아오기
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        댓글 정보 가져오기
        Optional<BoardComment> optional = boardCommentRepository.findById(bcid);
//        인증 정보에서 권한 확인
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        boolean isAdmin = authorities.stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
//        댓글 정보가 존재한다면
        if (optional.isPresent()) {
//            댓글 작성자와 인증 정보가 일치한다면 or 인증 권한이 관리자라면 진행
            if (auth.getName().equals(optional.get().getCommentWriter()) || isAdmin) {
//                댓글에 대댓글이 존재할 경우 내용 백업 후 삭제되었습니다. 로 내용 변경
//                대댓글이 없을 경우 댓글을 삭제하고 게시글의 댓글 카운트 -1
                if (boardCommentRepository.countByParentBcid(bcid) > 1) {
                    boardCommentRepository.deleteCommentHasReComment(bcid);
                } else {
                boardCommentRepository.deleteById(bcid);
                boardRepository.deleteCommentCount(optional.get().getBid());
                }
                return true;
            } else {
                throw new UsernameNotFoundException("작성자가 아닙니다.");
            }
        } else {
            return false;
        }
    }

    public Page<BoardComment> findByCommentWriter(String commentWriter, Pageable pageable) {
        return boardCommentRepository.findAllByCommentWriterOrderByInsertTimeDesc(commentWriter,pageable);
    }
}
