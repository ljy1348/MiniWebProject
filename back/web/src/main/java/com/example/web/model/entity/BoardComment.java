package com.example.web.model.entity;

import com.example.web.model.common.BaseTimeEntity;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Entity
@Table(name="BOARD_COMMENT")
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
@SQLDelete(sql = "UPDATE BOARD_COMMENT SET DELETE_YN = 'Y', DELETE_TIME=NOW() WHERE BCID = ?")
public class BoardComment extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bcid;
    private String commentWriter;
    @Lob
    private String commentContent;
    private Long bid;
    @Column(columnDefinition = "int default 0")
    private Long parentBcid;
    private String parentWriter;
    @Column(columnDefinition = "boolean default false")
    private Boolean isReComment;
}

