package com.example.web.repository;

import com.example.web.model.dto.board.BoardListDto;
import com.example.web.model.entity.BoardComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface BoardCommentRepository extends JpaRepository<BoardComment, Long> {
    List<BoardComment> findAllByBidOrderByParentBcid(long bid);

    @Transactional
    int deleteAllByBid(long bid);

    @Transactional
    @Modifying
    @Query(value = "UPDATE board_comment SET backup_content = comment_content, comment_content = '삭제되었습니다.' WHERE bcid = :bcid", nativeQuery = true)
    void deleteCommentHasReComment(@Param("bcid") long bcid);

    Long countByParentBcid(Long bcid);

    Page<BoardComment> findAllByCommentWriterOrderByInsertTimeDesc(String CommentWriter, Pageable pageable);
}
