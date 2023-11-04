package com.example.web.model.dto.board;

import java.time.LocalDateTime;

/**
 * packageName : com.example.web.model.dto.board
 * fileName : BoardListDto
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
public interface BoardListDto {
    Long getBid();
    String getTitle();
    String getWriter();
    String getInsertTime();
    Integer getViews();
    Integer getCommentCount();
    Integer getVote();
    Boolean getIsPin();
    Boolean getIsFile();
//    String getContent();
    Long getImgFid();
}
