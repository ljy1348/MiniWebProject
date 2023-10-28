package com.example.web.repository;

import com.example.web.model.entity.BoardComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface BoardCommentRepository extends JpaRepository<BoardComment, Long> {
    List<BoardComment> findAllByBidOrderByParentBcid(long bid);

    @Transactional
    int deleteAllByBid(long bid);
}
