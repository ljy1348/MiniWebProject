package com.example.web.repository;

import com.example.web.model.dto.board.BoardListDto;
import com.example.web.model.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * packageName : com.example.web.repository
 * fileName : BoardRepository
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
@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    Page<BoardListDto> findAllByOrderByInsertTimeDesc(Pageable pageable);
}
