package com.example.web.model.entity;

import com.example.web.model.common.BaseTimeEntity;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;

/**
 * packageName : com.example.web.model.entity
 * fileName : Board
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
@Entity
@Table(name="BOARD")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@DynamicUpdate
// soft delete
@Where(clause = "DELETE_YN = 'N'")
@SQLDelete(sql = "UPDATE BOARD SET DELETE_YN = 'Y', DELETE_TIME=NOW() WHERE BID = ?")
public class Board extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bid;
    private String title;
    private String writer;
    @Lob
    private String content;
    @Column(columnDefinition = "int default 0")
    private Integer views;
    @Column(columnDefinition = "int default 0")
    private Integer vote;
    @Column(columnDefinition = "int default 0")
    private Integer commentCount;
    @Column(columnDefinition = "boolean default false")
    private Boolean isFile;
    @Column(columnDefinition = "boolean default false")
    private Boolean isPin;
}
