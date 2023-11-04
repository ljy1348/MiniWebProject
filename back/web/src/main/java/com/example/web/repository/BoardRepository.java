package com.example.web.repository;

import com.example.web.model.dto.board.BoardListDto;
import com.example.web.model.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    @Modifying
    @Query(value = "UPDATE board SET comment_count = comment_count + 1 WHERE bid = :bid", nativeQuery = true)
    void addCommentCount(@Param("bid") long bid);

    @Transactional
    @Modifying
    @Query(value = "UPDATE board SET comment_count = comment_count - 1 WHERE bid = :bid", nativeQuery = true)
    void deleteCommentCount(@Param("bid") long bid);

    @Query(value = "SELECT BID," +
            "TITLE, WRITER, INSERT_TIME as insertTime, VIEWS, COMMENT_COUNT as commentCount," +
            "VOTE, IS_PIN as isPin,IS_FILE as isFile,IMG_FID as imgFid FROM BOARD WHERE DELETE_YN = 'Y' ORDER BY DELETE_TIME DESC",
            countQuery = "SELECT count(*) FROM BOARD WHERE DELETE_YN = 'Y'",
            nativeQuery = true)
    Page<BoardListDto> findAllByDeleteYN(Pageable pageable);

    Page<BoardListDto> findAllByWriterOrderByInsertTimeDesc(String writer, Pageable pageable);

    @Transactional
    @Modifying
    @Query(value = "UPDATE board SET delete_yn = 'N' WHERE bid = :bid", nativeQuery = true)
    void restoreBoardByBid(@Param("bid") long bid);
}
